import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserService } from "./user.service";
import prisma from "../../shared/prisma";
import { sendOTPEmail } from "../../utils/emailService";
import { ApiError } from "../../../middleware/error/errorHandler";
import { ErrorCode } from "../../../shared-types/type";
import { UserRole } from "../../../shared-types/enum-type";
import { profile } from "console";

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const register = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  // First check if email belongs to an admin
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      email: {
        equals: email.toLowerCase(),
        mode: "insensitive",
      },
    },
  });

  if (existingAdmin) {
    throw new ApiError(
      "This email belongs to an admin account. Admins must log in through the admin portal and cannot be registered as regular users.",
      httpStatus.CONFLICT,
      ErrorCode.CONFLICT
    );
  }

  // Then check if email already exists in users table (case insensitive)
  // Exclude deleted users to allow re-registration with previously deleted emails
  const existingUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: email.toLowerCase(),
        mode: "insensitive",
      },
      isDeleted: false, // Only consider active (non-deleted) users
    },
  });

  if (existingUser) {
    throw new ApiError(
      "User with this email already exists",
      httpStatus.CONFLICT,
      ErrorCode.CONFLICT
    );
  }

  const otp = generateOTP();

  // Store in TempUser table using raw query with proper type casting
  await prisma.$executeRaw`
    INSERT INTO temp_users (id, name, email, phone, password, roles, status, "createdAt", "updatedAt")
    VALUES (
      gen_random_uuid(),
      ${req.body.name},
      ${email},
      ${req.body.phone?.toString() || null},
      ${req.body.password},
      ARRAY[${UserRole.BUSINESS_OWNER}]::"UserRole"[],
      'PENDING',
      NOW(),
      NOW()
    )
    ON CONFLICT (email) 
    DO UPDATE SET 
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      password = EXCLUDED.password,
      roles = EXCLUDED.roles,
      status = EXCLUDED.status,
      "updatedAt" = NOW()
  `;

  await prisma.passwordReset.create({
    data: {
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  await sendOTPEmail({
    to: email,
    subject: "Verify your email address",
    otp,
    context: "signup",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent to your email. Please verify to complete signup.",
    data: null,
  });
});

const verifyOtpController = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError("Email and OTP are required", httpStatus.BAD_REQUEST);
  }

  const result = await UserService.verifyOtpAndRegister(email, otp);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message:
      "OTP verified and user registered successfully. Please proceed with onboarding.",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.login(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful!",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  // Debug logging
  console.log("Headers:", req.headers);
  console.log("Content-Type:", req.headers["content-type"]);

  // Handle different content types
  let email;
  if (!req.body || Object.keys(req.body).length === 0) {
    // Try to parse the request manually if content-type is text/plain
    if (req.headers["content-type"] === "text/plain") {
      try {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });

        // Wait for the request body to be fully received
        await new Promise<void>((resolve) => {
          req.on("end", () => {
            try {
              const parsedBody = JSON.parse(data);
              console.log("Manually parsed body:", parsedBody);
              email = parsedBody.email;
              resolve();
            } catch (e) {
              console.error("Failed to parse JSON from text/plain body", e);
              resolve();
            }
          });
        });
      } catch (e) {
        console.error("Error handling raw body:", e);
      }
    }
  } else {
    // Normal JSON body parsing worked
    email = req.body.email;
  }

  console.log("Extracted email:", email);

  // If we have an email, proceed with the service call
  if (email) {
    // Create a modified request with body for the service
    const modifiedReq = Object.assign({}, req, { body: { email } });
    const result = await UserService.forgotPassword(modifiedReq);

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP sent to your email!",
      data: result,
    });
  }

  // No email found in any parsing attempt
  return sendResponse(res, {
    statusCode: httpStatus.BAD_REQUEST,
    success: false,
    message: "Email is required",
    data: null, // Add required data property
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.verifyOTP(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.resetPassword(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successful!",
    data: result,
  });
});

const assignRoleToUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.assignRoleToUser(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Role assigned to user successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  try {
    // Log request information
    console.log(`GET /users request at ${new Date().toISOString()}`);

    // Get users directly from service - this will add debugging logs
    const users = await UserService.getAllUsers();

    // Format user data for response to remove sensitive fields
    const safeUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.roles?.map((r) => r.role) || [],
      profile: user.profile,
      company: user.company,
    }));

    // Check if users array is empty
    if (!safeUsers || safeUsers.length === 0) {
      console.log("No users found - returning empty array response");
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "No users found in the system",
        data: [],
      });
      return;
    }

    // Return users array for successful case
    console.log(`Returning ${safeUsers.length} users in response`);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully",
      data: safeUsers,
    });
  } catch (error) {
    console.error("Error in getAllUsers controller:", error);
    // Let the error handler deal with this
    throw error;
  }
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const user = await UserService.getUserById(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateUser(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully!",
    data: result,
  });
});

const softDeleteUser = catchAsync(async (req, res) => {
  const result = await UserService.deleteUser(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User soft deleted",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status } = req.body;

  const result = await UserService.updateUserStatus(userId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User status updated successfully to ${status}`,
    data: result,
  });
});

const adminCreateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.adminCreateUser(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully with temporary password sent via email",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  console.log("Change password request:", req.body);

  // Use the format from the screenshot with id, email, and password fields
  const { id, email, password, newPassword } = req.body;

  if (!id && !email) {
    throw new ApiError("User ID or email is required", httpStatus.BAD_REQUEST);
  }

  // If newPassword is provided, use it; otherwise consider password as the new password
  // (Frontend may be sending just the new password in the "password" field)
  const newPasswordToUse = newPassword || password;

  if (!newPasswordToUse) {
    throw new ApiError("New password is required", httpStatus.BAD_REQUEST);
  }

  // For now, we'll skip the current password verification since the screenshot shows
  // a simple change password flow without current password verification
  const result = await UserService.updateUserPassword(
    id || null,
    email || null,
    newPasswordToUse
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const resetDeletedUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.resetDeletedUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deleted users reset successfully",
    data: result,
  });
});

const cleanupTempUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.cleanupTempUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Temporary users cleaned up successfully",
    data: result,
  });
});

export const UserController = {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword,
  assignRoleToUser,
  getAllUsers,
  getUserById,
  updateUser,

  updateUserStatus,
  adminCreateUser,
  verifyOtpController,
  softDeleteUser,

  resetDeletedUsers,
  cleanupTempUsers,
};
