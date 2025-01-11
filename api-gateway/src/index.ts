import express, { Request, Response } from "express"
const dotenv = require("dotenv")
const cors =require('cors') 
const bodyParser = require("body-parser")
import authRoutes from "./routes/auth.routes"
import carrierRoutes from "./routes/carrier.routes"
import adminRoutes from "./routes/admin.routes"
import shipperRoutes from "./routes/shipper.routes"
const morgan = require("morgan")

const detect = require("detect-port")

dotenv.config()

const app = express()
const DEFAULT_PORT = 4000
app.use(morgan("combined"))
app.use(express.json())

app.use(
    cors({
        origin: "https://meta-vite-front-end-qbvz.vercel.app", // Allow any origin
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow common HTTP methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allow common headers
        credentials: true, // Allow cookies (optional)
    })
)

app.use(bodyParser.json())

//THIS SECTION IS FOR THE ROUTES RELATED TO DIFFERENT SERVICES
app.use(authRoutes)
app.use(carrierRoutes)
app.use(adminRoutes)
app.use(shipperRoutes)



detect(DEFAULT_PORT).then((port:any) => {
    if (port === DEFAULT_PORT) {
        app.listen(port, () => console.log(`Server is running on port ${port}`))
    } else {
        console.log(`Port ${DEFAULT_PORT} is in use. Running on port ${port}.`)
        app.listen(port, () => console.log(`Server is running on port ${port}`))
    }
})
