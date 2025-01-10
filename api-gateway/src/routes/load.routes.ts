import { Router } from "express"
import loadController from "../controllers/load.controller"

const router = Router()

router.use("/shipper", loadController)
export default router
