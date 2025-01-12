"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true }, // ObjectId
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    companyRefId: { type: String, required: true },
}, { timestamps: true });
// Create an explicit index for `_id`
userSchema.index({ _id: 1 });
module.exports = mongoose_1.default.model("User", userSchema);
