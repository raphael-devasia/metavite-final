import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true }, // ObjectId
       
        
        
        name: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
        },
        companyRefId: { type: String, required: true },
       
    },
    { timestamps: true }
)
// Create an explicit index for `_id`
// userSchema.index({ _id: 1 });

module.exports = mongoose.model("User", userSchema)
