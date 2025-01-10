class AppError extends Error {
    statusCode: number

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }
}

class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409)
    }
}

class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404)
    }
}

class ServerError extends AppError {
    constructor(message: string) {
        super(message, 500)
    }
}

export { AppError, ConflictError, NotFoundError, ServerError }
