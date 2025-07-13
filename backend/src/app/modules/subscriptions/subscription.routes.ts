import express from "express";
import { SubscriptionController } from "./subscription.controller";
import { adminAuth } from "../../middlewares/auth";

const router = express.Router();

// Admin-only routes: Create, edit, and delete subscription plans
router.post("/", adminAuth(), SubscriptionController.createSubscription);
router.patch(
  "/edit-subscription/:id",
  adminAuth(),
  SubscriptionController.updateSubscription
);
router.delete("/:id", adminAuth(), SubscriptionController.deleteSubscription);

// Public routes: Get subscription plans
router.get("/", SubscriptionController.getAllSubscription);
router.get("/:id", SubscriptionController.getPlanById);

export const SubscriptionRoutes = router;
