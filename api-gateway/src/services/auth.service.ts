import {
    registerUserInDB,
    
} from "../repositories/auth.repository"

import { v4 as uuidv4 } from "uuid"

import { IUser, IUserInvitation } from "../models/user.models"
import { loginUserInDB, registerInvitation } from "../repositories/verify.repository"



export const registerUser: any = async (user: IUser) => {
   
    
     
    
    const userRegister: any = await registerUserInDB(user)

    return userRegister
}

export const loginUser = async (username: string, password: string) => {
    return await loginUserInDB(username, password)
}
export const inviteUser = async (user: IUserInvitation) => {
    return await registerInvitation(user)
}

