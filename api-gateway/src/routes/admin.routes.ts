import { Router } from "express"
import adminController from "../controllers/admin.controller"

const router = Router()

router.use("/admin", adminController)
export default router


