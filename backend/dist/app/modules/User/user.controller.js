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
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const user_service_1 = require("./user.service");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const emailService_1 = require("../../utils/emailService");
const errorHandler_1 = require("../../../middleware/error/errorHandler");
const type_1 = require("../../../shared-types/type");
const enum_type_1 = require("../../../shared-types/enum-type");
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();
const register = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = req.body;
    // First check if email belongs to an admin
    const existingAdmin = yield prisma_1.default.admin.findFirst({
        where: {
            email: {
                equals: email.toLowerCase(),
                mode: "insensitive",
            },
        },
    });
    if (existingAdmin) {
        throw new errorHandler_1.ApiError("This email belongs to an admin account. Admins must log in through the admin portal and cannot be registered as regular users.", http_status_1.default.CONFLICT, type_1.ErrorCode.CONFLICT);
    }
    // Then check if email already exists in users table (case insensitive)
    // Exclude deleted users to allow re-registration with previously deleted emails
    const existingUser = yield prisma_1.default.user.findFirst({
        where: {
            email: {
                equals: email.toLowerCase(),
                mode: "insensitive",
            },
            isDeleted: false, // Only consider active (non-deleted) users
        },
    });
    if (existingUser) {
        throw new errorHandler_1.ApiError("User with this email already exists", http_status_1.default.CONFLICT, type_1.ErrorCode.CONFLICT);
    }
    const otp = generateOTP();
    // Store in TempUser table using raw query with proper type casting
    yield prisma_1.default.$executeRaw `
    INSERT INTO temp_users (id, name, email, phone, password, roles, status, "createdAt", "updatedAt")
    VALUES (
      gen_random_uuid(),
      ${req.body.name},
      ${email},
      ${((_a = req.body.phone) === null || _a === void 0 ? void 0 : _a.toString()) || null},
      ${req.body.password},
      ARRAY[${enum_type_1.UserRole.BUSINESS_OWNER}]::"UserRole"[],
      'PENDING',
      NOW(),
      NOW()
    )
    ON CONFLICT (email) 
    DO UPDATE SET 
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      password = EXCLUDED.password,
      roles = EXCLUDED.roles,
      status = EXCLUDED.status,
      "updatedAt" = NOW()
  `;
    yield prisma_1.default.passwordReset.create({
        data: {
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
    });
    yield (0, emailService_1.sendOTPEmail)({
        to: email,
        subject: "Verify your email address",
        otp,
        context: "signup",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "OTP sent to your email. Please verify to complete signup.",
        data: null,
    });
}));
const verifyOtpController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new errorHandler_1.ApiError("Email and OTP are required", http_status_1.default.BAD_REQUEST);
    }
    const result = yield user_service_1.UserService.verifyOtpAndRegister(email, otp);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "OTP verified and user registered successfully. Please proceed with onboarding.",
        data: result,
    });
}));
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.login(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Login successful!",
        data: result,
    });
}));
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Debug logging
    console.log("Headers:", req.headers);
    console.log("Content-Type:", req.headers["content-type"]);
    // Handle different content types
    let email;
    if (!req.body || Object.keys(req.body).length === 0) {
        // Try to parse the request manually if content-type is text/plain
        if (req.headers["content-type"] === "text/plain") {
            try {
                let data = "";
                req.on("data", (chunk) => {
                    data += chunk;
                });
                // Wait for the request body to be fully received
                yield new Promise((resolve) => {
                    req.on("end", () => {
                        try {
                            const parsedBody = JSON.parse(data);
                            console.log("Manually parsed body:", parsedBody);
                            email = parsedBody.email;
                            resolve();
                        }
                        catch (e) {
                            console.error("Failed to parse JSON from text/plain body", e);
                            resolve();
                        }
                    });
                });
            }
            catch (e) {
                console.error("Error handling raw body:", e);
            }
        }
    }
    else {
        // Normal JSON body parsing worked
        email = req.body.email;
    }
    console.log("Extracted email:", email);
    // If we have an email, proceed with the service call
    if (email) {
        // Create a modified request with body for the service
        const modifiedReq = Object.assign({}, req, { body: { email } });
        const result = yield user_service_1.UserService.forgotPassword(modifiedReq);
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "OTP sent to your email!",
            data: result,
        });
    }
    // No email found in any parsing attempt
    return (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.BAD_REQUEST,
        success: false,
        message: "Email is required",
        data: null, // Add required data property
    });
}));
const verifyOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.verifyOTP(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "OTP verified successfully!",
        data: result,
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.resetPassword(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password reset successful!",
        data: result,
    });
}));
const assignRoleToUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.assignRoleToUser(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Role assigned to user successfully!",
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log request information
        console.log(`GET /users request at ${new Date().toISOString()}`);
        // Get users directly from service - this will add debugging logs
        const users = yield user_service_1.UserService.getAllUsers();
        // Format user data for response to remove sensitive fields
        const safeUsers = users.map((user) => {
            var _a;
            return ({
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                roles: ((_a = user.roles) === null || _a === void 0 ? void 0 : _a.map((r) => r.role)) || [],
                profile: user.profile,
                company: user.company,
            });
        });
        // Check if users array is empty
        if (!safeUsers || safeUsers.length === 0) {
            console.log("No users found - returning empty array response");
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "No users found in the system",
                data: [],
            });
            return;
        }
        // Return users array for successful case
        console.log(`Returning ${safeUsers.length} users in response`);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Users retrieved successfully",
            data: safeUsers,
        });
    }
    catch (error) {
        console.error("Error in getAllUsers controller:", error);
        // Let the error handler deal with this
        throw error;
    }
}));
const getUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield user_service_1.UserService.getUserById(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User retrieved successfully",
        data: user,
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.updateUser(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User updated successfully!",
        data: result,
    });
}));
const softDeleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.deleteUser(req);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User soft deleted",
        data: result,
    });
}));
const updateUserStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { status } = req.body;
    const result = yield user_service_1.UserService.updateUserStatus(userId, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User status updated successfully to ${status}`,
        data: result,
    });
}));
const adminCreateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.adminCreateUser(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User created successfully with temporary password sent via email",
        data: result,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Change password request:", req.body);
    // Use the format from the screenshot with id, email, and password fields
    const { id, email, password, newPassword } = req.body;
    if (!id && !email) {
        throw new errorHandler_1.ApiError("User ID or email is required", http_status_1.default.BAD_REQUEST);
    }
    // If newPassword is provided, use it; otherwise consider password as the new password
    // (Frontend may be sending just the new password in the "password" field)
    const newPasswordToUse = newPassword || password;
    if (!newPasswordToUse) {
        throw new errorHandler_1.ApiError("New password is required", http_status_1.default.BAD_REQUEST);
    }
    // For now, we'll skip the current password verification since the screenshot shows
    // a simple change password flow without current password verification
    const result = yield user_service_1.UserService.updateUserPassword(id || null, email || null, newPasswordToUse);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password changed successfully",
        data: result,
    });
}));
const resetDeletedUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.resetDeletedUsers();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deleted users reset successfully",
        data: result,
    });
}));
const cleanupTempUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.cleanupTempUsers();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Temporary users cleaned up successfully",
        data: result,
    });
}));
exports.UserController = {
    register,
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
    changePassword,
    assignRoleToUser,
    getAllUsers,
    getUserById,
    updateUser,
    updateUserStatus,
    adminCreateUser,
    verifyOtpController,
    softDeleteUser,
    resetDeletedUsers,
    cleanupTempUsers,
};
