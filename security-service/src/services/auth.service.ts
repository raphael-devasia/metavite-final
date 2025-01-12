import { checkUser } from "../repositories/authentication.repository"
import {
    IUser,
    IUserInvitation,
    IUserInvitationReturn,
} from "../models/user.model"
import User from "../models/user.model"
import {
    createUser,
    findInvitationByEmail,
    findUserByEmail,
    
} from "../repositories/userInvitationRegister.repository"
import { publishToQueue } from "./messaging.service"

const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

export const loginUser = async (username: string, password: string) => {
    const role = findRoleFromUsername(username)
    const userLog: any = await checkUser(username, password, role)
    console.log("this is from verify service", userLog)
    const token = generateToken(userLog.user)

    return { ...userLog, token }
}
/**
 * Register User Invitation
 */
export const registerInvitation = async (
    data: IUserInvitation
): Promise<IUserInvitationReturn> => {
    try {
        const { email,companyRefId } = data

        // Check if the user already exists
        const existingUser = await findUserByEmail( email, companyRefId )
        if (existingUser) {
            return {
                name: {
                    firstName: existingUser.name.firstName,
                    lastName: existingUser.name.lastName,
                },
                email: existingUser.email,
                phoneNumber: existingUser.phoneNumber,
                message: "User with this email already exists",
                success: false,
            }
        }

        // Generate a token for the invitation
        const invitationToken = generateToken({ email, companyRefId })

        // Save user with the invitation token
        const savedUser = await createUser({ ...data, invitationToken })
       

        console.log("User saved to database with token:", savedUser)

        // Send the invitation email with the token
        const emailMessage = JSON.stringify({
            email: savedUser.email,
            subject: "Invitation For Driver Registration",
            html: `
        <p>Hello ${savedUser.name?.firstName || "User"},</p>
        <p>You are invited to register with us! Please use the following link to complete your registration:</p>
        <p>
            <a 
                href="https://metavite.vercel.app/carrier/register?token=${encodeURIComponent(
                    invitationToken
                )}&companyRefId=${encodeURIComponent(
                savedUser.companyRefId
            )}&email=${encodeURIComponent(savedUser.email)}"
                style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
                Register Now
            </a>
        </p>
        <p>Best regards,<br>The Team</p>
    `,
        })

console.log(emailMessage);

        try {
            await publishToQueue("emailQueue", emailMessage)
            console.log("Invitation email published to queue.")
        } catch (error) {
            console.error("Error publishing invitation email to queue:", error)
        }

        return {
            name: {
                firstName: savedUser.name.firstName,
                lastName: savedUser.name.lastName,
            },
            email: savedUser.email,
            phoneNumber: savedUser.phoneNumber,
            message: "Invitation sent successfully",
            success: true,
        }
    } catch (error) {
        console.error("Error registering invitation:", error)
        return {
            name: { firstName: "", lastName: "" },
            email: "",
            phoneNumber: "",
            message: "Failed to register invitation",
            success: false,
        }
    }
}

/**
 * Verify Invitation Token During Registration
 */
export const verifyInvitationToken = async (
    email: string,
    companyRefId:string,
    token: string
): Promise<boolean> => {
    try {
        const invitation = await findInvitationByEmail(email, companyRefId)
        if (!invitation || invitation.invitationToken !== token) {
            return false
        }

        await deleteInvitationByEmail(email, companyRefId)
        
        return true
    } catch (error) {
        console.error("Error verifying invitation token:", error)
        return false
    }
}

const findRoleFromUsername = (username: string): string => {
    const rolePrefixes: { [key: string]: string } = {
        SA: "shipperAdmin",
        DR: "driver",
        SS: "shipperStaff",
        CA: "carrierAdmin",
        AA: "appAdmin",
    }
    const prefix = username.slice(0, 2)
    return rolePrefixes[prefix] || "unknown"
}
const generateToken = (data: any): string => {
    return jwt.sign(data, JWT_SECRET, {
        expiresIn: "12h",
    })
}

export const deleteInvitationByEmail = async (
    email: string,
    companyRefId: string
): Promise<void> => {
    try {
        // Delete the document based on email and companyRefId
        await User.deleteOne({ email, companyRefId })
        console.log(
            `Invitation deleted for email: ${email}, companyRefId: ${companyRefId}`
        )
    } catch (error) {
        console.error("Error deleting invitation:", error)
        throw new Error("Failed to delete invitation")
    }
}
