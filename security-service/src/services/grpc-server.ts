import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js"
import path from "path"
const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
import { loginUser, registerInvitation, verifyInvitationToken } from "./auth.service"
import {
    IUser,
    IUserInvitation,
    IUserInvitationReturn,
} from "../models/user.model"
import authMiddleware from "../middlewares/role.middleware"
import { decodeToken } from "../controllers/token.controller"
import { getRoleDetails } from "../repositories/verify.repository"



// Define paths

const PROTO_PATH = path.join("/app/metaVite_Proto_Files/auth.proto")
console.log("Resolved proto file path:", PROTO_PATH)

// Load the .proto file with type options
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

// Create a typed object from the package definition
const verify_proto = grpc.loadPackageDefinition(packageDefinition).auth as any

// Create the gRPC server
const server = new grpc.Server()

// Middleware function to wrap service methods
const withAuthMiddleware = (method: any) => {
    return (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => {
        authMiddleware(call, () => method(call, callback))
    }
}

// Implement service methods
server.addService(verify_proto.AuthService.service, {
    Login: async (
        call: ServerUnaryCall<
            { username: string; password: string },
            { user: IUser; token: string; role: string }
        >,
        callback: sendUnaryData<{}>
    ) => {
        try {
            const { username, password } = call.request
            const result = await loginUser(username, password)
            callback(null, result)
        } catch (error) {
            callback(error as Error, null)
        }
    },
    InvitationRegister: withAuthMiddleware(
        async (
            call: ServerUnaryCall<
                { user: IUserInvitation },
                { data: IUserInvitationReturn }
            >,
            callback: sendUnaryData<{ data: IUserInvitationReturn }>
        ) => {
            try {
                const { user } = call.request
                console.log("user data from service", user)
                const data = await registerInvitation(user)
                callback(null, { data })
            } catch (error) {
                callback(error as Error, null)
            }
        }
    ),
    ValidateRegister: async (
        call: ServerUnaryCall<
            {
                user: IUserInvitation
            },
            { success: boolean; message: string }
        >,
        callback: sendUnaryData<{ success: boolean; message: string }>
    ) => {
        try {
            const user = call.request
            console.log("Validation request received:", user)

            // Verify the token
            const isValid = await verifyInvitationToken(
                user.user.email,
                user.user.companyRefId,
                user.user.invitationToken
            )

            if (!isValid) {
                return callback(null, {
                    success: false,
                    message: "Invalid token or invitation not found",
                })
            }

            callback(null, {
                success: true,
                message: "Token validation successful",
            })
        } catch (error) {
            console.error("Error in ValidateRegister:", error)
            callback(error as Error, {
                success: false,
                message: "Validation failed due to server error",
            })
        }
    },
    RoleAuthorization:async (
    call: ServerUnaryCall<
        {
            token: string;
            feature: string;
        },
        { success: boolean; isAuthorized: boolean }
    >,
    callback: sendUnaryData<{ success: boolean; isAuthorized: boolean }>
) => {
    try {
        const { token, feature } = call.request;
        console.log("Validation request received:", { token, feature });

        // Decode the token to retrieve the user information
        const user:any = await decodeToken(token);
        if (!user) {
            return callback(null, {
                success: false,
                isAuthorized: false,
            });
        }

        // Fetch the role details for the user
        const roleDetails = await getRoleDetails(user.role);
        if (!roleDetails) {
            return callback(null, {
                success: false,
                isAuthorized: false,
            });
        }

        // Check if the feature is allowed for the role
        const isAuthorized = roleDetails.allowedFeatures.includes(feature);
        if (!isAuthorized) {
            return callback(null, {
                success: false,
                isAuthorized: false,
            });
        }

        // If all checks pass, authorize the request
        return callback(null, {
            success: true,
            isAuthorized: true,
        });
    } catch (error) {
        console.error("Error in RoleAuthorization:", error);
        callback(error as Error, {
            success: false,
            isAuthorized: false,
        });
    }
}
})

// Start the gRPC server
server.bindAsync(
    "0.0.0.0:3005",
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log("Auth Service gRPC server running at http://0.0.0.0:3005")
        server.start()
    }
)
