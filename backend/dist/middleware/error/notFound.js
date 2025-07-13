"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (req, res) => {
    res.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: `Route ${req.originalUrl} not found`,
            timestamp: new Date().toISOString(),
        },
    });
};
exports.notFound = notFound;
