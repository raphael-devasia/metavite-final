const express = require("express")
const http = require("http") // Use http instead of https
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
app.use(
    cors({
        origin: [
            "https://metavite.vercel.app", // Allow Vercel front-end
            "http://localhost:4200", // Allow local Angular front-end
            "https://magnificent-gumption-08c1cb.netlify.app", // Allow Netlify front-end
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow common HTTP methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allow Content-Type and Authorization headers
        credentials: true, // Enable credentials (e.g., cookies, authentication)
    })
)
app.options("*", cors())

const server = http.createServer(app) // Create an HTTP server instead of HTTPS

const io = new Server(server, {
    cors: {
        origin: [
            "https://metavite.vercel.app", // Vercel frontend
            "http://localhost:4200", // Local Angular frontend
            "https://magnificent-gumption-08c1cb.netlify.app", // Netlify frontend
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
        ],
        credentials: true,
    },
    pingTimeout: 60000, // Close connection if no pong within 60 seconds
    pingInterval: 25000, // Send pings every 25 seconds
    transports: ["websocket", "polling"], // Enable both WebSocket and fallback
})

io.on("connection", (socket: any) => {
    console.log("Client connected:", socket.id)

   

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
    })

    // Additional socket event handlers can go here
})
module.exports = { io }
const PORT = 5001
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
