import mongoose, { Schema, Document } from "mongoose"
const cron = require("node-cron")

// Define the IAddress interface
interface IAddress extends Document {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
}

// Define the IClient interface
interface IClient extends Document {
    companyName: string
    address: IAddress
    contactPerson: string
    contactNumber: string
}

// Define the ILoadData interface
interface ILoadData {
    agentContact: string
    agentName: string
    appointment1?: string
    appointment2?: string
    appointment3?: string
    basePrice: number
    dropoff1?: IClient
    dropoff2?: IClient
    dropoff3?: IClient
    pickupLocation?: IClient
    containerFeet?: string
    dispatchDateTime: string
    dropoffs: number
    expectedDelivery: string
    lcvBody?: string
    material: string
    mhcvSubtype?: string
    mixerCapacity?: string
    quantity: number
    tipperLoad?: string
    trailerFeet?: string
    vehicleBody: string
    vehicleType: string
    shipperRefId: string
    _id?: string
    status?: string
    bids: string[]
    selectedBid: string
    lowestPrice: number
    bidCarrier: string
    assignedDriver: string
    loadId: string
}
export interface IBid {
    vehicle: string
    driver: string
    bid: number
    termsAccepted: boolean
    loadRefId: string
    companyName: string
    companyPhone: string
    firstName: string
    lastName: string
    companyRefId: string
    _id?: string
}

// Create Address Schema
const AddressSchema: Schema = new Schema({
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
})

// Create Client Schema
const ClientSchema: Schema = new Schema({
    companyName: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    contactPerson: { type: String, required: true },
    contactNumber: { type: String, required: true },
})
const BidSchema: Schema = new Schema(
    {
        vehicle: { type: String, required: true },
        driver: { type: String, required: true },
        bid: { type: String, required: true },

        loadRefId: { type: String, required: true },
        companyName: { type: String, required: true },
        companyPhone: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        companyRefId: { type: String, required: true },
    },
    { timestamps: true }
)

// Create Load Data Schema
const LoadDataSchema: Schema = new Schema(
    {
        agentContact: { type: String, required: true },
        agentName: { type: String, required: true },
        appointment1: { type: String },
        appointment2: { type: String },
        appointment3: { type: String },
        basePrice: { type: Number, required: true },
        lowestPrice: { type: Number },
        dropoff1: { type: ClientSchema },
        dropoff2: { type: ClientSchema },
        dropoff3: { type: ClientSchema },
        pickupLocation: { type: ClientSchema },
        containerFeet: { type: String },
        dispatchDateTime: { type: String, required: true },
        dropoffs: { type: Number, required: true },
        expectedDelivery: { type: String, required: true },
        lcvBody: { type: String },
        material: { type: String, required: true },
        mhcvSubtype: { type: String },
        mixerCapacity: { type: String },
        quantity: { type: Number, required: true },
        tipperLoad: { type: String },
        trailerFeet: { type: String },
        vehicleBody: { type: String, required: true },
        vehicleType: { type: String, required: true },
        shipperRefId: { type: String, required: true },
        bidCarrier: { type: String },
        assignedDriver: { type: String },
        status: { type: String, required: true, default: "Open" },
        bids: [{ type: Schema.Types.ObjectId, ref: "BidData" }],
        selectedBid: { type: String },
        loadId: { type: String },
        location: {
            type: {
                type: String,
                enum: ["Point"], // GeoJSON type
            },
            coordinates: {
                type: [Number], // Array of numbers: [longitude, latitude]
            },
        },
    },
    { timestamps: true }
)
// Pre-save Hook
LoadDataSchema.pre("save", function (next) {
    const doc = this as unknown as ILoadData // Cast to unknown first, then to ILoadData

    // Remove elements from the 0th index while limiting the array to the last 5 elements
    while (doc.bids.length > 5) {
        doc.bids.shift() // Remove the first element
    }

    next()
})

// Export LoadData model
const LoadData = mongoose.model<ILoadData>("LoadData", LoadDataSchema)
const BidData = mongoose.model<IBid>("BidData", BidSchema)

cron.schedule("* * * * *", async () => {
    const now = new Date()
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    

    try {
        const loads = await LoadData.updateMany(
            {
                dispatchDateTime: { $gte: twentyFourHoursFromNow },
                status: "Open",
            },
            { $set: { status: "Closed" } }
        )
        console.log(loads)
    } catch (error) {
        console.error("Error updating loads:", error)
    }
})
console.log("Cron job scheduled to run every minute")

export { LoadData, ILoadData, IClient, IAddress, BidData }
