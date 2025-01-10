import { Request, Response } from "express"
import jwt from "jsonwebtoken"

export const validateToken = (req: Request, res: Response):any => {
    const user = req.body.user
    // Add additional business logic, e.g., role/permission checks
    return res.status(200).json({ message: "Token is valid", user })
}

export const decodeToken = async (token: string) => {
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "default_secret"
        )
        return decoded // Assumes the token contains { role: string }
    } catch (error) {
        console.error("Error decoding token:", error)
        return null
    }
}