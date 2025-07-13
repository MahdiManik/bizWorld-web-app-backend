"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, statusCode, code, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
