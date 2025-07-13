"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../../middleware/error/errorHandler");
const config_1 = __importDefault(require("../../config"));
const prisma = new client_1.PrismaClient();
// Auth middleware that verifies JWT token
const auth = (requiredRoles = []) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new errorHandler_1.ApiError('Unauthorized: No token provided', http_status_1.default.UNAUTHORIZED);
            }
            // Extract token
            const token = authHeader.split(' ')[1];
            if (!token) {
                throw new errorHandler_1.ApiError('Unauthorized: Invalid token format', http_status_1.default.UNAUTHORIZED);
            }
            try {
                // Verify token
                const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
                // Debug token contents
                console.log('JWT token decoded:', decoded);
                // Ensure we have a userId - check different possible formats
                const userId = decoded.userId || decoded.id || decoded.sub;
                if (!userId) {
                    console.error('No userId found in token:', decoded);
                    throw new errorHandler_1.ApiError('Unauthorized: Invalid token format (missing userId)', http_status_1.default.UNAUTHORIZED);
                }
                // Check if user exists
                const user = yield prisma.user.findUnique({
                    where: { id: userId },
                });
                console.log('Found user:', user ? 'Yes' : 'No');
                if (!user) {
                    throw new errorHandler_1.ApiError('Unauthorized: User not found', http_status_1.default.UNAUTHORIZED);
                }
                // Check if user has required role (if specified)
                if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
                    throw new errorHandler_1.ApiError('Forbidden: Insufficient privileges', http_status_1.default.FORBIDDEN);
                }
                // Set user info in request object
                req.user = {
                    userId: decoded.userId,
                    role: decoded.role,
                    email: user.email,
                };
                next();
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    throw new errorHandler_1.ApiError('Unauthorized: Invalid token', http_status_1.default.UNAUTHORIZED);
                }
                else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    throw new errorHandler_1.ApiError('Unauthorized: Token expired', http_status_1.default.UNAUTHORIZED);
                }
                else {
                    throw error;
                }
            }
        }
        catch (error) {
            next(error);
        }
    });
};
// Admin auth middleware that verifies JWT token for admin operations
const adminAuth = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new errorHandler_1.ApiError('Unauthorized: No token provided', http_status_1.default.UNAUTHORIZED);
            }
            // Extract token
            const token = authHeader.split(' ')[1];
            if (!token) {
                throw new errorHandler_1.ApiError('Unauthorized: Invalid token format', http_status_1.default.UNAUTHORIZED);
            }
            try {
                // Verify token
                const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
                // Debug token contents
                console.log('Admin JWT token decoded:', decoded);
                // Ensure we have an adminId - check different possible formats
                const adminId = decoded.adminId || decoded.id || decoded.sub;
                if (!adminId) {
                    console.error('No adminId found in token:', decoded);
                    throw new errorHandler_1.ApiError('Unauthorized: Invalid admin token format (missing adminId)', http_status_1.default.UNAUTHORIZED);
                }
                // Check if admin exists
                const admin = yield prisma.admin.findUnique({
                    where: { id: adminId },
                });
                console.log('Found admin:', admin ? 'Yes' : 'No');
                if (!admin) {
                    throw new errorHandler_1.ApiError('Unauthorized: Admin not found', http_status_1.default.UNAUTHORIZED);
                }
                // Check if the role is ADMIN
                if (admin.role !== 'ADMIN') {
                    throw new errorHandler_1.ApiError('Forbidden: Admin privileges required', http_status_1.default.FORBIDDEN);
                }
                // Set admin info in request object
                req.admin = {
                    adminId: admin.id,
                    role: admin.role,
                    email: admin.email,
                };
                next();
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    throw new errorHandler_1.ApiError('Unauthorized: Invalid admin token', http_status_1.default.UNAUTHORIZED);
                }
                else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    throw new errorHandler_1.ApiError('Unauthorized: Admin token expired', http_status_1.default.UNAUTHORIZED);
                }
                else {
                    throw error;
                }
            }
        }
        catch (error) {
            next(error);
        }
    });
};
exports.adminAuth = adminAuth;
exports.default = auth;
