import mongoose, { Schema, Document, Model } from "mongoose"

// Define the Payment interface extending Mongoose's Document
export interface Payment extends Document {
    amount: number // Payment amount
    currency: string // Payment currency
    receipt: string // Payment receipt
    loadId: string // Load ID associated with the payment
    shipperId: string // Shipper's ID
    carrierId: string // Carrier's ID
    superAdminId?: string // Optional: SuperAdmin's ID
    platformFee?:number
    transactionId?: string // Optional: Bank transaction ID
    bankDetails?: {
        bankName: string
        accountNumber: string
        IFSC: string
    } // Optional: Bank details for carrier
    status: "Pending" | "Completed" | "Failed" | "Processing" | "Released" // Payment status
    createdAt: Date // Timestamp for creation
    updatedAt: Date // Timestamp for last update
}

// Define the Payment schema
const paymentSchema: Schema<Payment> = new Schema(
    {
        amount: { type: Number, required: true }, // Required payment amount
        platformFee: { type: Number}, // Required payment amount

        currency: { type: String, required: true }, // Required currency (e.g., "INR")
        receipt: { type: String, required: true }, // Required receipt string
        loadId: { type: String, required: true }, // Required load ID
        shipperId: { type: String, required: true }, // Required shipper's ID
        carrierId: { type: String, required: true }, // Required carrier's ID
        superAdminId: { type: String }, // Optional superadmin ID
        transactionId: { type: String }, // Optional transaction ID
        bankDetails: {
            // Optional: Bank details schema
            bankName: { type: String },
            accountNumber: { type: String },
            IFSC: { type: String },
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Failed", "Processing", "Released"], // Status options
            default: "Pending", // Default status
        },
    },
    {
        timestamps: true, // Enable createdAt and updatedAt fields
    }
)

// Create the Payment model using the schema
const Payment: Model<Payment> = mongoose.model<Payment>(
    "Payment",
    paymentSchema
)

// Export the Payment model for use in other modules
export default Payment
