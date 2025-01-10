import mongoose, { Schema, Document, Model } from "mongoose"

export interface IRole extends Document {
    role: string
    allowedFeatures: string[]
}

const RoleSchema: Schema = new Schema(
    {
        role: {
            type: String,
            required: true,
            unique: true,
        },
        allowedFeatures: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true }
)

export const getRoleModel = () => {
    return mongoose.model<IRole>("Role", RoleSchema)
}