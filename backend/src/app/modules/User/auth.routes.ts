import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

// Authentication routes - keep these first
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/verify-otp-register", UserController.verifyOtpController);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/verify-otp-code", UserController.verifyOTP);
router.post("/reset-password", UserController.resetPassword);

export const authRoutes = router;
