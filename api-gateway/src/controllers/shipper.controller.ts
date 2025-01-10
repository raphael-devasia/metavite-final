import express, { Request, Response } from "express"
import {
    getAllDrivers,
    getAllStaffs,
    getAllVehicles,
    getAllCarriers,
    getAllShippers,
    getAllBids,
    getAllShipments,
    addClients,
    addPickup,
    getAllPickups,
    getAllClients,
    addLoad,
    getShipper,
    getCarrier,
    createRazorPay,
    getClientInfo,
    getPickupInfo,
    verifyRazorPay,
    getAllPayments,
    getPayment,
} from "../services/resource.service" // Services for fetching data
import { attachToken } from "../middlewares/auth.middleware"
import { IClient, ILoadData } from "../models/user.models"
import {
    getAllShipperBids,
    getLoadInfo,
    updateLoadInfo,
} from "../services/load.service"
import { updateUserResource } from "../services/user.service"

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
    const shipperId = req.params.id as string
    console.log(shipperId)

    try {
        const response = await getAllShipperBids(token, shipperId)
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
})

// Route to fetch all shipments
router.get("/shipments", attachToken, async (req: Request, res: Response) => {
    const token = req.query.token as string
    try {
        const response = await getAllShipments(token)
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
// Route to add client details
router.post("/add-client", attachToken, async (req: Request, res: Response) => {
    const token = req.body.token as string
    const client: IClient = req.body
    try {
        const response = await addClients(token, client)
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
router.post("/add-pickup", attachToken, async (req: Request, res: Response) => {
    const token = req.body.token as string
    const pickup: IClient = req.body
    try {
        const response = await addPickup(token, pickup)
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
router.get(
    "/pick-ups/:id",
    attachToken,
    async (req: Request, res: Response) => {
        const token = req.query.token as string
        const shipperId = req.params.id as string
        console.log(shipperId)

        try {
            const response = await getAllPickups(token, shipperId)
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

// Route to fetch all shippers
router.get("/clients/:id", attachToken, async (req: Request, res: Response) => {
    const token = req.query.token as string
    const shipperId = req.params.id as string
    console.log(shipperId)

    try {
        const response = await getAllClients(token, shipperId)
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
router.post("/add-load", attachToken, async (req: Request, res: Response) => {
    const token = req.body.token as string
    const load: ILoadData = req.body

    try {
        const response = await addLoad(token, load)
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
router.get(
    "/get-shipper/:id",
    attachToken,
    async (req: Request, res: Response) => {
        console.log(req.query)

        const id = req.params.id
        const token = req.query.token as string

        try {
            const response = await getShipper(token, id)
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
router.get(
    "/pickup-info/:id",
    attachToken,
    async (req: Request, res: Response) => {
        console.log("shipper info requested")

        const id = req.params.id
        const token = req.query.token as string

        try {
            const response = await getPickupInfo(token, id)
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
    "/client-info/:id",
    attachToken,
    async (req: Request, res: Response) => {
        console.log("shipper info requested")

        const id = req.params.id
        const token = req.query.token as string

        try {
            const response = await getClientInfo(token, id)
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
    "/get-carrier/:id",
    attachToken,
    async (req: Request, res: Response) => {
        console.log(req.query)

        const id = req.params.id
        const token = req.query.token as string

        try {
            const response = await getCarrier(token, id)
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
router.post(
    "/update-load-info/:id",
    attachToken,
    async (req: Request, res: Response) => {
        const id = req.params.id
        const token = req.body.token as string
        const target = req.body.id

        try {
            const response = await updateLoadInfo(id, token, target)
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


router.post(
    "/delete-resource/:id",
    attachToken,
    async (req: Request, res: Response) => {
        const id = req.params.id
        const token = req.body.token as string
        const target = req.body.target
        
        

        try {
            const response = await updateUserResource(id, token, target)
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


router.post(
    "/create-razorpay-order/",
    attachToken,
    async (req: Request, res: Response) => {
        const token = req.body.token as string
        const paymentData = req.body

        try {
            const response = await createRazorPay(token, paymentData)
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
router.post(
    "/verify-payment/",
    attachToken,
    async (req: Request, res: Response) => {
        const token = req.body.token as string
        const paymentData = req.body

        try {
            const response = await verifyRazorPay(token, paymentData)
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

// Route to fetch all shippers
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

// Route to fetch all shippers
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
