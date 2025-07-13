import { PrismaClient } from "@prisma/client";
import { Request } from "express";

const prisma = new PrismaClient();

const createSubscription = async (req: Request) => {
  // Accept both camelCase and snake_case for flexibility
  const {
    planType,
    plan_type,
    userId,
    user_id,
    price,
    period,
    description,
    features
  } = req.body;

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
  const subscriptionData: any = {
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

  const newSubscription = await prisma.subscription.create({
    data: subscriptionData,
  });

  // Return subscription with additional context
  return {
    ...newSubscription,
    isTemplate: !finalUserId, // Indicates if this is a general plan template or user-specific
  };
};

const updateSubscription = async (req: Request) => {
  const { id } = req.params;
  const {
    planType,
    plan_type,
    userId,
    user_id,
    price,
    period,
    description,
    features
  } = req.body;

  // Verify admin is making this request
  if (!req.admin) {
    throw new Error('Admin authentication required for subscription plan updates');
  }

  // Check if subscription exists
  const existingSubscription = await prisma.subscription.findUnique({
    where: { id },
  });

  if (!existingSubscription) {
    throw new Error('Subscription plan not found');
  }

  // Prepare update data - only include fields that are provided
  const updateData: any = {};

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

  const updatedSubscription = await prisma.subscription.update({
    where: { id },
    data: updateData,
  });

  // Return subscription with additional context
  return {
    ...updatedSubscription,
    isTemplate: !updatedSubscription.userId, // Indicates if this is a general plan template or user-specific
  };
};

const deleteSubscription = async (req: Request) => {
  const { id } = req.params;

  // Verify admin is making this request
  if (!req.admin) {
    throw new Error('Admin authentication required for subscription plan deletion');
  }

  // Check if subscription exists
  const existingSubscription = await prisma.subscription.findUnique({
    where: { id },
  });

  if (!existingSubscription) {
    throw new Error('Subscription plan not found');
  }

  const deletedSubscription = await prisma.subscription.delete({
    where: { id },
  });

  return deletedSubscription;
};

const getAllSubscription = async (req: Request) => {
  const subscriptions = await prisma.subscription.findMany();
  return subscriptions;
};

const getPlanById = async (req: Request) => {
  const { id } = req.params;

  const subscription = await prisma.subscription.findUnique({
    where: { id },
  });

  return subscription;
};


export const SubscriptionService = {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getAllSubscription,
  getPlanById,
};
