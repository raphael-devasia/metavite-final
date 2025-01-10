import {  ILoadData, LoadData, BidData } from "../database/load.model"
const { io } = require("../services/socket.io.server")

export const saveLoadToDB = async (
    load: ILoadData
): Promise<{ success: boolean; message: string }> => {
    try {
        console.log(load)

        // If the client does not exist, create a new client and link to the company
        const newLoad = new LoadData(load)

        await newLoad.save()
        console.log("load saved to database:", newLoad)

        return { success: true, message: "Load Saved Successfully" }
    } catch (error) {
        console.error("Error saving load to database:", error)
        throw new Error("Failed to save load to database")
    }
}

export const saveBidToDB = async (
    bid: any
): Promise<{ success: boolean; message: string }> => {
    try {
        
        console.log(bid.bid)
        const data = bid.bid

        // If the client does not exist, create a new client and link to the company
        const newBid = new BidData(data)
        console.log("the bid id is ", bid.bid.loadRefId)
       
        
        const newADta = await LoadData.findByIdAndUpdate(bid.bid.loadRefId, {
            $push: { bids: newBid._id.toString() },
            $set: { lowestPrice: newBid.bid }, // Corrected syntax here
        })

       
        console.log("the data is ", newADta)
        await newBid.save()
        console.log("bid saved to database:", newBid)
        
  io.emit("lowestBidUpdate", {
      newBid,
  })
        

        return { success: true, message: "Bid Saved Successfully" }
    } catch (error) {
        console.error("Error saving bid to database:", error)
        throw new Error("Failed to save bid to database")
    }
}
