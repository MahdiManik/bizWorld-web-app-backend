"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
// User management routes
router.post("/assign-role", user_controller_1.UserController.assignRoleToUser);
router.post("/create", user_controller_1.UserController.adminCreateUser); // Admin route to create users
router.post("/change-password", user_controller_1.UserController.changePassword); // Change password route
router.get("/", user_controller_1.UserController.getAllUsers);
// User operations by ID
router.get("/:id", user_controller_1.UserController.getUserById);
router.patch("/:id", user_controller_1.UserController.updateUser);
router.delete("/:id", user_controller_1.UserController.softDeleteUser);
// User status management (admin operation)
router.patch("/:userId/status", user_controller_1.UserController.updateUserStatus);
exports.userRoutes = router;
