import { Router } from "express"
import carrierController from "../controllers/carrier.controller"

const router = Router()

router.use("/carrier", carrierController)


export default router
