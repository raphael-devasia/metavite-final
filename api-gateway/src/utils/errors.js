"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.NotFoundError = exports.ConflictError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ServerError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}
exports.ServerError = ServerError;
