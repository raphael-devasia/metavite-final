import express from "express"
// import fs from "fs"
// import https from "https"
const http = require("http")
import { Server } from "socket.io"
import cors from "cors"
const dotenv = require("dotenv")
const userRoutes = require("./presentation/routes")
const { getAllUsers } = require("./presentation/user.controller")
 const Message = require("./infrastructure/database/models/MessageModel")

// Initialize Express app

// Load environment variables
dotenv.config()
const app = express()
app.use(
    cors({
        origin: [
            "https://metavite.vercel.app",
            "http://localhost:4200",
            "https://magnificent-gumption-08c1cb.netlify.app",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
        ],
        credentials: true,
    })
)

// Explicitly handle preflight OPTIONS requests
app.options("*", cors())



const server = http.createServer(app) 
// Initialize Socket.IO server with CORS
const io = new Server(server, {
    cors: {
        origin: [
            "https://metavite.vercel.app", // Allow Vercel front-end
            "http://localhost:4200", // Allow local Angular front-end
            "https://magnificent-gumption-08c1cb.netlify.app", // Allow Netlify front-end
        ], // Allowed origins
        methods: ["GET", "POST"], // Allowed HTTP methods
        credentials: true, // Enable sending cookies or authentication headers
    },
    pingTimeout: 60000, // Timeout for inactive connections
    pingInterval: 25000, // Interval between pings
    transports: ["websocket", "polling"], // Transport methods
})


// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
require("./config/config.db")()

// Import and use routes

// Routes
app.use("/api/users", userRoutes)

// In-memory storage for online users
let onlineUsers: any = {}

// Socket.IO logic
io.on("connection", (socket: any) => {
    console.log("A user connected", socket.id)

    socket.on("login", (userId: string) => {
        onlineUsers[userId] = socket.id
        console.log("User logged in:", onlineUsers)

        if (userId) {
            getAllUsers({ userId: userId }, null, (data: any) => {
                console.log(data)

                socket.emit("update_messaged_users", data)
            })
        } else {
            console.log("No userId provided in the query params.")
        }
    })
    socket.on("fetch_messages", async ({ chatId }: { chatId: string }) => {
        try {
            const messages = await Message.find({
                $or: [{ senderId: chatId }, { recipientId: chatId }],
            }).sort({ createdAt: 1 })
            socket.emit("previous_messages", { success: true, messages })
        } catch (error) {
            console.error("Error fetching messages:", error)
            socket.emit("previous_messages", {
                success: false,
                message: "Failed to fetch messages",
            })
        }
    })

    socket.on("disconnect", () => {
        console.log("User disconnected")
        // Remove user from online users
        for (const [userId, socketId] of Object.entries(onlineUsers)) {
            if (socketId === socket.id) {
                delete onlineUsers[userId]
                break
            }
        }
    })

    socket.on("my message", async (msg: any) => {
        const {
            senderId,
            recipientId,
            message,
            senderDetails,
            receiverDetails,
        } = msg
        console.log(
            senderId,
            recipientId,
            message,
            senderDetails,
            receiverDetails
        )

        console.log("Message: " + msg)
        const User = require("./infrastructure/database/models/user.model")
        try {
            // Save sender details to the database
            const sender = await User.findById(senderId)
            if (!sender) {
                const newSender = new User({
                    _id: senderId,
                    name: senderDetails.name, // Assuming senderDetails contains name
                    companyRefId: senderDetails.companyRefId,
                })
                await newSender.save()
            }

            // Save recipient details to the database
            const recipient = await User.findById(recipientId)
            if (!recipient) {
                const newRecipient = new User({
                    _id: recipientId,
                    name: receiverDetails.name, // Assuming receiverDetails contains name
                    companyRefId: receiverDetails.companyRefId,
                })
                await newRecipient.save()
            }

            // Save message to the database
           
            const newMessage = new Message({
                senderId,
                recipientId,
                message,
                chatId: [senderId, recipientId].sort().join("_"),
            })
            await newMessage.save()

            // Emit message to recipient if online
            if (onlineUsers[recipientId]) {
                io.to(onlineUsers[recipientId]).emit("receiveMessage", msg)
            }
        } catch (error) {
            console.error("Error handling message:", error)
        }

       
    })
})

// Start server
server.listen(3000, () => {
    console.log("Listening on https://localhost:3000")
})

// Export `io` for external use
export { io }
