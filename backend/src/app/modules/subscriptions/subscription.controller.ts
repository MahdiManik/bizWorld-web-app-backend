import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SubscriptionService } from "./subscription.service";

const createSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.createSubscription(req);

  // Determine message based on whether it's a template or user-specific subscription
  const message = result.isTemplate
    ? "Subscription plan template created successfully! This plan can now be assigned to users."
    : "User-specific subscription created successfully!";

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message,
    data: result,
  });
});

const updateSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.updateSubscription(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription plan updated successfully!",
    data: result,
  });
});

const deleteSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.deleteSubscription(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription plan deleted successfully!",
    data: result,
  });
});

const getAllSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getAllSubscription(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All subscription plans retrieved successfully!",
    data: result,
  });
});

const getPlanById = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getPlanById(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription plan retrieved successfully!",
    data: result,
  });
});

export const SubscriptionController = {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getAllSubscription,
  getPlanById,
};
