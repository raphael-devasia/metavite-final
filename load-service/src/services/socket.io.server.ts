const express = require("express")
const http = require("http") // Use http instead of https
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
app.use(
    cors({
        origin: "http://localhost:4200", // Allow frontend from localhost:4200
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    })
)

const server = http.createServer(app) // Create an HTTP server instead of HTTPS

const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200", // Allow frontend from localhost:4200
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ["websocket", "polling"],
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
