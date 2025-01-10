import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js"
import jwt from "jsonwebtoken"

// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Interface for the decoded token
interface DecodedToken {
    id: string
    email: string
    role: string
    iat: number
    exp: number
}

// Authentication middleware
export const    authMiddleware = (
    call: ServerUnaryCall<any, any>,
    next: Function
) => {
    

    try {
        const token = call.request.user.token // Access token from the request body

        if (!token) {
            console.error("Unauthorized request: No token provided")
            throw new Error("Unauthorized: No token provided")
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken

        console.log("Decoded token:", decoded)
        
        

        // Attach decoded token information to the call
        ;(call as any).user = decoded

        // Proceed to the next middleware or handler
        next()
    } catch (error: any) {
        console.error("Unauthorized request:", error.message)
        throw new Error("Unauthorized: Invalid token")
    }
}

export default authMiddleware
