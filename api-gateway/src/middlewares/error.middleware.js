"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../utils/errors");
function errorHandler(err, req, res, next) {
    if (err instanceof errors_1.AppError) {
        res.status(err.statusCode).json({ error: err.message });
    }
    else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
}
exports.default = errorHandler;
