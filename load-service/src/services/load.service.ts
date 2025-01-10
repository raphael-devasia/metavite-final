import { saveBidToDB, saveLoadToDB } from "../repositories/shipper.repository"
import { IBid, ILoadData } from "../database/load.model"
const { v4: uuidv4 } = require("uuid")
import {
    fetchAllActiveLoadData,
    fetchAllLoadData,
    fetchGetAllShipperBids,
    fetchLoadData,
} from "../repositories/load.repository"

// const consumerShipperServiceQueue = async () => {
//     const {  channel } = await connectRabbitMQ()
//     const queue = "shipperServiceQueue"

//     await channel.assertQueue(queue, { durable: true })
//     console.log("Waiting for messages in queue:", queue)

//     channel.consume(queue, async (msg: any) => {
//         if (msg !== null) {
//             const message = JSON.parse(msg.content.toString())
//             console.log("Received message:", message)

//             const {
//                 userId,
//                 name,
//                 email,
//                 companyRefId,
//                 personalDetails: { emergencyContact },
//                 companyDetails,
//             } = message

//             const {
//                 companyName,
//                 companyEmail,
//                 companyPhone,
//                 taxId,
//                 address: companyAddress,
//             } = companyDetails

//             const { addressLine1, addressLine2, city, state, postalCode } =
//                 companyAddress

//             try {
//                 if (!userId) {
//                     throw new Error("Missing userId in message")
//                 }
//                 const objectId = new mongoose.Types.ObjectId(userId)
//                 console.log(objectId);

//                 const newCompany = new Company({
//                     _id: objectId,
//                     name,
//                     email,
//                     companyRefId,
//                     address: {
//                         addressLine1,
//                         addressLine2,
//                         city,
//                         state,
//                         postalCode,
//                     },
//                     personalDetails: {
//                         emergencyContact: {
//                             name: emergencyContact.name,
//                             phoneNumber: emergencyContact.phoneNumber,
//                         },
//                     },
//                     companyDetails: {
//                         companyName,
//                         companyEmail,
//                         companyPhone,
//                         taxId,
//                         address: {
//                             addressLine1,
//                             addressLine2,
//                             city,
//                             state,
//                             postalCode,
//                         },
//                     },
//                 })

//                 await newCompany.save()
//                 console.log("Company data saved:", newCompany)
//                 channel.ack(msg)
//             } catch (error) {
//                 console.error("Error saving company data:", error)
//                 channel.nack(msg)
//             }
//         }
//     })
// }

// consumerShipperServiceQueue().catch(console.error)
function generateLoadWithId(load: ILoadData) {
    // Generate a random UUID
    const randomUuid = uuidv4()

    // Take the first 10 characters of the UUID, remove hyphens, and convert to uppercase
    load.loadId = `LM-${randomUuid
        .replace(/-/g, "")
        .substring(0, 10)
        .toUpperCase()}`

    return load
}

export const addNewLoad = async (
    load: ILoadData
): Promise<{ success: boolean; message: string }> => {
    try {
        console.log(load)

        // Add loadId to the load
        const updatedLoad = generateLoadWithId(load)

        console.log("Updated Load:", updatedLoad)

        // Call the repository to register the client
        return await saveLoadToDB(load)
    } catch (error) {
        console.error("Error in adding Client:", error)
        throw new Error("Service error while fetching user")
    }
}
export const getAllBids = async (
    id: string
): Promise<{ success: boolean; bids: ILoadData[]; message: string }> => {
    try {
        console.log(id)

        // Call the repository to register the client
        return await fetchGetAllShipperBids(id)
    } catch (error) {
        console.error("Error in adding Address:", error)
        throw new Error("Service error while fetching user")
    }
}
export const getLoadInfo = async (
    id: string
): Promise<{ success: boolean; load: ILoadData | null; message: string }> => {
    try {
        console.log(id)

        // Call the repository to register the client
        return await fetchLoadData(id)
    } catch (error) {
        console.error("Error in adding Address:", error)
        throw new Error("Service error while fetching user")
    }
}

export const getAllLoadInfo = async (
    id: string
): Promise<{ success: boolean; load: ILoadData | null; message: string }> => {
    try {
        // Call the repository to register the client
        return await fetchAllLoadData(id)
    } catch (error) {
        console.error("Error in adding Address:", error)
        throw new Error("Service error while fetching user")
    }
}
export const addNewBid = async (
    bid: IBid
): Promise<{ success: boolean; message: string }> => {
    try {
        console.log(bid)

        // Call the repository to register the client
        return await saveBidToDB(bid)
    } catch (error) {
        console.error("Error in adding Bid:", error)
        throw new Error("Service error while fetching user")
    }
}

export const getAllActiveLoadInfo = async (
    id: string
): Promise<{ success: boolean; load: ILoadData | null; message: string }> => {
    try {
      

        // Call the repository to register the client
        return await fetchAllActiveLoadData(id)
    } catch (error) {
        console.error("Error in adding Address:", error)
        throw new Error("Service error while fetching user")
    }
}