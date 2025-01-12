"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const User = require("../infrastructure/database/models/user.model");
const MessageModel = require("../infrastructure/database/models/MessageModel");
// Get all users
exports.getAllUsers = (req, res, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params ? req.params.userId : req.userId;
        console.log(userId);
        // Aggregate query to fetch messaged users based on the userId
        const users = yield MessageModel.aggregate([
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
        ]);
        // Return the list of messaged users
        if (callback) {
            callback({ success: true, users });
        }
        else {
            res.status(200).json(users);
        }
    }
    catch (error) {
        // Handle errors
        const errorResponse = {
            success: false,
            message: "Failed to fetch messaged users.",
        };
        if (callback) {
            callback(errorResponse);
        }
        else {
            res.status(500).json(errorResponse);
        }
    }
});
// Get previous messages for a user
exports.getUserMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const messages = yield MessageModel.find({
            $or: [{ senderId: userId }, { recipientId: userId }],
        }).sort({ createdAt: 1 }); // Sort by timestamp
        res.status(200).json({ messages });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
});
