"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
// TODO: Import auth middleware for admin routes protection
// import { authenticateAdmin } from "../../../middleware/auth";
const router = (0, express_1.Router)();
// Public routes (no auth required)
router.post("/login", admin_controller_1.AdminController.login);
router.post("/forgot-password", admin_controller_1.AdminController.forgotPassword);
router.post("/verify-otp", admin_controller_1.AdminController.verifyOTP);
router.post("/reset-password", admin_controller_1.AdminController.resetPassword);
router.get("/user-statistics", admin_controller_1.AdminController.getUserStatistics);
// Protected routes (require admin authentication)
// These should be protected with middleware in production
// For testing purposes, they're accessible without auth
router.post("/create", admin_controller_1.AdminController.createAdmin);
router.get("/", admin_controller_1.AdminController.getAllAdmins);
router.get("/me/:id", admin_controller_1.AdminController.getAdminById);
router.patch("/me/:id", admin_controller_1.AdminController.updateAdminById);
router.delete("/:id", admin_controller_1.AdminController.deleteAdminById);
router.put("/change-password/:id", admin_controller_1.AdminController.changePassword);
exports.adminRoutes = router;
