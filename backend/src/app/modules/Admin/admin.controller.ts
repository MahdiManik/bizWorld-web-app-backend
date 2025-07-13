import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AdminService.login(email, password);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AdminService.forgotPassword(email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await AdminService.verifyOTP(email, otp);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified",
    data: result,
  });
};

const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  const result = await AdminService.resetPassword(email, newPassword);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
};

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  // Extract admin data from request body
  const { name, email, password, phone, image } = req.body;
  
  // Optional: extract creator ID from authenticated admin
  // const creatorId = req.user?.id;
  
  const result = await AdminService.createAdmin({
    name, 
    email, 
    password,
    phone,
    image
  });
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdmins();
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admins retrieved successfully",
    data: result,
  });
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.getAdminById(id);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
});

const updateAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const result = await AdminService.updateAdminById(id, updateData);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

const deleteAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.deleteAdminById(id);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }
  
  const result = await AdminService.changePassword(id, currentPassword, newPassword);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

const getUserStatistics = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getUserStatistics();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User statistics retrieved successfully",
    data: result,
  });
});

export const AdminController = {
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  changePassword,
  getUserStatistics,
};
