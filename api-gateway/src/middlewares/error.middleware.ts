import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/errors"


function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message })
    } else {
        res.status(500).json({ error: "An unknown error occurred" })
    }
}

export default errorHandler
