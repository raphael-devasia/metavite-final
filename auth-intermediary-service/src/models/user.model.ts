import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId
    email: string
    password: string
    username: string
    phoneNumber:string
    name: { firstName: string; lastName: string }
    role: string
}
export interface IUserInvitation {
    name: {
        firstName: string
        lastName: string
    }
    email: string
    phoneNumber: string
    companyRefId: string
    invitationToken: string
}
export interface IUserInvitationReturn {
    name: {
        firstName: string
        lastName: string
    }
    email: string
    phoneNumber: string
    message: string
    success:boolean
}


 


const UserSchema: Schema = new Schema({
    email: { type: String, required: true },
    phoneNumber: { type: String, },

    role: {
        type: String,
        enum: [
            "appAdmin",
            "shipperAdmin",
            "carrierAdmin",
            "driver",
            "shipperStaff",
        ],
    },
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },

    companyRefId: { type: String },
})
UserSchema.index({ email: 1, role: 1 }, { unique: true })
export default mongoose.model<IUser>("User", UserSchema)
