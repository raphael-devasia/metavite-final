import User, { IUser } from "../models/user.model"
import { IUserInvitation } from "../models/user.model"

export const findUserByEmail = async (email: string, companyRefId:string) => {
    return await User.findOne({ email, companyRefId })
}

export const createUser:any= async (
    data: IUserInvitation
) => {
    // const { email, name, phoneNumber } = data
    const user = new User(data)
    return await user.save()
}




/**
 * Find Invitation by Email
 */
export const findInvitationByEmail = async (
    email: string,
    companyRefId: string
): Promise<IUserInvitation | null> => {
    return await User.findOne(
        { email, companyRefId },
        { projection: { invitationToken: 1 } }
    )
}

/**
 * Update User Data
 */
export const updateUser = async (email: string, updateData: any) => {
    return await User.updateOne({ email }, { $set: updateData })
}
