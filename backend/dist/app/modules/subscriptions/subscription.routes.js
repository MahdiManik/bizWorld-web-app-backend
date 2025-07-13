"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("./subscription.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
// Admin-only routes: Create, edit, and delete subscription plans
router.post("/", (0, auth_1.adminAuth)(), subscription_controller_1.SubscriptionController.createSubscription);
router.patch("/edit-subscription/:id", (0, auth_1.adminAuth)(), subscription_controller_1.SubscriptionController.updateSubscription);
router.delete("/:id", (0, auth_1.adminAuth)(), subscription_controller_1.SubscriptionController.deleteSubscription);
// Public routes: Get subscription plans
router.get("/", subscription_controller_1.SubscriptionController.getAllSubscription);
router.get("/:id", subscription_controller_1.SubscriptionController.getPlanById);
exports.SubscriptionRoutes = router;
