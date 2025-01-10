import { Router } from "express"
import shipperController from "../controllers/shipper.controller"

const router = Router()

router.use("/shipper", shipperController)

export default router
