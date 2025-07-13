import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

// User management routes
router.post("/assign-role", UserController.assignRoleToUser);
router.post("/create", UserController.adminCreateUser); // Admin route to create users
router.post("/change-password", UserController.changePassword); // Change password route
router.get("/", UserController.getAllUsers);

// User operations by ID
router.get("/:id", UserController.getUserById);
router.patch("/:id", UserController.updateUser);
router.delete("/:id", UserController.softDeleteUser);

// User status management (admin operation)
router.patch("/:userId/status", UserController.updateUserStatus);

export const userRoutes = router;
