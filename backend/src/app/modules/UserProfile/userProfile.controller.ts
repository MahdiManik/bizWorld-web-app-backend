import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserProfileService } from "./userProfile.service";

const createUserProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserProfileService.createUserProfile(req);
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User profile created successfully",
    data: result,
  });
});

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await UserProfileService.getUserProfile(userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserProfileService.updateUserProfile(req);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

const addDocumentToProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserProfileService.addDocumentToProfile(req);
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Document added to profile successfully",
    data: result,
  });
});

const getAllUserProfiles = catchAsync(async (req: Request, res: Response) => {
  const result = await UserProfileService.getAllUserProfiles();
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profiles retrieved successfully",
    data: result,
  });
});

const deleteUserProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await UserProfileService.deleteUserProfile(userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile deleted successfully",
    data: result,
  });
});

const deleteDocument = catchAsync(async (req: Request, res: Response) => {
  const documentId = req.params.documentId;
  const result = await UserProfileService.deleteDocument(documentId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Document deleted successfully",
    data: result,
  });
});

const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
  const result = await UserProfileService.uploadProfileImage(req);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile image uploaded successfully",
    data: result,
  });
});

export const UserProfileController = {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  addDocumentToProfile,
  getAllUserProfiles,
  deleteUserProfile,
  deleteDocument,
  uploadProfileImage,
};
