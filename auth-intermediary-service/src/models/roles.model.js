"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = void 0;
var mongoose_1 = require("mongoose");
var RoleSchema = new mongoose_1.Schema({
    role: {
        type: String,
        required: true,
        unique: true,
    },
    allowedFeatures: {
        type: [String],
        required: true,
    },
}, { timestamps: true } // Automatically adds createdAt and updatedAt
);
exports.RoleModel = mongoose_1.default.model("Role", RoleSchema);
