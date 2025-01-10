import { IClient, ILoadData, IUser } from "../models/user.models" // Assuming IUser is defined in your models
const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
import path from "path"



const LOAD_PROTO_PATH = path.join("/app/metaVite_Proto_Files/payment.proto")
const packageDefinition = protoLoader.loadSync(LOAD_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})
interface IResult {
    success: boolean
    data?: any
    message: string
}

const paymentProto = grpc.loadPackageDefinition(packageDefinition).payment
// const payment_client = new (paymentProto as any).PaymentService(
//     "localhost:3009",
//     grpc.credentials.createInsecure()
// )
const payment_client = new (paymentProto as any).PaymentService(
    "payment-service:3009",
    grpc.credentials.createInsecure()
)



export const newPaymentMethod = (paymentData: any): Promise<any | null> => {
    return new Promise((resolve, reject) => {
        
const {amount,loadId,shipperId,carrierId} = paymentData
console.log('final data is',amount,loadId);

        payment_client.CreateOrder(
            { amount, loadId, shipperId, carrierId },
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    console.log(response)

                    resolve(response)
                }
            }
        )
    })
}

export const verifyPaymentMethod = (paymentData: any): Promise<any | null> => {
    return new Promise((resolve, reject) => {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            loadId,
        } = paymentData
        console.log("final data is", razorpay_payment_id, razorpay_order_id)

        payment_client.VerifyPayment(
            {
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                loadId,
            },
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    console.log(response)

                    resolve(response)
                }
            }
        )
    })
}
export const fetchAllPayments = (): Promise<any> => {
    console.log('reaching here too');
    
    return new Promise((resolve, reject) => {
        payment_client.GetAllPayments({}, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                console.log('the data which i am getting is ',response);
                
                resolve(response)
            }
        })
    })
}
// Fetch bids (assuming similar proto service exists)
export const fetchPayment = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        payment_client.GetPayment({ id }, (error: any, response: any) => {
            console.log("all bids received", response)

            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
    })
}

