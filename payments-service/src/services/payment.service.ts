import * as grpc from "@grpc/grpc-js"
import PaymentRepository from "../repositories/payment.repository"


class PaymentService {
    static async createOrder(call: any, callback: any) {
        const { amount, loadId, shipperId, carrierId } = call.request
        console.log("it is coming", amount, loadId, shipperId, carrierId)

        try {
            const order = await PaymentRepository.createOrderDetails(
                amount,

                loadId,
                shipperId,
                carrierId
            )
            callback(null, order)
        } catch (error: unknown) {
            if (error instanceof Error) {
                callback({ code: grpc.status.INTERNAL, message: error.message })
            } else {
                callback({
                    code: grpc.status.INTERNAL,
                    message: "Unknown error occurred",
                })
            }
        }
    }

    static async verifyPayment(call: any, callback: any) {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            loadId,
        } = call.request
        try {
            const result = await PaymentRepository.verifyPayment(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                loadId
            )
            callback(null, {
                success: true,
                message: result.message, // result is the message returned by the repository
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                callback({ code: grpc.status.INTERNAL, message: error.message })
            } else {
                callback({
                    code: grpc.status.INTERNAL,
                    message: "Unknown error occurred",
                })
            }
        }
    }

    static async releasePayment(call: any, callback: any) {
        const { loadId } = call.request
        try {
            const result = await PaymentRepository.releasePayment(loadId)
            callback(null, { message: result })
        } catch (error: unknown) {
            if (error instanceof Error) {
                callback({ code: grpc.status.INTERNAL, message: error.message })
            } else {
                callback({
                    code: grpc.status.INTERNAL,
                    message: "Unknown error occurred",
                })
            }
        }
    }
    static async getAllPayments(call: any, callback: any) {
        try {
            console.log('get all payment details');
            
            const result = await PaymentRepository.getAllPayments()

            callback(null, {
                success: true,
                payments: result,
                message: "Fetheced successfully",
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                callback({ code: grpc.status.INTERNAL, message: error.message })
            } else {
                callback({
                    code: grpc.status.INTERNAL,
                    message: "Unknown error occurred",
                })
            }
        }
    }

    static async getPayments(call: any, callback: any) {
        try {
            const { id } = call.request
            const result = await PaymentRepository.getAPayment(id)

            callback(null, {
                success: true,
                payments: result,
                message: "Fetheced successfully",
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                callback({ code: grpc.status.INTERNAL, message: error.message })
            } else {
                callback({
                    code: grpc.status.INTERNAL,
                    message: "Unknown error occurred",
                })
            }
        }
    }
}





export default PaymentService
