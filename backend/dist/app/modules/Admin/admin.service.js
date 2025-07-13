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
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const { Unauthorized } = http_errors_1.default;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailService_1 = require("../../utils/emailService");
const prisma = new client_1.PrismaClient();
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // First, just get the ID and password to verify credentials
    const credentials = yield prisma.admin.findUnique({
        where: { email },
        select: {
            id: true,
            password: true,
        },
    });
    if (!credentials) {
        throw new Unauthorized("Invalid credentials");
    }
    const isValid = yield bcrypt_1.default.compare(password, credentials.password);
    if (!isValid) {
        throw new Unauthorized("Invalid credentials");
    }
    // If we get here, credentials are valid, now get the full admin data
    const admin = yield prisma.admin.findUnique({
        where: { id: credentials.id },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        },
    });
    if (!admin) {
        throw new Error("Admin data not found");
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
    }
    // Create JWT payload with proper typing
    const payload = {
        sub: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        type: "admin",
    };
    // Generate JWT token with simplified options
    const token = jsonwebtoken_1.default.sign(payload, jwtSecret, {
        expiresIn: "8h", // Default to 8 hours
        algorithm: "HS256",
    });
    // Prepare user data to return (without sensitive fields)
    const userData = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
    };
    return {
        token,
        user: userData,
    };
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma.admin.findUnique({
        where: { email },
        select: { id: true, name: true, email: true },
    });
    if (!admin) {
        // Don't reveal that the email doesn't exist
        console.log(`Password reset requested for non-existent admin: ${email}`);
        return {
            message: "If an account exists, you'll receive an email with instructions",
        };
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    yield prisma.$transaction([
        // Delete any existing tokens
        prisma.passwordReset.deleteMany({ where: { email } }),
        // Create new token
        prisma.passwordReset.create({
            data: { email, otp, expiresAt },
        }),
    ]);
    yield (0, emailService_1.sendOTPEmail)({
        to: email,
        subject: "Admin Password Reset OTP",
        otp,
        context: "adminReset",
    });
    return {
        message: "If an account exists, you'll receive an email with instructions",
    };
});
// Rest of the code remains the same...
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield prisma.passwordReset.findFirst({
        where: {
            email,
            otp,
            expiresAt: { gte: new Date() },
        },
    });
    if (!record)
        throw new Unauthorized("Invalid or expired OTP");
    return { verified: true };
});
const resetPassword = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const admin = yield prisma.admin.findUnique({
        where: { email },
    });
    if (!admin)
        throw new Unauthorized("Account not found");
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 12);
    yield prisma.admin.update({
        where: { email },
        data: { password: hashedPassword },
    });
    yield prisma.passwordReset.deleteMany({ where: { email } });
    return { message: "Password reset successfully" };
});
const createAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if admin already exists
    const existingAdmin = yield prisma.admin.findFirst({
        where: {
            email: {
                equals: data.email.toLowerCase(),
                mode: "insensitive",
            },
        },
    });
    if (existingAdmin) {
        throw new Error("Admin with this email already exists");
    }
    // Check if the email is used by a regular user
    const existingUser = yield prisma.user.findFirst({
        where: {
            email: {
                equals: data.email.toLowerCase(),
                mode: "insensitive",
            },
        },
    });
    if (existingUser) {
        throw new Error("This email is already registered as a regular user");
    }
    // Hash password
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 12);
    // Create the admin
    const admin = yield prisma.admin.create({
        data: {
            name: data.name,
            email: data.email.toLowerCase(),
            password: hashedPassword,
            phone: data.phone || null,
            image: data.image || null,
            role: "ADMIN",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    return admin;
});
const getAllAdmins = () => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield prisma.admin.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            country: true,
            address: true,
            location: true,
            company: true,
            website: true,
            bio: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return admins;
});
const getAdminById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma.admin.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            country: true,
            address: true,
            location: true,
            company: true,
            website: true,
            bio: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!admin) {
        throw new Error("Admin not found");
    }
    return admin;
});
const updateAdminById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if admin exists
    const adminExists = yield prisma.admin.findUnique({
        where: { id },
    });
    if (!adminExists) {
        throw new Error("Admin not found");
    }
    // If updating email, check if new email is already taken
    if (data.email && data.email !== adminExists.email) {
        const emailExists = yield prisma.admin.findFirst({
            where: {
                email: {
                    equals: data.email.toLowerCase(),
                    mode: "insensitive",
                },
                id: { not: id }, // Exclude current admin
            },
        });
        if (emailExists) {
            throw new Error("Email is already in use");
        }
    }
    // Prepare update data
    const updateData = Object.assign({}, data);
    // Handle firstName and lastName fields
    if (updateData.firstName || updateData.lastName) {
        // Combine firstName and lastName into name
        updateData.name = `${updateData.firstName || ""}${updateData.lastName ? " " + updateData.lastName : ""}`.trim();
        // Remove firstName and lastName as they don't exist in the schema
        delete updateData.firstName;
        delete updateData.lastName;
    }
    // Hash password if it's being updated
    if (updateData.password) {
        updateData.password = yield bcrypt_1.default.hash(updateData.password, 12);
    }
    // Update admin
    const updatedAdmin = yield prisma.admin.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true,
            bio: true,
            address: true,
            location: true,
            company: true,
            website: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedAdmin;
});
const deleteAdminById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if admin exists
    const adminExists = yield prisma.admin.findUnique({
        where: { id },
    });
    if (!adminExists) {
        throw new Error("Admin not found");
    }
    // Prevent deletion of super admin
    if (adminExists.role === "SUPER_ADMIN") {
        throw new Error("Cannot delete a super admin");
    }
    // Delete admin
    yield prisma.admin.delete({
        where: { id },
    });
    return { message: "Admin deleted successfully" };
});
const changePassword = (id, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma.admin.findUnique({
        where: { id },
    });
    if (!admin) {
        throw new Error("Admin not found");
    }
    // Verify current password
    const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
    }
    // Hash and update the new password
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 12);
    yield prisma.admin.update({
        where: { id },
        data: { password: hashedPassword },
    });
    return { message: "Password changed successfully" };
});
const getUserStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get total user count
        const totalUsers = yield prisma.user.count();
        // Get user count from 8 days ago for percentage calculation
        const eightDaysAgo = new Date();
        eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
        const usersEightDaysAgo = yield prisma.user.count({
            where: {
                createdAt: {
                    lt: eightDaysAgo
                }
            }
        });
        // Calculate percentage change
        const percentageChange = usersEightDaysAgo > 0
            ? ((totalUsers - usersEightDaysAgo) / usersEightDaysAgo) * 100
            : 0;
        // Get daily new users for the last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            const dailyNewUsers = yield prisma.user.count({
                where: {
                    createdAt: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
            });
            last7Days.push({
                day: startOfDay.toISOString().split('T')[0],
                users: dailyNewUsers
            });
        }
        return {
            totalUsers,
            percentageChange: parseFloat(percentageChange.toFixed(2)),
            last7DaysNewUsers: last7Days
        };
    }
    catch (error) {
        console.error('Error getting user statistics:', error);
        throw new Error('Failed to retrieve user statistics');
    }
});
exports.AdminService = {
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdminById,
    deleteAdminById,
    changePassword,
    getUserStatistics,
};
