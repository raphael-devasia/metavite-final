// import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js"
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js"
import path from "path"

import {
    
    addNewBid,
    addNewLoad,
    getAllActiveLoadInfo,
    getAllBids,
    getAllLoadInfo,
    getLoadInfo,
   
} from "./load.service"
import { IBid, ILoadData } from "../database/load.model"
import { updateLoadInfo } from "../repositories/load.repository"
const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

// Define paths
const PROTO_PATH = path.join("/app/metaVite_Proto_Files/load.proto")
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
const loadPackage = grpc.loadPackageDefinition(packageDefinition)
    .load as any

// Create the gRPC server
const server = new grpc.Server()

server.addService(loadPackage.LoadService.service, {
    AddNewLoad: async (
        call: ServerUnaryCall<
            {
                client: ILoadData
            },
            {
                success: boolean

                message: string
            }
        >,
        callback: sendUnaryData<{
            success: boolean

            message: string
        }>
    ) => {
        try {
            const load: any = call.request

            if (!load) {
                callback(null, {
                    success: false,

                    message: "No Data Available",
                })
                return
            }

            const data: { success: boolean; message: string } =
                await addNewLoad(load)

            callback(null, {
                success: data.success,

                message: data.message,
            })
        } catch (error) {
            console.error("Error in GetUser:", error)
            callback(null, {
                success: false,

                message: "Failed Add Client",
            })
        }
    },
    GetShipperBids: async (
        call: ServerUnaryCall<
            { id: string },
            { success: boolean; addresses: ILoadData[] | null; message: string }
        >,
        callback: sendUnaryData<{
            success: boolean
            bids: ILoadData[] | null
            message: string
        }>
    ) => {
        try {
            const id = call.request.id
            console.log("the id os ", id)

            const result = await getAllBids(id)
            const bids = result.bids

            console.log("received something", bids)

            console.log("received something", bids)

            if (!bids || bids.length === 0) {
                callback(null, {
                    success: false,
                    bids: null,
                    message: "No clients found",
                })
                return
            }

            callback(null, {
                success: true,
                bids,
                message: "Clients fetched successfully",
            })
        } catch (error) {
            console.error("Error in GetAllClients:", error)
            callback(null, {
                success: false,
                bids: null,
                message: "Failed to fetch clients",
            })
        }
    },
    GetLoadInfo: async (
        call: ServerUnaryCall<
            { id: string },
            { success: boolean; load: ILoadData | null; message: string }
        >,
        callback: sendUnaryData<{
            success: boolean
            load: ILoadData | null
            message: string
        }>
    ) => {
        try {
            const id = call.request.id
            console.log("the id os ", id)

            const result = await getLoadInfo(id)
            const load = result.load

            console.log("received something", load)

            console.log("received something", load)

            if (!load) {
                callback(null, {
                    success: false,
                    load: null,
                    message: "No Load found",
                })
                return
            }

            callback(null, {
                success: true,
                load,
                message: "Load fetched successfully",
            })
        } catch (error) {
            console.error("Error in Finding Load:", error)
            callback(null, {
                success: false,
                load: null,
                message: "Failed to fetch Load",
            })
        }
    },
    GetAllBids: async (
        call: ServerUnaryCall<
            { id: string },
            { success: boolean; load: ILoadData | null; message: string }
        >,
        callback: sendUnaryData<{
            success: boolean
            loads: ILoadData | null
            message: string
        }>
    ) => {
        try {
            const id: any = call.request
            const result = await getAllLoadInfo(id)
            const loads = result.load

            if (!loads) {
                callback(null, {
                    success: false,
                    loads: null,
                    message: "No Load found",
                })
                return
            }

            callback(null, {
                success: true,
                loads,
                message: "Load fetched successfully",
            })
        } catch (error) {
            console.error("Error in Finding Load:", error)
            callback(null, {
                success: false,
                loads: null,
                message: "Failed to fetch Load",
            })
        }
    },
    AddBid: async (
        call: ServerUnaryCall<
            {
                bid: IBid
            },
            {
                success: boolean

                message: string
            }
        >,
        callback: sendUnaryData<{
            success: boolean

            message: string
        }>
    ) => {
        try {
            const bid: any = call.request

            if (!bid) {
                callback(null, {
                    success: false,

                    message: "No Data Available",
                })
                return
            }

            const data: { success: boolean; message: string } = await addNewBid(
                bid
            )

            callback(null, {
                success: data.success,

                message: data.message,
            })
        } catch (error) {
            console.error("Error in GetUser:", error)
            callback(null, {
                success: false,

                message: "Failed Add Client",
            })
        }
    },
    PostLoadUpdate: async (
        call: ServerUnaryCall<
            {
                id: string
                bidId: string
            },
            {
                success: boolean
            }
        >,
        callback: sendUnaryData<{
            success: boolean

            message: string
        }>
    ) => {
        try {
            const id = call.request.id
            const bidId = call.request.bidId

            console.log("the bifd id is", bidId)

            if (!id) {
                callback(null, {
                    success: false,

                    message: "User ID is required",
                })
                return
            }

            const user = await updateLoadInfo(id, bidId)
            console.log("the data is ", user)

            if (!user.success) {
                callback(null, {
                    success: false,

                    message: user.message,
                })
                return
            }

            callback(null, {
                success: true,

                message: "Truck Updated successfully",
            })
        } catch (error) {
            console.error("Error in Updating Truck:", error)
            callback(null, {
                success: false,

                message: "Error in Updating Truck",
            })
        }
    },
    GetAllActiveBids: async (
        call: ServerUnaryCall<
            { id: string },
            { success: boolean; load: ILoadData | null; message: string }
        >,
        callback: sendUnaryData<{
            success: boolean
            loads: ILoadData | null
            message: string
        }>
    ) => {
        try {
            console.log("the data reached here")

            const id: any = call.request
            const result = await getAllActiveLoadInfo(id)
            const loads = result.load

            if (!loads) {
                callback(null, {
                    success: false,
                    loads: null,
                    message: "No Load found",
                })
                return
            }

            callback(null, {
                success: true,
                loads,
                message: "Load fetched successfully",
            })
        } catch (error) {
            console.error("Error in Finding Load:", error)
            callback(null, {
                success: false,
                loads: null,
                message: "Failed to fetch Load",
            })
        }
    },
})



server.bindAsync(
    "0.0.0.0:3007",
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log("Auth Service gRPC server running at http://0.0.0.0:3007")
        server.start()
    }
)
