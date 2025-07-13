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
exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = yield admin_service_1.AdminService.login(email, password);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: result,
    });
}));
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield admin_service_1.AdminService.forgotPassword(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
}));
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const result = yield admin_service_1.AdminService.verifyOTP(email, otp);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "OTP verified",
        data: result,
    });
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    const result = yield admin_service_1.AdminService.resetPassword(email, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
});
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract admin data from request body
    const { name, email, password, phone, image } = req.body;
    // Optional: extract creator ID from authenticated admin
    // const creatorId = req.user?.id;
    const result = yield admin_service_1.AdminService.createAdmin({
        name,
        email,
        password,
        phone,
        image
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Admin created successfully",
        data: result,
    });
}));
const getAllAdmins = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getAllAdmins();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admins retrieved successfully",
        data: result,
    });
}));
const getAdminById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminService.getAdminById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admin retrieved successfully",
        data: result,
    });
}));
const updateAdminById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    const result = yield admin_service_1.AdminService.updateAdminById(id, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admin updated successfully",
        data: result,
    });
}));
const deleteAdminById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminService.deleteAdminById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        throw new Error("Current password and new password are required");
    }
    const result = yield admin_service_1.AdminService.changePassword(id, currentPassword, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
}));
const getUserStatistics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getUserStatistics();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User statistics retrieved successfully",
        data: result,
    });
}));
exports.AdminController = {
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
