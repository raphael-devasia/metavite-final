import { Request, Response, NextFunction, RequestHandler } from "express"
import { body, validationResult } from "express-validator"

export const validateRegister: RequestHandler[] = [
    
    
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("role")
        .isIn([
            "shipperStaff",
            "appAdmin",
            "driver",
            "carrierAdmin",
            "shipperAdmin",
        ])
        .withMessage("Invalid role"),
    body("name.firstName").notEmpty().withMessage("First name is required"),
    body("name.lastName").notEmpty().withMessage("Last name is required"),
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        } else {
            next()
        }
    },
]

export const validateLogin: RequestHandler[] = [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        } else {
            next()
        }
    },
]

// export const attachToken = (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): void => {
//     const authHeader = req.headers["authorization"]
//     if (authHeader) {
//         const token = authHeader.split(" ")[1]
//         req.body.token = token
//         console.log("from middleware", req.body)

//         next()
//     } else {
//         res.status(401).json({ error: "Authorization token is missing" })
//     }
// }
export const attachToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers["authorization"]
    
    console.log('the token is coming',authHeader);
    
    console.log(
        `Incoming Route: ${req.originalUrl}, Method: ${req.method}, Token attached:`,
        req.method === "POST" ? req.body : req.query
    )
    // Skip logic for specific conditions
    if (
        req.originalUrl === "/auth/register" &&
        req.method === "POST" &&
        (req.body.role === "shipperAdmin" ||
            req.body.role === "carrierAdmin" ||
            req.body.role === "appAdmin")
    ) {
        return next() // Skip the rest of the middleware logic
    }
    if (authHeader) {
        const token = authHeader.split(" ")[1]

        if (req.method === "POST") {
            req.body.token = token
        } else if (req.method === "GET") {
            req.query.token = token
        }

        next()
    } else {
        res.status(401).json({ error: "Authorization token is missing" })
    }
}