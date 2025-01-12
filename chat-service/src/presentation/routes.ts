import { Router } from "express"
const router = Router()

// Ensure these paths correctly point to your controller functions
const { getAllUsers, getUserMessages } = require("./user.controller")

// Define the routes
router.get("/", getAllUsers) // This should map to a valid function
router.get("/:id/messages", getUserMessages) // This should map to a valid function

module.exports = router
