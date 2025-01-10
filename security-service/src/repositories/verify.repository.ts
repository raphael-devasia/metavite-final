
import { getRoleModel } from "../models/roles.model"

export const getRoleDetails = async (role: string) => {
    try {
        const RoleModel = getRoleModel() // Get the model instance
        const roleDetails = await RoleModel.findOne({ role })
        return roleDetails
    } catch (error) {
        console.error("Error fetching role details:", error)
        return null
    }
}
