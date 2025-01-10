import Payment, { Payment as PaymentInterface } from "../database/payment.model"
import Razorpay from "razorpay"
import axios from "axios"
const crypto = require("crypto")
const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
import path from "path"

const CARRIER_PROTO_PATH = path.join("/app/metaVite_Proto_Files/carrier.proto")
const LOAD_PROTO_PATH = path.join("/app/metaVite_Proto_Files/load.proto")
const SHIPPER_PROTO_PATH = path.join("/app/metaVite_Proto_Files/shipper.proto")

const packageDefinition = protoLoader.loadSync(CARRIER_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})
const loadpackageDefinition = protoLoader.loadSync(LOAD_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})
const shipperpackageDefinition = protoLoader.loadSync(SHIPPER_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

const carrierProto = grpc.loadPackageDefinition(packageDefinition).carrier
const loadProto = grpc.loadPackageDefinition(loadpackageDefinition).load
const shipperProto = grpc.loadPackageDefinition(shipperpackageDefinition).shipper

const carrier_client = new (carrierProto as any).CarrierService(
    "carrier-service:3002",
    grpc.credentials.createInsecure()
)
const load_client = new (loadProto as any).LoadService(
    "load-service:3007",
    grpc.credentials.createInsecure()
)
const shipper_client = new (shipperProto as any).ShipperService(
    "shipper-service:3003",
    grpc.credentials.createInsecure()
)
// Repository to create a payment order
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})
interface PaymentSignatureParams {
    order_id: string
    payment_id: string
    signature: string
}
interface CarrierDetails {
    companyDetails: {
        companyName: string
        companyEmail: string
        companyPhone: string
    }
    bankDetails: {
        ifscCode: string
        accountNumber: string
    }
}


// const getAllPayments = async () => {
//     try {
//         console.log('the call is reacjung final stahge');
        
//         // Fetch all payment records from the database
//         const payments = await Payment.find()

//         // Enrich each payment with details from the other services
//         const enrichedPayments = await Promise.all(
//             payments.map(async (payment) => {
//                 try {
//                     // Fetch the load details
//                     const loadDetails = await new Promise((resolve, reject) => {
//                         load_client.GetLoadInfo(
//                             { userId: payment.loadId },
//                             (err:any, response:any) => {
//                                 if (err) reject(err)
//                                 else resolve(response)
//                             }
//                         )
//                     })

//                     // Fetch the carrier details
//                     const carrierDetails = await new Promise(
//                         (resolve, reject) => {
//                             carrier_client.GetCompanyInfo(
//                                 { companyId: payment.carrierId },
//                                 (err:any, response:any) => {
//                                     if (err) reject(err)
//                                     else resolve(response)
//                                 }
//                             )
//                         }
//                     )

//                     // Fetch the shipper details
//                     const shipperDetails = await new Promise(
//                         (resolve, reject) => {
//                             shipper_client.GetShipperInfo(
//                                 { shipperId: payment.shipperId },
//                                 (err:any, response:any) => {
//                                     if (err) reject(err)
//                                     else resolve(response)
//                                 }
//                             )
//                         }
//                     )

//                     // Return the enriched payment
//                     return {
//                         ...payment.toObject(),
//                         loadDetails,
//                         carrierDetails,
//                         shipperDetails,
//                     }
//                 } catch (err) {
//                     console.error(
//                         `Error fetching details for payment ID: ${payment._id}`,
//                         err
//                     )
//                     return {
//                         ...payment.toObject(),
//                         error: "Failed to fetch related details",
//                     }
//                 }
//             })
//         )

//         return enrichedPayments
//     } catch (err) {
//         console.error("Error fetching payments: ", err)
//         throw new Error("Failed to fetch payments")
//     }
// }
const getAllPayments = async () => {
    try {
        console.log("Fetching all payment records...")

        // Fetch all payment records from the database
        const payments = await Payment.find()
        console.log("Fetched payment records:", payments)

        // Enrich each payment with details from the other services
        const enrichedPayments = await Promise.all(
            payments.map(async (payment) => {
                try {
                    console.log(
                        `Fetching details for payment ID: ${payment._id}`
                    )

                    // Fetch the load details
                    const loadDetails = await new Promise((resolve, reject) => {
                        load_client.GetLoadInfo(
                            { id: payment.loadId },
                            (err: any, response: any) => {
                                if (err) {
                                    console.error(
                                        `Error fetching load details for payment ID: ${payment._id}`,
                                        err
                                    )
                                    reject(err)
                                } else {
                                    console.log(
                                        `Fetched load details for payment ID: ${payment._id}`,
                                        response
                                    )
                                    resolve(response.load)
                                }
                            }
                        )
                    })

                    // Fetch the carrier details
                    const carrierDetails = await new Promise(
                        (resolve, reject) => {
                            carrier_client.GetCompanyInfo(
                                { companyRefId: payment.carrierId },
                                (err: any, response: any) => {
                                    if (err) {
                                        console.error(
                                            `Error fetching carrier details for payment ID: ${payment._id}`,
                                            err
                                        )
                                        reject(err)
                                    } else {
                                        console.log(
                                            `Fetched carrier details for payment ID: ${payment._id}`,
                                            response
                                        )
                                        resolve(response.user)
                                    }
                                }
                            )
                        }
                    )

                    // Fetch the shipper details
                    const shipperDetails = await new Promise(
                        (resolve, reject) => {
                            shipper_client.GetShipperInfo(
                                { companyRefId: payment.shipperId },
                                (err: any, response: any) => {
                                    if (err) {
                                        console.error(
                                            `Error fetching shipper details for payment ID: ${payment._id}`,
                                            err
                                        )
                                        reject(err)
                                    } else {
                                        console.log(
                                            `Fetched shipper details for payment ID: ${payment._id}`,
                                            response
                                        )
                                        resolve(response.user)
                                    }
                                }
                            )
                        }
                    )

                    // Return the enriched payment
                    console.log(
                        `Enriched payment details for payment ID: ${payment._id}`
                    )

                    // Combine all details into the enriched payment object
                    const enrichedPayment = {
                        ...payment.toObject(),
                        loadDetails,
                        carrierDetails,
                        shipperDetails,
                    }

                    // Log the enriched payment object with detailed nesting
                    console.log(
                        "Enriched Payment (Nested):",
                        JSON.stringify(enrichedPayment, null, 4)
                    )

                    return enrichedPayment
                } catch (err) {
                    console.error(
                        `Error fetching details for payment ID: ${payment._id}`,
                        err
                    )
                    return {
                        ...payment.toObject(),
                        error: "Failed to fetch related details",
                    }
                }
            })
        )

        console.log("Enriched payments:", enrichedPayments)
        return enrichedPayments
    } catch (err) {
        console.error("Error fetching payments: ", err)
        throw new Error("Failed to fetch payments")
    }
}
const getAPayment = async (loadId: string) => {
    try {
        console.log("Fetching payment record...")

        // Fetch the payment record from the database
        const payment = await Payment.findOne({ loadId: loadId })
        if (!payment) {
            throw new Error("Payment record not found")
        }
        console.log("Fetched payment record:", payment)

        // Fetch the load details
        const loadDetails = await new Promise((resolve, reject) => {
            load_client.GetLoadInfo(
                { id: payment.loadId },
                (err: any, response: any) => {
                    if (err) {
                        console.error(
                            `Error fetching load details for payment ID: ${payment._id}`,
                            err
                        )
                        reject(err)
                    } else {
                        console.log(
                            `Fetched load details for payment ID: ${payment._id}`,
                            response
                        )
                        resolve(response.load)
                    }
                }
            )
        })

        // Fetch the carrier details
        const carrierDetails = await new Promise((resolve, reject) => {
            carrier_client.GetCompanyInfo(
                { companyRefId: payment.carrierId },
                (err: any, response: any) => {
                    if (err) {
                        console.error(
                            `Error fetching carrier details for payment ID: ${payment._id}`,
                            err
                        )
                        reject(err)
                    } else {
                        console.log(
                            `Fetched carrier details for payment ID: ${payment._id}`,
                            response
                        )
                        resolve(response.user)
                    }
                }
            )
        })

        // Fetch the shipper details
        const shipperDetails = await new Promise((resolve, reject) => {
            shipper_client.GetShipperInfo(
                { companyRefId: payment.shipperId },
                (err: any, response: any) => {
                    if (err) {
                        console.error(
                            `Error fetching shipper details for payment ID: ${payment._id}`,
                            err
                        )
                        reject(err)
                    } else {
                        console.log(
                            `Fetched shipper details for payment ID: ${payment._id}`,
                            response
                        )
                        resolve(response.user)
                    }
                }
            )
        })

        // Combine all details into the enriched payment object
        const enrichedPayment = {
            ...payment.toObject(),
            loadDetails,
            carrierDetails,
            shipperDetails,
        }

        // Log the enriched payment object with detailed nesting
        console.log(
            "Enriched Payment (Nested):",
            JSON.stringify(enrichedPayment, null, 4)
        )

        return enrichedPayment
    } catch (err) {
        console.error("Error fetching payment details: ", err)
        throw new Error("Failed to fetch payment details")
    }
}





const verifyPaymentSignature = ({
    order_id,
    payment_id,
    signature,
}: PaymentSignatureParams): boolean => {
    const body = order_id + "|" + payment_id
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex")

    return expectedSignature === signature
}


const createOrderDetails = async (
    amount: number,
    loadId: string,
    shipperId:string,
    carrierId:string
): Promise<PaymentInterface> => {
    try {
        // Create an order in Razorpay
        const razorpayOrder = await razorpayInstance.orders.create({
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: loadId,
            payment_capture: true, // Auto-capture payments
        })
         console.log("Razorpay Order Created:", razorpayOrder)

        const payment = new Payment({
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: razorpayOrder.id,
            
            status: "Pending", // Initial status
            shipperId,
            carrierId,
            loadId,
        })

        // Save the payment in the database
        const savedPayment = await payment.save()

        console.log(savedPayment)

        return savedPayment
    } catch (error) {
        console.error("Error creating order details:", error)
        throw new Error("Failed to create order details")
    }
}

// Repository to verify a payment
const verifyPayment = async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    loadId: string,
    retries: number = 3, // Default retry count is 3
    delay: number = 3000
): Promise<{ success: boolean; message: string }> => {
    // Retry the payment verification operation with retries and delay

    return retryOperation(
        async () => {
            // Step 1: Check if the payment exists in the database
            const payment = await Payment.findOne({
                receipt: razorpay_order_id,
            })
            if (!payment) {
                return { success: false, message: "Payment not found." }
            }

            // Step 2: Verify the payment signature with Razorpay
            const isValid = verifyPaymentSignature({
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                signature: razorpay_signature,
            })
            console.log('is it valid',isValid);
            console.log("the database detail is ", payment)

            if (isValid) {
                // Step 3: Update the payment status in the database
                payment.status = "Processing"
                await payment.save()
                return {
                    success: true,
                    message: "Payment verified and Processing.",
                }
            } else {
                return {
                    success: false,
                    message: "Payment verification failed. Invalid signature.",
                }
            }
        },
        retries,
        delay
    )
}



const releasePayment = async (loadId: string): Promise<string> => {
    try {
        // Find the payment by loadId
        const payment: any = await Payment.findOne({ loadId: loadId })
        if (!payment) {
            throw new Error("Payment not found.")
        }

        if (payment.status !== "Processing") {
            throw new Error("Payment is not in the 'Processing' state.")
        }

        // Fetch carrier details
        const carrierDetails: CarrierDetails = await new Promise(
            (resolve, reject) => {
                carrier_client.GetCompanyInfo(
                    { companyRefId: payment.carrierId },
                    (err: any, response: any) => {
                        if (err) {
                            console.error(
                                `Error fetching carrier details for payment ID: ${payment._id}`,
                                err
                            )
                            reject(err)
                        } else {
                            resolve(response.user)
                        }
                    }
                )
            }
        )

        if (!carrierDetails?.companyDetails || !carrierDetails?.bankDetails) {
            throw new Error("Incomplete carrier details.")
        }

        // Calculate payout amount (95% of total payment amount)
        const payoutAmount = Math.floor(payment.amount * 0.95) // Rounded down to nearest integer
        const platformFee = payment.amount - payoutAmount // Remaining 5% as platform fee
        console.log(
            `Payout Amount: ${payoutAmount}, Platform Fee: ${platformFee}`
        )

        // Create Razorpay contact
        const contactResponse = await axios.post(
            "https://api.razorpay.com/v1/contacts",
            {
                name: carrierDetails.companyDetails.companyName,
                email: carrierDetails.companyDetails.companyEmail,
                contact: carrierDetails.companyDetails.companyPhone,
                // type: "Carrier",
            },
            {
                auth: {
                    username: process.env.RAZORPAY_X_KEY_ID || "",
                    password: process.env.RAZORPAY_X_KEY_SECRET || "",
                },
            }
        )
        const contactId = contactResponse.data.id
        console.log("Contact created with ID:", contactId)

        // Create Razorpay fund account
        const fundAccountResponse = await axios.post(
            "https://api.razorpay.com/v1/fund_accounts",
            {
                contact_id: contactId,
                account_type: "bank_account",
                bank_account: {
                    name: carrierDetails.companyDetails.companyName,
                    ifsc: carrierDetails.bankDetails.ifscCode,
                    account_number: carrierDetails.bankDetails.accountNumber,
                },
            },
            {
                auth: {
                    username: process.env.RAZORPAY_X_KEY_ID || "",
                    password: process.env.RAZORPAY_X_KEY_SECRET || "",
                },
            }
        )
        const fundAccountId = fundAccountResponse.data.id
        console.log("Fund account created with ID:", fundAccountId)

        // Initiate payout
        const payoutResponse = await axios.post(
            "https://api.razorpay.com/v1/payouts",
            {
                account_number: process.env.RAZORPAY_VIRTUAL_ACCOUNT_NUMBER,
                fund_account_id: fundAccountId,
                amount: payoutAmount, // 95% of the payment amount
                currency: "INR",
                mode: "IMPS", // Payment mode: IMPS/UPI/NEFT
                purpose: "refund",
                queue_if_low_balance: true,
                narration: `${loadId}`,
                reference_id: loadId,
            },
            {
                auth: {
                    username: process.env.RAZORPAY_X_KEY_ID || "",
                    password: process.env.RAZORPAY_X_KEY_SECRET || "",
                },
            }
        )

        console.log("Payout successful:", payoutResponse.data)

        // Update payment status and record platform fee
        payment.status = "Completed"
        payment.releasedAt = new Date()
        payment.platformFee = platformFee // Save platform fee (if needed)
        await payment.save()

        return `Payment of ₹${
            payoutAmount / 100
        } released to the carrier. Platform fee: ₹${platformFee / 100}.`
    } catch (error: any) {
        console.error("Error in releasePayment:", error.message || error)

        // Return or throw a descriptive error message
        if (error.response?.data) {
            console.error("Razorpay API Error:", error.response.data)
        }
        throw new Error("Failed to release payment. Please try again.")
    }
}

// Function to initiate refund
async function initiateRefund(loadId:string) {
  try {
     const payment: any = await Payment.findOne({ loadId: loadId })
     if (!payment) {
         throw new Error("Payment not found.")
     }

     if (payment.status !== "Processing") {
         throw new Error("Payment is not in the 'Processing' state.")
     }

    
    const refundAmount = payment.amount; 

    const refund = await razorpayInstance.payments.refund(payment.receipt, {
        amount: refundAmount,
        // Reason for refund can be customized as needed
        notes: {
            reason: "Refund for the transaction",
        },
    })

    console.log('Refund Successful:', refund);
    return refund;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
}



const retryOperation = async (
    operation: () => Promise<{ success: boolean; message: string }>,
    retries: number,
    delay: number
): Promise<{ success: boolean; message: string }> => {
    let attempt = 0
    while (attempt < retries) {
        try {
            // Attempt the operation
            const result = await operation()
            return result // If successful, return the result
        } catch (error) {
            // Log the error for debugging
            console.error(`Attempt ${attempt + 1} failed:`, error)
        }

        // Increment the attempt counter
        attempt++

        // If max retries reached, return failure message
        if (attempt === retries) {
            return {
                success: false,
                message: "Maximum retry attempts reached.",
            }
        }

        // Wait before retrying (in ms)
        console.log(`Retrying... Attempt ${attempt + 1}`)
        await new Promise((resolve) => setTimeout(resolve, delay))
    }

    return { success: false, message: "Unknown error during retry operation." } // Ensure we return something here
}
export default {
    createOrderDetails,
    verifyPayment,
    releasePayment,
    getAllPayments,
    getAPayment,
    initiateRefund,
}
