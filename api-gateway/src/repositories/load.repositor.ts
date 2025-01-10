import { IClient, ILoadData, IUser } from "../models/user.models" // Assuming IUser is defined in your models
const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
import path from "path"





const LOAD_PROTO_PATH = path.join("/app/metaVite_Proto_Files/load.proto")
const packageDefinition = protoLoader.loadSync(LOAD_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})
interface IResult {
    success:boolean
    data?:any
    message:string
}

const carrierProto = grpc.loadPackageDefinition(packageDefinition).load
// const load_client = new (carrierProto as any).LoadService(
//     "localhost:3007",
//     grpc.credentials.createInsecure()
// )
const load_client = new (carrierProto as any).LoadService(
    "load-service:3007",
    grpc.credentials.createInsecure()
)


// Adding New Load
export const addNewLoad = (load: ILoadData): Promise<IResult> => {
    console.log(load)

    return new Promise((resolve, reject) => {
        load_client.AddNewLoad(load, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
    })
}
// Fetch bids (assuming similar proto service exists)
export const fetchShipperBids = (id:string): Promise<ILoadData[]> => {
    return new Promise((resolve, reject) => {
        load_client.GetShipperBids({ id }, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                console.log(response);
                
                resolve(response)
            }
        })
    })
}
export const fetchLoadData = (id: string): Promise<ILoadData[]> => {
    return new Promise((resolve, reject) => {
        load_client.GetLoadInfo({ id }, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                console.log(response)

                resolve(response)
            }
        })
    })
}
// Fetch bids (assuming similar proto service exists)
export const fetchBids = (id:string): Promise<ILoadData[]> => {
    return new Promise((resolve, reject) => {
        load_client.GetAllBids({id}, (error: any, response: any) => {
            console.log('all bids received',response);
            
            if (error) {
                reject(error)
            } else {
                resolve(response )
            }
        })
    })
}
export const fetchActiveBids = (id: string): Promise<ILoadData[]> => {
    return new Promise((resolve, reject) => {
        console.log('the bid id is ',id);
        
        load_client.GetAllActiveBids({ id }, (error: any, response: any) => {
            console.log("all bids received", response)

            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
    })
}

export const addNewBid = (bid: string): Promise<any | null> => {
    return new Promise((resolve, reject) => {
        console.log("the bid is ", bid)

        load_client.AddBid({ bid }, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
    })
}

export const postLoadUpdate = (id: string, bidId:any): Promise<any> => {
    return new Promise((resolve, reject) => {
       
        console.log('the final in api',id,bidId);
        
        load_client.PostLoadUpdate(
            { id ,bidId},
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

