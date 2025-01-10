import express, { Request, Response } from "express"
import {
    getAllDrivers,
    getAllStaffs,
    getAllVehicles,
    getAllCarriers,
    getAllShippers,
    getAllBids,
    getAllShipments,
    getTruck,
    getAllPayments,
    getPayment,
} from "../services/resource.service" // Services for fetching data
import { attachToken } from "../middlewares/auth.middleware"
import { addDriverInfo, getDriver, updateDriverInfo, updateTruckInfo } from "../services/user.service"
import { getAllAdminBids, getLoadInfo } from "../services/load.service"

const router = express.Router()

// Route to fetch all drivers
router.get("/drivers", attachToken, async (req: Request, res: Response) => {
     const token = req.query.token as string
    try {
        const response = await getAllDrivers(token)
        console.log(response)
        
        res.status(200).json(response)
    } catch (error) {
         
        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        })
    }
})

// Route to fetch all staffs
router.get("/staffs", attachToken, async (req: Request, res: Response) => {
     const token = req.query.token as string
    try {
        const response = await getAllStaffs(token)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        })
    }
})

// Route to fetch all vehicles
router.get("/vehicles", attachToken, async (req: Request, res: Response) => {
     const token = req.query.token as string
    try {
        const response = await getAllVehicles(token)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        })
    }
})

// Route to fetch all carriers
router.get("/carriers", attachToken, async (req: Request, res: Response) => {
     const token = req.query.token as string
    try {
        const response = await getAllCarriers(token)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        })
    }
})

// Route to fetch all shippers
router.get("/shippers", attachToken, async (req: Request, res: Response) => {
     const token = req.query.token as string
    try {
        const response = await getAllShippers(token)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        })
    }
})

// Route to fetch all bids
router.get("/bids/:id", attachToken, async (req: Request, res: Response) => {
     const token = req.query.token as string
    try {
        const id = req.params.id
        const response = await getAllBids(token,id)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        })
    }
})

// Route to fetch all shipments
// router.get("/shipments", attachToken, async (req: Request, res: Response) => {
//      const token = req.query.token as string
//     try {
//         const response = await getAllShipments(token)
//         res.status(200).json(response)
//     } catch (error) {
//         res.status(500).json({
//             error:
//                 error instanceof Error
//                     ? error.message
//                     : "An unknown error occurred",
//         })
//     }
// })
router.post(
    "/staff-driver/update-info/:id",
    attachToken,
    async (req: Request, res: Response) => {
        const id = req.params.id
        const token = req.query.token as string
        const data = req.body

        try {
            const response = await updateDriverInfo(id, token, data)
            console.log(response)

            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message })
            } else {
                res.status(500).json({ error: "An unknown error occurred" })
            }
        }
    }
)
router.get("/staff-driver/:id", attachToken, async (req: Request, res: Response) => {
    console.log(req.query)

    const id = req.params.id
    const token = req.query.token as string

    try {
        const response = await getDriver(id, token)
        console.log(response)

        res.status(200).json(response)
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message })
        } else {
            res.status(500).json({ error: "An unknown error occurred" })
        }
    }
})

router.post("/truck/update-info/:id", attachToken, async (req: Request, res: Response) => {
  

    const id = req.params.id
    let token = req.query.token as string
    if(!token){
        token = req.body.token
    }
    const data = req.body
console.log('the token is ',data);

    try {
        const response = await updateTruckInfo(id, token, data)
        console.log(response)

        res.status(200).json(response)
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message })
        } else {
            res.status(500).json({ error: "An unknown error occurred" })
        }
    }
})
router.post(
    "/staff-driver/add-info/:id",
    attachToken,
    async (req: Request, res: Response) => {
        const id = req.params.id
        const token = req.query.token as string
        const data = req.body

        try {
            const response = await addDriverInfo(id, token, data)
            console.log(response)

            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message })
            } else {
                res.status(500).json({ error: "An unknown error occurred" })
            }
        }
    }
)
router.get(
    "/truck/:id",
    attachToken,
    async (req: Request, res: Response) => {
        console.log(req.query)

        const id = req.params.id
        const token = req.query.token as string

        try {
            const response = await getTruck( token,id)
            console.log(response)

            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message })
            } else {
                res.status(500).json({ error: "An unknown error occurred" })
            }
        }
    }
)
router.get(
    "/shipments/:id",
    attachToken,
    async (req: Request, res: Response) => {
        const token = req.query.token as string
        const shipperId = req.params.id as string
        console.log(shipperId)

        try {
            const response = await getAllAdminBids(token, shipperId)
            console.log("the pickup response is ", response)

            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({
                error:
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
            })
        }
    }
)
router.get(
    "/load-info/:id",
    attachToken,
    async (req: Request, res: Response) => {
        console.log("shipper info requested")

        const id = req.params.id
        const token = req.query.token as string

        try {
            const response = await getLoadInfo(token, id)
            console.log(response)

            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message })
            } else {
                res.status(500).json({ error: "An unknown error occurred" })
            }
        }
    }
)
router.get("/payments", attachToken, async (req: Request, res: Response) => {
     const token = req.query.token as string
     
     
    try {
        
        
        const response = await getAllPayments(token)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        })
    }
})

router.get("/payments/:id", attachToken, async (req: Request, res: Response) => {
     const token = req.query.token as string
     const loadId = req.params.id
     
    try {
        
        
        const response = await getPayment(token, loadId)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        })
    }
})

export default router
