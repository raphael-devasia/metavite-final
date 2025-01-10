import { IClient, ILoadData } from "../models/user.models"
import {
    
    addNewTruck,
    fetchAllCompanyDrivers,
    fetchAllCompanyTrucks,
    fetchCarrierDetails,
    fetchDrivers,
    fetchTruckData,
} from "../repositories/carrier.repository"
import { fetchVehicles } from "../repositories/carrier.repository"
import { fetchCarriers } from "../repositories/carrier.repository"
import { addNewBid, addNewLoad, fetchActiveBids, fetchBids } from "../repositories/load.repositor"
import { fetchAllPayments, fetchPayment, newPaymentMethod, verifyPaymentMethod } from "../repositories/payment.repository"

import {
    addNewClients,
    addNewPickUp,
    fetchAllClients,
    
    fetchAllPickups,
    fetchClientData,
    fetchPickupData,
    fetchShipperData,
    fetchShippers,
} from "../repositories/shipper.repository"
import { fetchStaffs } from "../repositories/shipper.repository"

import { fetchShipments } from "../repositories/shipper.repository"

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

// Service to fetch all drivers
export const getAllDrivers = async (token: string) => {
    return await fetchResource(token, "GetAllDriverDetails", fetchDrivers)
}

// Service to fetch all staffs
export const getAllStaffs = async (token: string) => {
    return await fetchResource(token, "GetAllStaffDetails", fetchStaffs)
}

// Service to fetch all vehicles
export const getAllVehicles = async (token: string) => {
    return await fetchResource(token, "GetAllVehicleDetails", fetchVehicles)
}

// Service to fetch all carriers
export const getAllCarriers = async (token: string) => {
    return await fetchResource(token, "GetCarriers", fetchCarriers)
}

// Service to fetch all shippers
export const getAllShippers = async (token: string) => {
    return await fetchResource(token, "GetShippers", fetchShippers)
}
// Service to fetch all Payments
export const getAllPayments = async (token: string) => {
    
    
    return await fetchResource(token, "GetPayments", fetchAllPayments)
}



// Service to fetch all Active bids
export const getAllActiveBids = async (token: string,id:string) => {
    return await fetchShipperResources(token, "GetBids", id,fetchActiveBids)
}

// Service to fetch all bids
export const getPayment = async (token: string,id:string) => {
    return await fetchShipperResources(token, "GetPayments", id, fetchPayment)
}

// Service to fetch all shipments
export const getAllShipments = async (token: string) => {
    return await fetchResource(token, "GetShipments", fetchShipments)
}

// Service to add a new client
export const addClients = async (token: string, client: IClient) => {
    return await registerResource(token, "AddClient", client, addNewClients)
}
// Service to add a new client
export const addLoad = async (token: string, load: ILoadData) => {
    return await registerResource(token, "AddLoad", load, addNewLoad)
}
// Service to add a new pickup
export const addPickup = async (token: string, pickup: IClient) => {
    return await registerResource(token, "AddPickup", pickup, addNewPickUp)
}
// Service to add a new pickup
export const getAllPickups = async (token: string, id: string) => {
    return await fetchShipperResources(
        token,
        "GetAllPickups",
        id,
        fetchAllPickups
    )
}
export const getAllClients = async (token: string, id: string) => {
    return await fetchShipperResources(
        token,
        "GetAllClients",
        id,
        fetchAllClients
    )
}
// Service to fetch all drivers
export const getAllCompanyDrivers = async (token: string, id: string) => {
    return await fetchShipperResources(
        token,
        "GetAllCompanyDrivers",
        id,
        fetchAllCompanyDrivers
    )
}
export const getAllCompanyTrucks = async (token: string, id: string) => {
    return await fetchShipperResources(
        token,
        "GetAllCompanyTrucks",
        id,
        fetchAllCompanyTrucks
    )
}
export const getShipper = async (token: string, id: string) => {
    console.log("checking the value swapped tokn and id", id)

    return await fetchShipperResources(
        token,
        "GetShipperDetails",
        id,
        fetchShipperData
    )
}
export const addTruck = async (token: string, truck: any) => {
    console.log("the first point data is ", token)

    return await registerResource(token, "AddTruck", truck, addNewTruck)
}
export const addBid = async (token: string, truck: any) => {
    console.log("the first point data is ", token)

    return await registerResource(token, "AddBid", truck, addNewBid)
}

// Service to fetch all bids
export const getAllBids = async (token: string,id:string) => {
    return await fetchShipperResources(token, "GetBids", id, fetchActiveBids)
}

export const getTruck = async (token: string, id: string) => {
    console.log("checking the value swapped tokn and id", id)

    return await fetchShipperResources(
        token,
        "GetTruckDetails",
        id,
        fetchTruckData
    )
}

export const getClientInfo = async (token: string, id: string) => {
    console.log("checking the value swapped tokn and id", id)

    return await fetchShipperResources(
        token,
        "GetClientInfo",
        id,
        fetchClientData
    )
}
export const getPickupInfo = async (token: string, id: string) => {
    console.log("checking the value swapped tokn and id", id)

    return await fetchShipperResources(
        token,
        "GetPickupInfo",
        id,
        fetchPickupData
    )
}

export const getCarrier = async (token: string, id: string) => {
    console.log("checking the value swapped tokn and id", id)

    return await fetchShipperResources(
        token,
        "GetCarrierDetails",
        id,
        fetchCarrierDetails
    )
}
export const createRazorPay = async (token: string, paymentData: any) => {
    console.log("the first point data is ", paymentData)

    return await registerResource(
        token,
        "createPayment",
        paymentData,
        newPaymentMethod
    )
}
export const verifyRazorPay = async (token: string, paymentData: any) => {
    console.log("the first point data is ", paymentData)

    return await registerResource(
        token,
        "verifyPayment",
        paymentData,
        verifyPaymentMethod
    )
}
