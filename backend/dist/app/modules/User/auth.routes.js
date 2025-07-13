"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
// Authentication routes - keep these first
router.post("/register", user_controller_1.UserController.register);
router.post("/login", user_controller_1.UserController.login);
router.post("/verify-otp-register", user_controller_1.UserController.verifyOtpController);
router.post("/forgot-password", user_controller_1.UserController.forgotPassword);
router.post("/verify-otp-code", user_controller_1.UserController.verifyOTP);
router.post("/reset-password", user_controller_1.UserController.resetPassword);
exports.authRoutes = router;
