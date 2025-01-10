import {
    fetchDriverInformation,
    postCarrierUpdate,
    postDriverOnBoarding,
    postTruckUpdate,
    updateDriverDetails,
} from "../repositories/carrier.repository"
import { deleteUserResource } from "../repositories/shipper.repository"
import { isAuthorized } from "../repositories/verify.repository"

export const getDriver = async (id: string, token: string) => {
    const isAuthorizedToAccess = await isAuthorized(token, "GetDriverDetails")
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(isAuthorized)

        return await fetchDriverInformation(id)
    }
    return false
}

export const addDriverInfo = async (id: string, token: string, data: any) => {
    console.log(token)

    const isAuthorizedToAccess = await isAuthorized(data.token, "AddOnBoarding")
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(isAuthorized)

        return await postDriverOnBoarding(id, data)
    }
    return false
}
export const updateTruckInfo = async (id: string, token: string, data: any) => {
    console.log(token)

    const isAuthorizedToAccess = await isAuthorized(data.token, "UpdateTruck")
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(isAuthorized)

        return await postTruckUpdate(id, data)
    }
    return false
}
export const updateCarrierInfo = async (id: string, token: string, data: any) => {
    console.log(token)

    const isAuthorizedToAccess = await isAuthorized(data.token, "UpdateCompany")
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(isAuthorized)

        return await postCarrierUpdate(id, data)
    }
    return false
}
export const updateUserResource = async (id: string, token: string, target: any) => {
    console.log(token)
    console.log('the target body is ',target);
    

    const isAuthorizedToAccess = await isAuthorized(token, "DeleteUserResource")
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(isAuthorized)

        return await deleteUserResource(id, target)
    }
    return false
}

export const updateDriverInfo = async (
    id: string,
    token: string,
    data: any
) => {
    


    const isAuthorizedToAccess = await isAuthorized(
        data.token,
        "updateDriverInfo"
    )
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(isAuthorized)

        return await updateDriverDetails(id, data)
    }
    return false
}
// export const getShipper = async (id: string, token: string) => {
//     const isAuthorizedToAccess = await isAuthorized(token, "GetShipperDetails")
//     if (isAuthorizedToAccess.isAuthorized) {
//         console.log(isAuthorized)

//         return await fetchDriverInformation(id)
//     }
//     return false
// }
// export const getCarrier = async (id: string, token: string) => {
//     const isAuthorizedToAccess = await isAuthorized(token, "GetCarrierDetails")
//     if (isAuthorizedToAccess.isAuthorized) {
//         console.log(isAuthorized)

//         return await fetchDriverInformation(id)
//     }
//     return false
// }