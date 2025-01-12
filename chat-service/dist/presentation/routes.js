"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Ensure these paths correctly point to your controller functions
const { getAllUsers, getUserMessages } = require("./user.controller");
// Define the routes
router.get("/", getAllUsers); // This should map to a valid function
router.get("/:id/messages", getUserMessages); // This should map to a valid function
module.exports = router;
