const User = require("../infrastructure/database/models/user.model")
const MessageModel = require("../infrastructure/database/models/MessageModel")

// Get all users
exports.getAllUsers = async (req:any, res:any, callback:any) => {
    try {
        
        const userId = req.params ? req.params.userId : req.userId
console.log(userId);

        // Aggregate query to fetch messaged users based on the userId
        const users = await MessageModel.aggregate([
            {
                $match: {
                    $or: [{ senderId: userId }, { recipientId: userId }],
                },
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", userId] },
                            "$recipientId",
                            "$senderId",
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "users", // Reference to the users collection
                    localField: "_id", // Match userId from messages with _id in users collection
                    foreignField: "_id",
                    as: "userDetails", // Alias for the joined user details
                },
            },
            {
                $unwind: "$userDetails", // Unwind the userDetails array to access individual fields
            },
            {
                $project: {
                    _id: 1,
                    name: {
                        $concat: [
                            "$userDetails.name.firstName",
                            " ",
                            "$userDetails.name.lastName",
                        ],
                    },
                    companyRefId: "$userDetails.companyRefId", // Ensure this matches the field in your user model
                },
            },
        ])

        // Return the list of messaged users
        if (callback) {
            callback({ success: true, users })
        } else {
            res.status(200).json(users)
        }
    } catch (error) {
        // Handle errors
        const errorResponse = {
            success: false,
            message: "Failed to fetch messaged users.",
        }
        if (callback) {
            callback(errorResponse)
        } else {
            res.status(500).json(errorResponse)
        }
    }
}

// Get previous messages for a user
exports.getUserMessages = async (req:any, res:any) => {
    const userId = req.params.id

    try {
        const messages = await MessageModel.find({
            $or: [{ senderId: userId }, { recipientId: userId }],
        }).sort({ createdAt: 1 }) // Sort by timestamp

        res.status(200).json({ messages })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch messages" })
    }
}
