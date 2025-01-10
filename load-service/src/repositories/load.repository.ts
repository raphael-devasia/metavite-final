import { BidData, ILoadData, LoadData } from "../database/load.model"

const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
import path from "path"
import { publishToQueue } from "../services/paymentUpdation.service"

const CARRIER_PROTO_PATH = path.join("/app/metaVite_Proto_Files/carrier.proto")
const packageDefinition = protoLoader.loadSync(CARRIER_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

const carrierProto = grpc.loadPackageDefinition(packageDefinition).carrier

const carrier_client = new (carrierProto as any).CarrierService(
    "carrier-service:3002",
    grpc.credentials.createInsecure()
)

export const fetchGetAllShipperBids = async (
    id: string
): Promise<{ success: boolean; bids: ILoadData[]; message: string }> => {
    try {
        console.log("Fetching bids for company ID:", id)

        // Determine the field to query based on the format of the ID

        const isCarrierRef = id.startsWith("CA")
        // Check if the ID starts with "DRIVER"
        const isDriverRef = id.startsWith("DRIVER")

        // Extract the portion after the prefix
        const extractedId = isDriverRef ? id.split("-")[1] : null
        let bids
        if (isCarrierRef) {
            bids = await LoadData.find({ bidCarrier: id })
        } else if (isDriverRef) {
            bids = await LoadData.find({ assignedDriver: extractedId })
        }else if(id==='admin'){
            bids = await LoadData.find()
        } else {
            bids = await LoadData.find({ shipperRefId: id })
        }

        // Find the company by ID

        if (!bids) {
            console.error("Bids not found for shipper reference.")
            return {
                success: false,
                message: "Bids not found for pickup reference.",
                bids: [],
            }
        }

        return {
            success: true,
            message: "bids fetched successfully.",
            bids: bids, // Returning the array of pickup details
        }
    } catch (error) {
        console.error("Error fetching Bids:", error)
        throw new Error("Failed to fetch Bids from the database")
    }
}

export const fetchAllLoadData = async (
    reference: any
): Promise<{
    success: boolean
    load: any | null
    message: string
}> => {
    const id = reference.id
    try {
        // Find the company by ID
        const loads = await LoadData.find({ status: "Open" })

        if (!loads) {
            console.error("Bids not found for shipper reference.")
            return {
                success: false,
                message: "Bids not found for pickup reference.",
                load: null,
            }
        }
        if (!id) {
            return {
                success: true,
                message: "bids fetched successfully.",
                load: loads, // Returning the array of pickup details
            }
        }
       

        const bids = await BidData.find({ companyRefId: id })
        const referencedLoadIds = new Set(bids.map((bid) => bid.loadRefId))

        const load = loads.filter(
            (load) => !referencedLoadIds.has(load._id.toString())
        )

        return {
            success: true,
            message: "bids fetched successfully.",
            load, // Returning the array of pickup details
        }
    } catch (error) {
        console.error("Error fetching Bids:", error)
        throw new Error("Failed to fetch Bids from the database")
    }
}
export const updateLoadInfo = async (
    id: string,
    bidId: any
): Promise<{ success: boolean; message: string }> => {
    try {
        if (bidId === "Cancelled") {
            const result = await LoadData.findByIdAndUpdate(
                id, // ID of the truck to update
                {
                    // Fields to update
                    $set: {
                        status: "Cancelled",
                    },
                },
                { new: true, runValidators: true } // Options: return updated doc & validate
            )
            if (result) {
                const paymentUpdateData = {
                    loadId:result._id,
                    action:'Refund'
                }
                console.log(paymentUpdateData);
                
                 await publishToQueue(
                     "paymentUpdateQueue",
                     JSON.stringify(paymentUpdateData)
                 )

                return { success: true, message: "Load cancelled successfully" }
            } else {
                return {
                    success: false,
                    message: "Load not found with the given ID",
                }
            }
        }if (
            bidId === "Picked" ||
            bidId === "Dispatched" ||
            bidId === "Delivered1" ||
            bidId === "Delivered2" ||
            bidId === "Delivered3" ||
            bidId === "Delivered" ||
            bidId === "Delivered1-Partial" ||
            bidId === "Delivered2-Partial" ||
            bidId === "Delivered3-Partial" ||
            bidId === "Completed"
        ) {
            const result = await LoadData.findByIdAndUpdate(
                id, // ID of the truck to update
                {
                    // Fields to update
                    $set: {
                        status: bidId,
                    },
                },
                { new: true, runValidators: true } // Options: return updated doc & validate
            )
          

            if (result) {
                if (bidId === "Completed"){
                     const paymentUpdateData = {
                         loadId: result._id,
                         action: "Release",
                     }
                     console.log(paymentUpdateData);
                     
                     await publishToQueue(
                         "paymentUpdateQueue",
                         JSON.stringify(paymentUpdateData)
                     )
                }
                    return {
                        success: true,
                        message: "Load Status Updated successfully",
                    }
            } else {
                return {
                    success: false,
                    message: "Load not found with the given ID",
                }
            }
        }
        const bid: any = await BidData.findById(bidId)
        console.log("the final track", bid, id)
        // Find the truck by ID and update the fields
        const result = await LoadData.findByIdAndUpdate(
            id, // ID of the truck to update
            {
                // Fields to update
                $set: {
                    status: "Assigned",
                    selectedBid: bidId,
                    bids: [],
                    lowestPrice: bid.bid,
                    bidCarrier: bid.companyRefId,
                    assignedDriver: bid.driver,
                },
            },
            { new: true, runValidators: true } // Options: return updated doc & validate
        )

        if (result) {
            //

            const dropoffCount = result?.dropoffs
            let targetCity: string = ""
            let currentCity: string = ""
            let deliveryTime: Date | undefined
            currentCity = result?.pickupLocation?.address.city || ""
            if (dropoffCount === 1) {
                targetCity = result?.dropoff1?.address?.city || ""
                deliveryTime = result?.appointment1
                    ? new Date(result.appointment1)
                    : undefined
            } else if (dropoffCount === 2) {
                targetCity = result?.dropoff2?.address.city || ""
                deliveryTime = result?.appointment2
                    ? new Date(result.appointment2)
                    : undefined
            } else if (dropoffCount === 3) {
                targetCity = result?.dropoff3?.address.city || ""
                deliveryTime = result?.appointment3
                    ? new Date(result.appointment3)
                    : undefined
            }
            const locationData = { targetCity, currentCity, deliveryTime }
            console.log("the delivary time is ", deliveryTime)

            // gRPC call to update driver data
            carrier_client.UpdateCarrierResources(
                { bid, locationData },
                (error: any, response: any) => {
                    if (error) {
                        console.error("Error updating driver:", error)
                    } else {
                        console.log("Driver updated:", response.message)
                    }
                }
            )
            if (result) {
                return { success: true, message: "Load updated successfully" }
            }

            return { success: true, message: "Load updated successfully" }
        } else {
            console.log("Load not found with the given ID:", id)
            return {
                success: false,
                message: "Load not found with the given ID",
            }
        }
    } catch (error) {
        console.error("Error updating load:", error)
        return {
            success: false,
            message: "Error updating load",
        }
    }
}

// getting all the info about single load
export const fetchLoadData = async (
    id: string
): Promise<{ success: boolean; load: any | null; message: string }> => {
    try {
        console.log("Fetching load data for ID:", id)

        // Fetch load details from the database
        const loadData = await LoadData.findById(id).populate("bids")
        console.log("Full load details:", loadData)

        if (!loadData) {
            console.error("Load data not found for the given ID.")
            return {
                success: false,
                message: "Load data not found for the given ID.",
                load: null,
            }
        }

        let selectedBidDetails = null

        // If a selectedBid exists, fetch its details via gRPC calls
        if (loadData.selectedBid) {
            const selectedBidId = loadData.selectedBid
            const bid: any = await BidData.findById(selectedBidId)

            if (!bid) {
                console.error("Bid data not found for the selected bid ID.")
                return {
                    success: false,
                    message: "Bid data not found for the selected bid ID.",
                    load: null,
                }
            }

            try {
                // Fetch gRPC data
                const companyResponse: any = await new Promise(
                    (resolve, reject) => {
                        carrier_client.GetCompanyInfo(
                            { companyRefId: bid.companyRefId },
                            (error: any, response: any) => {
                                if (error) return reject(error)

                                resolve(response)
                            }
                        )
                    }
                )

                const driverResponse: any = await new Promise(
                    (resolve, reject) => {
                        carrier_client.GetDriverInfo(
                            { id: bid.driver },
                            (error: any, response: any) => {
                                if (error) return reject(error)

                                resolve(response)
                            }
                        )
                    }
                )

                const truckResponse: any = await new Promise(
                    (resolve, reject) => {
                        carrier_client.fetchTruckData(
                            { id: bid.vehicle },
                            (error: any, response: any) => {
                                if (error) return reject(error)

                                resolve(response)
                            }
                        )
                    }
                )

                selectedBidDetails = {
                    bid,
                    companyDetails: companyResponse.user,
                    driverDetails: driverResponse.user,
                    truckDetails: truckResponse.truck,
                }

                console.log(
                    "Selected bid details fetched successfully:",
                    selectedBidDetails
                )
            } catch (grpcError) {
                console.error(
                    "Error fetching details from carrier service:",
                    grpcError
                )
                return {
                    success: false,
                    message:
                        "Failed to fetch additional details for the selected bid.",
                    load: null,
                }
            }
        }
        const finalData = { ...loadData.toObject(), selectedBidDetails }
        console.log("the final data is ", finalData)

        return {
            success: true,
            message: "Load details fetched successfully.",
            load: {
                ...loadData.toObject(),
                selectedBidDetails,
            },
        }
    } catch (error) {
        console.error("Error fetching load details:", error)
        return {
            success: false,
            message: "Error fetching load details.",
            load: null,
        }
    }
}

export const fetchAllActiveLoadData = async (
    reference: any
): Promise<{
    success: boolean
    load: any | null
    message: string
}> => {
    const id = reference.id
    try {
        // Find the company by ID
        const loads = await LoadData.find()

        if (!loads) {
            console.error("Bids not found for shipper reference.")
            return {
                success: false,
                message: "Bids not found for pickup reference.",
                load: null,
            }
        }
        if (!id) {
            return {
                success: true,
                message: "bids fetched successfully.",
                load: loads, // Returning the array of pickup details
            }
        }
         if (id === "admin") {
            console.log('the is is ',id);
            
             
             return {
                 success: true,
                 message: "bids fetched successfully.",
                 load: loads, // Returning the array of pickup details
             }
         }

        const bids = await BidData.find({ companyRefId: id })
        const referencedLoadIds = new Set(bids.map((bid) => bid.loadRefId))

        const load = loads.filter((load) =>
            referencedLoadIds.has(load._id.toString())
        )

        return {
            success: true,
            message: "bids fetched successfully.",
            load, // Returning the array of pickup details
        }
    } catch (error) {
        console.error("Error fetching Bids:", error)
        throw new Error("Failed to fetch Bids from the database")
    }
}

export const fetchDriverAndVehicleInfo = async (bidId:string) => {
    try {
        console.log("Fetching information for Bid ID:", bidId)

        // Fetch the bid details from the database
        const bid = await BidData.findById(bidId)
        if (!bid) {
            console.error("Bid not found for the given ID.")
            return {
                success: false,
                message: "Bid not found for the given ID.",
                data: null,
            }
        }

        // Fetch the associated load details
        const load = await LoadData.findOne({ bids: bidId })
        if (!load) {
            console.error("Load not found for the given bid ID.")
            return {
                success: false,
                message: "Load not found for the given bid ID.",
                data: null,
            }
        }

        let driverDetails = null
        let vehicleDetails = null

        try {
            // Fetch driver details using gRPC
            driverDetails = await new Promise((resolve, reject) => {
                carrier_client.GetDriverInfo(
                    { id: bid.driver },
                    (error:any, response:any) => {
                        if (error) return reject(error)
                        resolve(response.user)
                    }
                )
            })

            // Fetch vehicle details using gRPC
            vehicleDetails = await new Promise((resolve, reject) => {
                carrier_client.fetchTruckData(
                    { id: bid.vehicle },
                    (error:any, response:any) => {
                        if (error) return reject(error)
                        resolve(response.truck)
                    }
                )
            })
        } catch (grpcError) {
            console.error(
                "Error fetching details from gRPC services:",
                grpcError
            )
            return {
                success: false,
                message:
                    "Error fetching driver or vehicle details from external service.",
                data: null,
            }
        }

        // Combine all details into a single object
        const combinedData = {
            bid,
            load,
            driverDetails,
            vehicleDetails,
        }

        console.log("Combined Data:", combinedData)

        return {
            success: true,
            message: "Data fetched successfully.",
            data: combinedData,
        }
    } catch (error) {
        console.error("Error fetching data:", error)
        return {
            success: false,
            message: "Error fetching data.",
            data: null,
        }
    }
}

