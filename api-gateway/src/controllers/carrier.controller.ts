import express, { Request, Response } from "express"
import { inviteUser } from "../services/auth.service"
import {
    validateLogin,
    validateRegister,
    attachToken,
} from "../middlewares/auth.middleware"
import { addDriverInfo, getDriver, updateCarrierInfo, updateDriverInfo, updateTruckInfo } from "../services/user.service"
import { addBid, addTruck, getAllActiveBids, getAllBids, getAllCompanyDrivers, getAllCompanyTrucks, getAllPayments, getCarrier, getPayment, getShipper, getTruck } from "../services/resource.service"
import { getAllShipperBids, getLoadInfo, updateLoadInfo } from "../services/load.service"

const router = express.Router()

router.post(
    "/invite-driver",
    attachToken,
    async (req: Request, res: Response) => {
        try {
            const response = await inviteUser(req.body)
           

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
    console.log('the token is ',token);
    

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
// Route to fetch all bids
router.get("/bids/:id", attachToken, async (req: Request, res: Response) => {
    const token = req.query.token as string
    const id = req.params.id
    try {
        const response = await getAllBids(token, id)
       

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
router.get("/active-bids/:id", attachToken, async (req: Request, res: Response) => {
    const token = req.query.token as string
    const id = req.params.id
    try {
        const response = await getAllActiveBids(token, id)
       

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
router.post("/staff-driver/add-info/:id", attachToken, async (req: Request, res: Response) => {
  

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
})
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
    "/update-carrier-info/:id",
    attachToken,
    async (req: Request, res: Response) => {
        const id = req.params.id
        let token = req.query.token as string
        if (!token) {
            token = req.body.token
        }
        const data = req.body
        console.log("the token is ", data)

        try {
            const response = await updateCarrierInfo(id, token, data)
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





router.get("/get-drivers/:id", attachToken, async (req: Request, res: Response) => {
    const token = req.query.token as string
    const carrierId = req.params.id as string
    console.log(carrierId)

    try {
        const response = await getAllCompanyDrivers(token, carrierId)
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
router.get("/trucks/:id", attachToken, async (req: Request, res: Response) => {
    const token = req.query.token as string
    const carrierId = req.params.id as string
    console.log(carrierId)

    try {
        const response = await getAllCompanyTrucks(token, carrierId)
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
router.post(
    "/add-truck",
    attachToken,
    async (req: Request, res: Response) => {
        
        const token = req.body.token as string
        const data = req.body

        try {
            
            
            const response = await addTruck( token, data)
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
router.post("/post-bid", attachToken, async (req: Request, res: Response) => {
    const token = req.body.token as string
    const data = req.body

    try {
        const response = await addBid(token, data)
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
router.get(
    "/load-info/:id",
    attachToken,
    async (req: Request, res: Response) => {
        console.log('shipper info requested');
        

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
    "/staff-driver/load-info/:id",
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
// Route to fetch all bids
router.get(
    "/shipments/:id",
    attachToken,
    async (req: Request, res: Response) => {
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
    }
)
router.get(
    "/staff-driver/shipments/:id",
    attachToken,
    async (req: Request, res: Response) => {
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
    "/staff-driver/update-load-info/:id",
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


export default router


