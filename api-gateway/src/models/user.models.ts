import mongoose, { Schema, Document, Types } from "mongoose"

interface IAddress {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
}

interface IEmergencyContact {
    name: string
    phoneNumber: string
}

interface ICompanyDetails {
    companyName: string
    companyEmail: string
    companyPhone: string
    taxId: string
    address: IAddress
}
export interface IUserInvitation {
    name: {
        firstName: string
        lastName: string
    }
    email: string
    phoneNumber: string
    token:string
}
export interface IClient {
    companyName: string
    address: IAddress
    contactPerson: string
    contactNumber: string
    _id?: string
}
export interface ICompany {
    _id: string
    name: {
        firstName: string
        lastName: string
    }
    email: string
    companyRefId: string
    address: IAddress
    personalDetails: {
        emergencyContact: IEmergencyContact
    }
    companyDetails: ICompanyDetails
    clients?: Types.ObjectId[]
    pickups?: Types.ObjectId[]
    status: string
}
export interface ILoadData {
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
    shipperRefId?: string
    _id?:string
    status?:string
}


export interface IUser extends Document {
    
    name: {
        firstName: string
        lastName: string
    }
    email: string
    companyRefId: string
    address: IAddress
    personalDetails: {
        emergencyContact: IEmergencyContact
    }
    companyDetails: ICompanyDetails
}

const AddressSchema: Schema = new Schema(
    {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    { _id: false }
)

const EmergencyContactSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true },
    },
    { _id: false }
)

const CompanyDetailsSchema: Schema = new Schema(
    {
        companyName: { type: String, required: true },
        companyEmail: { type: String, required: true },
        companyPhone: { type: String, required: true },
        taxId: { type: String, required: true },
        address: { type: AddressSchema, required: true },
    },
    { _id: false }
)

const CompanySchema: Schema = new Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    email: { type: String, required: true },
    status: { type: String, required: true ,default:"Active"},
    companyRefId: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    personalDetails: {
        emergencyContact: { type: EmergencyContactSchema, required: true },
    },
    companyDetails: { type: CompanyDetailsSchema, required: true },
})

export default mongoose.model<IUser>("User", CompanySchema)
