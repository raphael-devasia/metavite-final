import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
    {
        senderId: { type: String, required: true },
        recipientId: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        chatId: { type: String, required: true },
    },
   
)

module.exports = mongoose.model("Message", messageSchema)