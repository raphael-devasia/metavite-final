import express, { Request, Response } from "express"
const dotenv = require("dotenv")
const cors =require('cors') 
const bodyParser = require("body-parser")
import authRoutes from "./routes/auth.routes"
import carrierRoutes from "./routes/carrier.routes"
import adminRoutes from "./routes/admin.routes"
import shipperRoutes from "./routes/shipper.routes"
const morgan = require("morgan")
import { createProxyMiddleware } from "http-proxy-middleware"

const detect = require("detect-port")

dotenv.config()

const app = express()
const DEFAULT_PORT = 4000

app.use(morgan('dev')); // Using simpler log format
app.use(express.json())

// CORS configuration with debug logs
app.use(
    cors({
        origin: [
            'https://metavite.vercel.app', // Allow Vercel front-end
            'http://localhost:4200', // Allow local Angular front-end
            'https://magnificent-gumption-08c1cb.netlify.app', // Allow Netlify front-end
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        preflightContinue: true, // Make sure preflight responses are handled
        optionsSuccessStatus: 200, // For legacy browser support (like IE)
    })
);

// Log CORS headers and origin for incoming requests
app.use((req: Request, res: Response, next) => {
    console.log(`CORS Request - Origin: ${req.get('Origin')}`);
    console.log(`Request Method: ${req.method}`);
    console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
    next();
});


app.use(bodyParser.json())

//THIS SECTION IS FOR THE ROUTES RELATED TO DIFFERENT SERVICES
app.use(
    "/chat",
    createProxyMiddleware({
        target: "http://chat-service:3000",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
            "^/chat": "", // Remove /chat prefix when forwarding
        },
    })
)
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
