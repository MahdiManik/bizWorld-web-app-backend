"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ApiError = void 0;
const type_1 = require("../../shared-types/type");
// Type guard to check if a value is a valid ErrorCode
const isErrorCode = (code) => {
    return Object.values(type_1.ErrorCode).includes(code);
};
// Helper function to safely get an error code
const getErrorCode = (code) => {
    return isErrorCode(code) ? code : type_1.ErrorCode.INTERNAL_ERROR;
};
class ApiError extends Error {
    constructor(message, statusCode = type_1.HttpStatus.INTERNAL_SERVER_ERROR, code = type_1.ErrorCode.INTERNAL_ERROR, details) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}
exports.ApiError = ApiError;
const errorHandler = (error, req, res) => {
    const statusCode = error.statusCode || type_1.HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal Server Error";
    const code = getErrorCode(error.code);
    console.error("Error:", {
        message: error.message,
        stack: error.stack,
        statusCode,
        path: req.path,
        method: req.method,
    });
    const errorResponse = {
        code,
        message,
        details: error.details,
        timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json({
        error: errorResponse,
    });
};
exports.errorHandler = errorHandler;
