
import { fetchLoadData, fetchShipperBids, postLoadUpdate } from "../repositories/load.repositor"



import { isAuthorized } from "../repositories/verify.repository"

// Generic function to check authorization and fetch data
const fetchResource = async (
    token: string,
    permission: string,

    fetchFunction: () => Promise<any>
) => {
    const user = await isAuthorized(token, permission)

    if (!user?.isAuthorized) {
        throw new Error("Unauthorized access")
    }

    return await fetchFunction()
}
const fetchShipperResources = async (
    token: string,
    permission: string,
    data: any,
    fetchFunction: (data: any) => Promise<any>
) => {
    const user = await isAuthorized(token, permission)

    if (!user?.isAuthorized) {
        throw new Error("Unauthorized access")
    }

    return await fetchFunction(data)
}
// Generic function to check authorization and post data
const registerResource = async (
    token: string,
    permission: string,
    data: any,
    fetchFunction: (data: any) => Promise<any>
) => {
    console.log(token)

    const user = await isAuthorized(token, permission)

    if (!user?.isAuthorized) {
        throw new Error("Unauthorized access")
    }

    return await fetchFunction(data)
}

// Service to fetch all bids for Specific Shipper
export const getAllShipperBids = async (token: string, id: string) => {
    return await fetchShipperResources(token, "GetShipperBids", id, fetchShipperBids)
}
// Service to fetch all bids for Specific Shipper
export const getAllAdminBids = async (token: string, id: string) => {
    console.log('the thing is ',token);
    
    return await fetchShipperResources(token, "GetAdminBids", id, fetchShipperBids)
}

export const getLoadInfo = async (token: string, id: string) => {
    console.log("checking the value swapped tokn and id", id)

    return await fetchShipperResources(
        token,
        "GetLoadInfo",
        id,
        fetchLoadData
    )
}


export const updateLoadInfo = async (id: string, token: string, bidId: any) => {
    const isAuthorizedToAccess = await isAuthorized(token, "UpdateLoad")
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(isAuthorized)

        return await postLoadUpdate(id, bidId)
    }
    return false
}