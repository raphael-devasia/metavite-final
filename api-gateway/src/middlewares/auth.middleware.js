"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachToken = exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegister = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("role")
        .isIn([
        "shipperStaff",
        "appAdmin",
        "driver",
        "carrierAdmin",
        "shipperAdmin",
    ])
        .withMessage("Invalid role"),
    (0, express_validator_1.body)("name.firstName").notEmpty().withMessage("First name is required"),
    (0, express_validator_1.body)("name.lastName").notEmpty().withMessage("Last name is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        else {
            next();
        }
    },
];
exports.validateLogin = [
    (0, express_validator_1.body)("username").notEmpty().withMessage("Username is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        else {
            next();
        }
    },
];
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
const attachToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log('the token is coming', authHeader);
    console.log(`Incoming Route: ${req.originalUrl}, Method: ${req.method}, Token attached:`, req.method === "POST" ? req.body : req.query);
    // Skip logic for specific conditions
    if (req.originalUrl === "/auth/register" &&
        req.method === "POST" &&
        (req.body.role === "shipperAdmin" ||
            req.body.role === "carrierAdmin" ||
            req.body.role === "appAdmin")) {
        return next(); // Skip the rest of the middleware logic
    }
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (req.method === "POST") {
            req.body.token = token;
        }
        else if (req.method === "GET") {
            req.query.token = token;
        }
        next();
    }
    else {
        res.status(401).json({ error: "Authorization token is missing" });
    }
};
exports.attachToken = attachToken;
