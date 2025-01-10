//

import { IUser } from "../models/user.model"


const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
import path from "path"



const PROTO_PATH = path.join("/app/metaVite_Proto_Files/auth.proto")

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})
const authProto = grpc.loadPackageDefinition(packageDefinition).auth

// const auth_client = new (authProto as any).AuthService(
//     "localhost:3001",
//     grpc.credentials.createInsecure()
// )
const auth_client = new (authProto as any).AuthService(
    "auth-service:3001",
    grpc.credentials.createInsecure()
)


export const checkUser = (username: string, password: string, role: string) => {
    return new Promise((resolve, reject) => {
        auth_client.Login(
            { username, password, role },
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            }
        )
    })
}
