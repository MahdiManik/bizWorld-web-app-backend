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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSubscription = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // Accept both camelCase and snake_case for flexibility
    const { planType, plan_type, userId, user_id, price, period, description, features } = req.body;
    // Verify admin is making this request
    if (!req.admin) {
        throw new Error('Admin authentication required for subscription creation');
    }
    // Use planType or plan_type (whichever is provided)
    const finalPlanType = planType || plan_type;
    const finalUserId = userId || user_id;
    // Validate required fields
    if (!finalPlanType) {
        throw new Error('Plan type is required');
    }
    // If userId is provided, create user-specific subscription
    // If not provided, create a general subscription plan template
    const subscriptionData = {
        planType: finalPlanType,
        price,
        period,
        description,
        features: features || [],
    };
    // Only add userId if it's provided (for user-specific subscriptions)
    if (finalUserId) {
        subscriptionData.userId = finalUserId;
    }
    const newSubscription = yield prisma.subscription.create({
        data: subscriptionData,
    });
    // Return subscription with additional context
    return Object.assign(Object.assign({}, newSubscription), { isTemplate: !finalUserId });
});
const updateSubscription = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { planType, plan_type, userId, user_id, price, period, description, features } = req.body;
    // Verify admin is making this request
    if (!req.admin) {
        throw new Error('Admin authentication required for subscription plan updates');
    }
    // Check if subscription exists
    const existingSubscription = yield prisma.subscription.findUnique({
        where: { id },
    });
    if (!existingSubscription) {
        throw new Error('Subscription plan not found');
    }
    // Prepare update data - only include fields that are provided
    const updateData = {};
    if (planType || plan_type) {
        updateData.planType = planType || plan_type;
    }
    if (price !== undefined) {
        updateData.price = price;
    }
    if (period !== undefined) {
        updateData.period = period;
    }
    if (description !== undefined) {
        updateData.description = description;
    }
    if (features !== undefined) {
        updateData.features = features;
    }
    // Handle userId update (can assign/unassign users to/from plans)
    const finalUserId = userId || user_id;
    if (finalUserId !== undefined) {
        updateData.userId = finalUserId;
    }
    const updatedSubscription = yield prisma.subscription.update({
        where: { id },
        data: updateData,
    });
    // Return subscription with additional context
    return Object.assign(Object.assign({}, updatedSubscription), { isTemplate: !updatedSubscription.userId });
});
const deleteSubscription = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Verify admin is making this request
    if (!req.admin) {
        throw new Error('Admin authentication required for subscription plan deletion');
    }
    // Check if subscription exists
    const existingSubscription = yield prisma.subscription.findUnique({
        where: { id },
    });
    if (!existingSubscription) {
        throw new Error('Subscription plan not found');
    }
    const deletedSubscription = yield prisma.subscription.delete({
        where: { id },
    });
    return deletedSubscription;
});
const getAllSubscription = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptions = yield prisma.subscription.findMany();
    return subscriptions;
});
const getPlanById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const subscription = yield prisma.subscription.findUnique({
        where: { id },
    });
    return subscription;
});
exports.SubscriptionService = {
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getAllSubscription,
    getPlanById,
};
