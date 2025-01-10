import express, { Request, Response } from "express"
import { registerUser, loginUser } from "../services/auth.service"
import { attachToken, validateLogin, validateRegister } from "../middlewares/auth.middleware"
import { InvitedUserVerification } from "../repositories/auth.repository"

const router = express.Router()

router.post(
    "/register",
    validateRegister,
    attachToken,
    async (req: Request, res: Response): Promise<any> => {
        console.log(req.body)

        try {
            const { email, role, companyRefId, name, phoneNumber, token } =
                req.body
            if (role === "driver") {
                let user = {
                    email,
                    role,
                    companyRefId,
                    name,
                    phoneNumber,
                    token,
                }
                const isInvited: any = await InvitedUserVerification(user)
                if (!isInvited.success) {
                    let response = {
                        message: "You are not invited to register",
                    }
                    return res.status(400).json(response)
                }
            }

            const response: any = await registerUser(req.body)
            if (response.message === "Email already exists for this role") {
                res.status(409).json(response)
            } else {
                res.status(201).json(response)
            }
        } catch (error: any) {
            res.status(500).json({ message: " Internal Server Error" })
        }
    }
)

router.post("/login", validateLogin, async (req: Request, res: Response) => {
    const { username, password } = req.body
    try {
        const response = await loginUser(username, password)
        console.log(response)

        res.status(200).json(response)
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message })
        } else {
            res.status(500).json({ error: "An unknown error occurred" })
        }
    }
})


export default router
