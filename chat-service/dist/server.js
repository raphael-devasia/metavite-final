"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
// import fs from "fs"
// import https from "https"
const http = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv = require("dotenv");
const userRoutes = require("./presentation/routes");
const { getAllUsers } = require("./presentation/user.controller");
const Message = require("./infrastructure/database/models/MessageModel");
// Initialize Express app
// Load environment variables
dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "https://meta-vite-front-end-qbvz.vercel.app", // Replace this with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods if needed
    credentials: true, // Enable if you need cookies
}));
// Create HTTPS server
// const server = https.createServer(
//     {
//         key: fs.readFileSync("server.key"),
//         cert: fs.readFileSync("server.cert"),
//     },
//     app
// )
const server = http.createServer(app);
// Initialize Socket.IO server with CORS
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "https://meta-vite-front-end-qbvz.vercel.app", // Allow frontend origin
        methods: ["GET", "POST"], // Allowed methods
        credentials: true, // Send cookies or authentication headers
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ["websocket", "polling"],
});
exports.io = io;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Connect to MongoDB
require("./config/config.db")();
// Import and use routes
// Routes
app.use("/api/users", userRoutes);
// In-memory storage for online users
let onlineUsers = {};
// Socket.IO logic
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("login", (userId) => {
        onlineUsers[userId] = socket.id;
        console.log("User logged in:", onlineUsers);
        if (userId) {
            getAllUsers({ userId: userId }, null, (data) => {
                console.log(data);
                socket.emit("update_messaged_users", data);
            });
        }
        else {
            console.log("No userId provided in the query params.");
        }
    });
    socket.on("fetch_messages", (_a) => __awaiter(void 0, [_a], void 0, function* ({ chatId }) {
        try {
            const messages = yield Message.find({
                $or: [{ senderId: chatId }, { recipientId: chatId }],
            }).sort({ createdAt: 1 });
            socket.emit("previous_messages", { success: true, messages });
        }
        catch (error) {
            console.error("Error fetching messages:", error);
            socket.emit("previous_messages", {
                success: false,
                message: "Failed to fetch messages",
            });
        }
    }));
    socket.on("disconnect", () => {
        console.log("User disconnected");
        // Remove user from online users
        for (const [userId, socketId] of Object.entries(onlineUsers)) {
            if (socketId === socket.id) {
                delete onlineUsers[userId];
                break;
            }
        }
    });
    socket.on("my message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const { senderId, recipientId, message, senderDetails, receiverDetails, } = msg;
        console.log(senderId, recipientId, message, senderDetails, receiverDetails);
        console.log("Message: " + msg);
        const User = require("./infrastructure/database/models/user.model");
        try {
            // Save sender details to the database
            const sender = yield User.findById(senderId);
            if (!sender) {
                const newSender = new User({
                    _id: senderId,
                    name: senderDetails.name, // Assuming senderDetails contains name
                    companyRefId: senderDetails.companyRefId,
                });
                yield newSender.save();
            }
            // Save recipient details to the database
            const recipient = yield User.findById(recipientId);
            if (!recipient) {
                const newRecipient = new User({
                    _id: recipientId,
                    name: receiverDetails.name, // Assuming receiverDetails contains name
                    companyRefId: receiverDetails.companyRefId,
                });
                yield newRecipient.save();
            }
            // Save message to the database
            const newMessage = new Message({
                senderId,
                recipientId,
                message,
                chatId: [senderId, recipientId].sort().join("_"),
            });
            yield newMessage.save();
            // Emit message to recipient if online
            if (onlineUsers[recipientId]) {
                io.to(onlineUsers[recipientId]).emit("receiveMessage", msg);
            }
        }
        catch (error) {
            console.error("Error handling message:", error);
        }
    }));
});
// Start server
server.listen(3000, () => {
    console.log("Listening on https://localhost:3000");
});
