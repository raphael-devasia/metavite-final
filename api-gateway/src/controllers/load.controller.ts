import express, { Request, Response } from "express"
import {
   
    addLoad,
} from "../services/resource.service" // Services for fetching data
import { attachToken } from "../middlewares/auth.middleware"
import { IClient, ILoadData } from "../models/user.models"

const router = express.Router()






export default router
