const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
import path from "path"
import { IUser, IUserInvitation } from "../models/user.models"


const VERIFY_PROTO_PATH = path.join("/app/metaVite_Proto_Files/auth.proto")
const packageDefinition = protoLoader.loadSync(VERIFY_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

const verifyProto = grpc.loadPackageDefinition(packageDefinition).auth


// const verify_client = new (verifyProto as any).AuthService(
//     "localhost:3005",
//     grpc.credentials.createInsecure()
// )

const verify_client = new (verifyProto as any).AuthService(
    "security-service:3005",
    grpc.credentials.createInsecure()
)

export const loginUserInDB = (username: string, password: string) => {
    return new Promise((resolve, reject) => {
        verify_client.Login(
            
            { username, password },
            (error: any, response: any) => {
                console.log('it is gouing to verify');
                
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            }
        )
    })
}
export const registerInvitation = (user: IUserInvitation) => {
    
    
    return new Promise((resolve, reject) => {
        verify_client.InvitationRegister( {user} , (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
    })
}
export const isAuthorized = (token:string,feature:string):Promise<{isAuthorized: Boolean, success: Boolean }> => {
    return new Promise((resolve, reject) => {
        verify_client.RoleAuthorization(
            { token,feature },
            (error: any, response: any) => {
                if (error) {
                    console.log('the error is',error);
                    
                    reject(error)
                } else {
                    console.log('the response is ',response);
                    
                    resolve(response)
                }
            }
        )
    })
}

