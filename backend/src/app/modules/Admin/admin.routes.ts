import { Router } from "express";
import { AdminController } from "./admin.controller";
// TODO: Import auth middleware for admin routes protection
// import { authenticateAdmin } from "../../../middleware/auth";

const router = Router();

// Public routes (no auth required)
router.post("/login", AdminController.login);
router.post("/forgot-password", AdminController.forgotPassword);
router.post("/verify-otp", AdminController.verifyOTP);
router.post("/reset-password", AdminController.resetPassword);
router.get("/user-statistics", AdminController.getUserStatistics);

// Protected routes (require admin authentication)
// These should be protected with middleware in production
// For testing purposes, they're accessible without auth
router.post("/create", AdminController.createAdmin);
router.get("/", AdminController.getAllAdmins);
router.get("/me/:id", AdminController.getAdminById);
router.patch("/me/:id", AdminController.updateAdminById);
router.delete("/:id", AdminController.deleteAdminById);
router.put("/change-password/:id", AdminController.changePassword);

export const adminRoutes = router;
