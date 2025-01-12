// import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js"
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js"
import path from "path"
import PaymentService from "./payment.service"
import PaymentRepository from "../repositories/payment.repository"



const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

// Define paths
const PROTO_PATH = path.join("/app/metaVite_Proto_Files/payment.proto")

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
const paymentPackage = grpc.loadPackageDefinition(packageDefinition)
    .payment as any

// Create the gRPC server
const server = new grpc.Server()

server.addService(paymentPackage.PaymentService.service, {
    CreateOrder: async (
        call: ServerUnaryCall<
            {
                amount: number
                loadId: string
                shipperId: string
                carrierId: string
            },
            {
                success: boolean
                message: string
                orderData?: any // Include the created order data in the response
            }
        >,
        callback: sendUnaryData<{
            success: boolean
            message: string
            orderData?: any // Optional field for returning order details
        }>
    ) => {
        try {
            const { amount, loadId, shipperId, carrierId } = call.request

            console.log("Received data:", {
                amount,
                loadId,
                shipperId,
                carrierId,
            })

            // Validate input data
            if (!amount || !loadId) {
                callback(null, {
                    success: false,
                    message: "Invalid Order Data",
                })
                return
            }

            // Create the order using your logic or service
            const createdOrder = await PaymentRepository.createOrderDetails(
                amount,
                loadId,
                shipperId,
                carrierId
            )

            console.log("Created Order:", createdOrder)

            // Respond with success and return the created order data
            callback(null, {
                success: true,
                message: "Order created successfully",
                orderData: createdOrder, // Include the created order in the response
            })
        } catch (error) {
            console.error("Error in CreateOrder:", error)

            // Respond with failure
            callback(null, {
                success: false,
                message: "Failed to create order",
            })
        }
    },

    VerifyPayment: (
        call: ServerUnaryCall<any, any>,
        callback: sendUnaryData<any>
    ) => PaymentService.verifyPayment(call, callback),

    ReleasePayment: (
        call: ServerUnaryCall<any, any>,
        callback: sendUnaryData<any>
    ) => PaymentService.releasePayment(call, callback),
    GetAllPayments: (
        call: ServerUnaryCall<any, any>,
        callback: sendUnaryData<any>
    ) => PaymentService.getAllPayments(call, callback),
    GetPayment: (
        call: ServerUnaryCall<any, any>,
        callback: sendUnaryData<any>
    ) => PaymentService.getPayments(call, callback),
})





server.bindAsync(
    "0.0.0.0:3009",
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log("Auth Service gRPC server running at http://0.0.0.0:3009")
        server.start()
    }
)
