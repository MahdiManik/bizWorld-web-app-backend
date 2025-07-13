/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma, PrismaClient } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { ApiError } from "../../../middleware/error/errorHandler";
import { randomInt } from "crypto";
import { sendOTPEmail } from "../../utils/emailService";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { UserRole, UserStatus } from "../../../shared-types/enum-type";
import { sendStatusNotificationEmail } from "../../utils/statusNotificationService";
import { sendWelcomeEmail } from "../../utils/emailService";

const prisma = new PrismaClient();

const register = async (req: Request) => {
  const {
    name,
    email,
    password,
    phone: phoneNumber,
    role: selectedRoles,
  } = req.body;

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
      httpStatus.CONFLICT
    );
  }

  // Check if user already exists (excluding deleted users)
  const existingUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: email.toLowerCase(),
        mode: "insensitive",
      },
      isDeleted: false, // Only check users that are not marked as deleted
    },
  });

  if (existingUser) {
    throw new ApiError(
      "User with this email already exists",
      httpStatus.CONFLICT
    );
  }

  // Also check temp users table to prevent duplicates during registration process
  const existingTempUser = await prisma.tempUser.findFirst({
    where: {
      email: {
        equals: email.toLowerCase(),
        mode: "insensitive",
      },
      isDeleted: false, // Only check temp users that are not marked as deleted
    },
  });

  if (existingTempUser) {
    // If there's an existing temp user, we'll update it instead of creating a new one
    // This is handled by the upsert below, so we don't need to throw an error here
    console.log(
      "Found existing temp user, will update instead of creating new"
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Process roles
  const rolesToAssign = processRoles(selectedRoles);

  // Generate 4-digit OTP
  const otp = randomInt(1000, 9999).toString();

  // Store user data in temp_users - this matches the controller behavior
  await prisma.tempUser.upsert({
    where: { email },
    update: {
      name,
      phone: phoneNumber,
      password: hashedPassword,
      roles: rolesToAssign,
      updatedAt: new Date(),
    },
    create: {
      name,
      email,
      phone: phoneNumber,
      password: hashedPassword,
      roles: rolesToAssign,
      status: UserStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Store OTP for verification
  await prisma.passwordReset.create({
    data: {
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  // Send OTP Email
  await sendOTPEmail({
    to: email,
    subject: "Verify your email address",
    otp,
    context: "signup",
  });

  return {
    email,
    message: "Verification OTP sent successfully",
  };
};

/**
 * Verifies OTP for registration and migrates temporary user to permanent user
 * @param email User's email address
 * @param otp OTP code to verify
 * @returns User data upon successful verification and migration
 */
const verifyOtpAndRegister = async (email: string, otp: string) => {
  console.log(`Verifying OTP for email: ${email}`);

  // First check if OTP is valid and not expired
  const otpEntry = await prisma.passwordReset.findFirst({
    where: { email, otp },
    orderBy: { expiresAt: "desc" },
  });

  if (!otpEntry) {
    console.log(`No matching OTP found for email: ${email}`);
    throw new ApiError("Invalid OTP", httpStatus.BAD_REQUEST);
  }

  if (otpEntry.expiresAt < new Date()) {
    console.log(
      `OTP expired for email: ${email}, expired at: ${otpEntry.expiresAt}`
    );
    throw new ApiError("Expired OTP", httpStatus.BAD_REQUEST);
  }

  // Get temp user with roles
  const tempUser = await prisma.tempUser.findUnique({
    where: { email },
  });

  if (!tempUser) {
    console.log(`No temp user found for email: ${email}`);
    throw new ApiError("No registration data found.", httpStatus.NOT_FOUND);
  }

  console.log(`Found temp user for email: ${email}, proceeding with migration`);

  // Check if a user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: tempUser.email.toLowerCase() },
    include: { roles: true },
  });

  if (existingUser) {
    console.log(
      `User exists with email: ${email}, checking status before deciding to migrate`
    );

    // Only skip migration if user is in ACTIVE state and not deleted
    if (existingUser.status === UserStatus.ACTIVE && !existingUser.isDeleted) {
      console.log(
        `User ${email} is ACTIVE and not deleted, no need to migrate`
      );

      // Clean up temp data since user already exists and is active
      try {
        await prisma.tempUser.delete({ where: { email } });
        await prisma.passwordReset.deleteMany({ where: { email } });
        console.log(`Cleaned up temp data for existing active user: ${email}`);
      } catch (cleanupError) {
        console.error(
          `Failed to clean up temp data for ${email}:`,
          cleanupError
        );
        // Don't throw here, as we can still return the existing user
      }

      // Return the existing active user data
      return {
        userId: existingUser.id,
        email: existingUser.email,
        status: existingUser.status,
        roles: existingUser.roles || [],
        message: "User already exists and is active.",
      };
    }

    // If we get here, the user exists but is either PENDING or deleted,
    // so we'll update this user instead of creating a new one
    console.log(
      `User ${email} exists but is ${existingUser.status} or deleted=${existingUser.isDeleted}, will update`
    );
  }

  // Execute everything in a transaction for atomicity
  try {
    console.log(
      `Starting transaction to handle user registration for: ${email}`
    );

    const result = await prisma.$transaction(async (tx) => {
      // First, verify if user exists with this email (double check within transaction)
      const userExists = await tx.user.findUnique({
        where: { email: tempUser.email.toLowerCase() },
        include: { roles: true },
      });

      if (userExists) {
        console.log(
          `User found in transaction: ${email}, status=${userExists.status}, deleted=${userExists.isDeleted}`
        );

        // If user exists but is in PENDING state or deleted, update them instead of creating new
        if (userExists.status === UserStatus.PENDING || userExists.isDeleted) {
          console.log(`Updating existing PENDING/deleted user: ${email}`);

          // Show what we're going to update
          console.log(
            `Updating user ${userExists.id} with isDeleted=${userExists.isDeleted} to isDeleted=false`
          );

          // Add explicit debugging for the update data
          const updateData = {
            name: tempUser.name,
            password: tempUser.password,
            phoneNumber: tempUser.phone,
            status: UserStatus.PENDING,
            isDeleted: false, // Explicitly setting to false
          };

          console.log(
            "Update data being sent to database:",
            JSON.stringify(updateData)
          );

          // Update the user with latest data from tempUser
          const updatedUser = await tx.user.update({
            where: { id: userExists.id },
            data: updateData,
            include: { roles: true },
          });

          // Verify the update worked
          console.log(
            `After update - user: ${updatedUser.id}, isDeleted=${updatedUser.isDeleted}, status=${updatedUser.status}`
          );

          // Double-check by fetching the user again
          const verifyUser = await tx.user.findUnique({
            where: { id: updatedUser.id },
            select: { id: true, email: true, isDeleted: true, status: true },
          });

          console.log(
            `Verification query - user ${verifyUser?.id}: isDeleted=${verifyUser?.isDeleted}, status=${verifyUser?.status}`
          );

          // Clean up temporary data
          console.log(`Cleaning up temp data after update for: ${email}`);
          await tx.tempUser.delete({ where: { email } });
          await tx.passwordReset.deleteMany({ where: { email } });

          return updatedUser;
        } else {
          // User exists and is not PENDING or deleted - shouldn't normally get here
          // due to our earlier check, but handle it gracefully
          console.log(
            `User already exists with email: ${email} (active in transaction)`
          );
          return userExists;
        }
      }

      // Create the user from tempUser data (if no user exists)
      console.log(`Creating new user from temp data: ${email}`);
      const newUser = await tx.user.create({
        data: {
          name: tempUser.name,
          email: tempUser.email.toLowerCase(),
          password: tempUser.password,
          phoneNumber: tempUser.phone,
          status: UserStatus.PENDING,
          isDeleted: false, // Explicitly set to false to ensure user is not marked as deleted
          roles: {
            create: tempUser.roles.map((role) => ({
              role: role as unknown as UserRole,
            })),
          },
        },
        include: {
          roles: true,
        },
      });

      // Log the successful user creation
      console.log(
        `Successfully created user: ${newUser.id} for email: ${email}`
      );

      // Clean up temporary data
      console.log(`Cleaning up temp data for: ${email}`);
      await tx.tempUser.delete({ where: { email } });
      await tx.passwordReset.deleteMany({ where: { email } });

      return newUser;
    });

    // Verify the result has expected fields
    if (!result || !result.id) {
      throw new ApiError(
        "Error creating user during registration",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    console.log(
      `Returning successful OTP verification result for user: ${result.id}`
    );

    // Generate JWT token just like in login function
    if (!process.env.JWT_SECRET) {
      console.error("[verifyOtpAndRegister] Error: JWT_SECRET is not defined");
      throw new ApiError(
        "Server configuration error",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: result.id,
        email: result.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`Generated JWT token for user ${result.id}`);

    // Return the user data with token
    return {
      userId: result.id,
      email: result.email,
      status: result.status,
      roles: result.roles || [],
      token, // Include the token in the response
      message: "Registration completed successfully!",
    };
  } catch (error) {
    console.error("Error in verifyOtpAndRegister:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log(`Unique constraint violation: ${email} already exists`);
        throw new ApiError(
          "User with this email already exists",
          httpStatus.CONFLICT
        );
      }
    }

    // For other errors
    throw new ApiError(
      "Failed to complete registration. Please try again.",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const login = async (req: Request) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(
        "Email and password are required",
        httpStatus.BAD_REQUEST
      );
    }

    console.log(`[Login] Attempting login for email: ${email}`);

    // First, check if user exists and is not deleted
    const user = await prisma.user.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        isDeleted: false,
      },
      include: {
        roles: {
          select: {
            role: true,
          },
        },
      },
    });

    console.log(`[Login] User found:`, user ? "Yes" : "No");

    if (!user) {
      console.log(
        "[Login] Error: No user found with this email or account is deleted"
      );
      throw new ApiError("Invalid email or password", httpStatus.UNAUTHORIZED);
    }

    // Check if user is active
    if (user.status !== "ACTIVE") {
      console.log(`[Login] Error: User account is ${user.status}`);
      throw new ApiError(
        `Account is ${user.status.toLowerCase()}. Please contact support.`,
        httpStatus.FORBIDDEN
      );
    }

    // Verify password - handle both hashed and unhashed for testing
    let isPasswordValid = false;

    // First try direct comparison (for plaintext passwords in dev/test)
    if (password === user.password) {
      isPasswordValid = true;
      console.log("[Login] Warning: Using plaintext password comparison");
    } else {
      // Then try bcrypt comparison (for proper hashed passwords)
      try {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } catch (err) {
        console.log("[Login] Error in bcrypt compare:", err);
        // If bcrypt fails (not a valid hash), password is invalid
      }
    }

    if (!isPasswordValid) {
      console.log("[Login] Error: Invalid password");
      throw new ApiError("Invalid email or password", httpStatus.UNAUTHORIZED);
    }

    console.log(`[Login] Password verified for user: ${user.id}`);

    // Extract roles
    let userRoles = user.roles.map((r: any) => r.role);
    console.log("[Login] User roles:", userRoles);

    if (!userRoles || userRoles.length === 0) {
      console.log(
        "[Login] No roles assigned to user, defaulting to BUSINESS_OWNER"
      );
      userRoles = [UserRole.BUSINESS_OWNER]; // Default role if none assigned
    }

    if (!process.env.JWT_SECRET) {
      console.error("[Login] Error: JWT_SECRET is not defined");
      throw new ApiError(
        "Internal server error",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: userRoles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...userData } = user;

    console.log(`[Login] Success for user: ${user.email}`);
    return {
      token,
      user: {
        ...userData,
        roles: userRoles,
      },
    };
  } catch (error) {
    console.error("[Login] Error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "An error occurred during login",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const forgotPassword = async (req: Request) => {
  // Check if req.body exists and has email property
  if (!req.body) {
    throw new ApiError("Request body is missing", httpStatus.BAD_REQUEST);
  }

  const { email } = req.body;

  if (!email) {
    throw new ApiError("Email is required", httpStatus.BAD_REQUEST);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  await prisma.passwordReset.create({
    data: {
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
    },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is ${otp}`,
  });

  return { email };
};

const verifyOTP = async (req: Request) => {
  const { email, otp } = req.body;

  const record = await prisma.passwordReset.findFirst({
    where: {
      email,
      otp,
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  if (!record) {
    throw new Error("Invalid or expired OTP");
  }

  return { verified: true };
};

const resetPassword = async (req: Request) => {
  try {
    console.log("Reset password request body:", req.body);
    console.log("Reset password headers:", req.headers);

    // Check if body exists
    if (!req.body) {
      throw new ApiError("Request body is missing", httpStatus.BAD_REQUEST);
    }

    const { email, newPassword, password } = req.body;

    // Validate required fields
    if (!email) {
      throw new ApiError("Email is required", httpStatus.BAD_REQUEST);
    }

    // Accept either password or newPassword field (for backward compatibility)
    const passwordToUse = newPassword || password;
    if (!passwordToUse) {
      throw new ApiError("Password is required", httpStatus.BAD_REQUEST);
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();
    console.log(`Processing reset password for email: ${normalizedEmail}`);

    // Validate user exists
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
        isDeleted: false,
      },
    });

    if (!user) {
      throw new ApiError("User not found", httpStatus.NOT_FOUND);
    }

    console.log(`User found with ID: ${user.id}, updating password`);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(passwordToUse, 12);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete all OTPs for this email after successful reset
    await prisma.passwordReset.deleteMany({
      where: { email: normalizedEmail },
    });

    console.log(`Password successfully reset for email: ${normalizedEmail}`);

    return {
      success: true,
      message: "Password reset successful",
      email: normalizedEmail,
    };
  } catch (error) {
    console.error("[resetPassword] Error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Failed to reset password",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const assignRoleToUser = async (req: Request) => {
  const { userId, role } = req.body;

  if (!Object.values(UserRole).includes(role)) {
    throw new Error("Invalid role");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const existing = await prisma.userRoleAssignment.findFirst({
    where: { userId, role },
  });

  if (existing) {
    throw new Error("Role already assigned to this user");
  }

  const assignment = await prisma.userRoleAssignment.create({
    data: {
      userId,
      role,
    },
  });

  return assignment;
};

// Get all active (non-deleted) users with their roles
const getAllUsers = async () => {
  try {
    console.log("Fetching all active users...");

    // First, check total number of users regardless of deleted status
    const totalCount = await prisma.user.count();
    console.log(`Total users in database (including deleted): ${totalCount}`);

    // Then check if any users exist with deleted status
    const deletedCount = await prisma.user.count({
      where: { isDeleted: true },
    });
    console.log(`Users marked as deleted: ${deletedCount}`);

    // Also check temp users
    const tempUserCount = await prisma.tempUser.count();
    console.log(`TempUsers in database: ${tempUserCount}`);

    // Debug what users we have in the database with a raw query
    // IMPORTANT: Use "users" (lowercase) as that's the actual table name
    // per the @@map("users") directive in the Prisma schema
    try {
      const allUsers =
        await prisma.$queryRaw`SELECT id, email, status, "isDeleted" FROM "users"`;
      console.log("Raw query results:", allUsers);
    } catch (rawQueryError) {
      console.error("Raw query error (non-fatal):", rawQueryError);
    }

    // Now inspect the TempUser table too
    try {
      const tempUsers = await prisma.tempUser.findMany({
        select: { id: true, email: true, status: true },
      });
      console.log("TempUsers found:", tempUsers);
    } catch (tempUserError) {
      console.error("Error fetching temp users (non-fatal):", tempUserError);
    }

    // Match the original query pattern but with added debugging
    // Added profile and company to the include clause
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      include: {
        roles: true,
        profile: true, // Include user profile data
        company: true, // Include company data
      },
    });

    // Log the count for debugging
    console.log(
      `Found ${users.length} active (non-deleted) users in the database`
    );

    // Add detailed debugging for each user found (limited info for privacy)
    if (users.length > 0) {
      console.log(
        "User IDs found:",
        users.map((u) => ({ id: u.id, email: u.email, status: u.status }))
      );
      // Log whether profile and company data is present
      console.log(
        "Profile and company data included:",
        users.map((u) => ({ 
          id: u.id, 
          hasProfile: !!u.profile, 
          hasCompany: !!u.company 
        }))
      );
    } else {
      console.log("No active users found. Possible causes:");
      console.log("1. No users exist in the database");
      console.log("2. All users are marked as deleted (isDeleted=true)");
      console.log("3. Users might be stuck in TempUser table and not migrated");
      console.log("4. Database connection might be to a different environment");
    }

    // Return users array directly
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new ApiError(
      "Failed to retrieve users. Please try again.",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const getUserById = async (userId: string) => {
  try {
    console.log(`[getUserById] Looking up user with ID: ${userId}`);

    // First check if user exists and is not deleted
    // Updated to include profile and company data in a single query
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
      include: {
        profile: true,    // Include user profile data
        company: true,    // Include company data
      },
    });

    if (!user) {
      console.log(`[getUserById] User not found with ID: ${userId}`);
      throw new ApiError("User not found", httpStatus.NOT_FOUND);
    }

    // Get user roles using the correct model name from Prisma schema
    const roleAssignments = await prisma.userRoleAssignment.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    console.log(`[getUserById] Found user:`, {
      id: user.id,
      email: user.email,
      roleCount: roleAssignments.length,
      hasProfile: !!user.profile,
      hasCompany: !!user.company,
    });

    return {
      ...user,
      roles: roleAssignments.map((assignment: any) => assignment.role),
      // profile and company are already included in the user object from the query
    };
  } catch (error) {
    console.error("[getUserById] Error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Failed to fetch user",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const updateUser = async (req: Request) => {
  const { id } = req.params;
  const updatedData = { ...req.body };
  
  // Handle field name mappings
  if (updatedData.phone !== undefined) {
    updatedData.phoneNumber = updatedData.phone; // Map phone to phoneNumber as per Prisma schema
    delete updatedData.phone; // Remove the phone field to avoid Prisma error
  }

  // Ensure we're not trying to update fields that don't exist in the schema
  // Get allowed fields from Prisma schema
  const allowedFields = [
    'name',
    'email',
    'password',
    'phoneNumber', // Use phoneNumber instead of phone
    'status',
    'isDeleted'
    // Add other fields from the schema as needed
  ];

  // Filter out any fields that aren't in our allowed list
  const sanitizedData = Object.keys(updatedData).reduce((acc, key) => {
    if (allowedFields.includes(key)) {
      acc[key] = updatedData[key];
    } else {
      console.warn(`Skipping field '${key}' as it's not in the Prisma schema`);
    }
    return acc;
  }, {} as Record<string, any>);

  console.log('Finding user with ID:', id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    console.error('User not found with ID:', id);
    throw new Error("User not found");
  }
  
  console.log('Updating user with data:', sanitizedData);
  const updatedUser = await prisma.user.update({
    where: { id },
    data: sanitizedData,
    include: {
      profile: true,   // Include profile data in response
      company: true,   // Include company data in response
    }
  });

  return updatedUser;
};

const deleteUser = async (req: Request) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }

  // Ensure you include the `data` field with update
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { isDeleted: true },
  });

  return {
    message: "User soft deleted successfully",
    user: updatedUser,
  };
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  // Validate status
  if (!Object.values(UserStatus).includes(status)) {
    throw new ApiError(`Invalid status: ${status}`, httpStatus.BAD_REQUEST);
  }

  // Check if user exists and get all required info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      company: true,
    },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  // Update user status
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  // Only send notifications for ACTIVE or REJECTED status changes
  if (status === UserStatus.ACTIVE || status === UserStatus.REJECTED) {
    try {
      // Send status notification email
      await sendStatusNotificationEmail({
        to: user.email,
        userName: user.name,
        status: status as "ACTIVE" | "REJECTED",
      });

      console.log(`Status notification email sent to ${user.email}`);
    } catch (error) {
      console.error(
        `Failed to send status notification email to ${user.email}:`,
        error
      );
      // Don't throw error here, as the status update has already been completed
      // We don't want email failures to prevent the API from returning success
    }
  }

  return {
    message: `User status updated to ${status}`,
    user: updatedUser,
  };
};

/**
 * Admin creates a new user with initial password
 * Sends welcome email with login credentials
 */
const adminCreateUser = async (req: Request) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      roles: selectedRoles = [UserRole.BUSINESS_OWNER],
    } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      throw new ApiError("Name is required", httpStatus.BAD_REQUEST);
    }

    if (!email || !email.trim()) {
      throw new ApiError("Email is required", httpStatus.BAD_REQUEST);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError("Invalid email format", httpStatus.BAD_REQUEST);
    }

    // Validate phone number if provided
    if (phoneNumber) {
      // Basic phone validation - adjust to your specific requirements
      if (!/^[0-9+\-\s]{7,15}$/.test(phoneNumber)) {
        throw new ApiError(
          "Invalid phone number format",
          httpStatus.BAD_REQUEST
        );
      }
    }

    // Validate roles
    if (selectedRoles && Array.isArray(selectedRoles)) {
      for (const role of selectedRoles) {
        if (!Object.values(UserRole).includes(role)) {
          throw new ApiError(`Invalid role: ${role}`, httpStatus.BAD_REQUEST);
        }
      }
    }

    // First check if email exists in admin table (admin check takes priority)
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
        httpStatus.CONFLICT
      );
    }

    // Then check if email already exists in users table (case insensitive)
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.toLowerCase(),
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      throw new ApiError(
        "User with this email already exists",
        httpStatus.CONFLICT
      );
    }

    // Generate a random temporary password
    const tempPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Process roles
    const rolesToAssign = processRoles(selectedRoles);

    // Create user with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          status: UserStatus.ACTIVE, // Directly active for admin-created users
          roles: {
            create: rolesToAssign.map((role) => ({ role })),
          },
        },
        include: {
          roles: true,
        },
      });

      return {
        user,
        plainPassword: tempPassword, // Return the plain password for email only
      };
    });

    // Send welcome email with login credentials
    await sendWelcomeEmail({
      to: email,
      name,
      email,
      password: result.plainPassword,
      loginUrl: process.env.FRONTEND_URL
        ? `${process.env.FRONTEND_URL}/login`
        : "https://bizworld.com/login",
    });

    // Don't return the plain password in the API response
    const { plainPassword, ...response } = result;

    return response;
  } catch (error) {
    console.error("[adminCreateUser] Error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Failed to create user",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Helper function to generate a random password
 */
const generateRandomPassword = (): string => {
  const length = 10;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";

  // Ensure at least one uppercase, one lowercase, one number and one special character
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)];

  // Fill the rest of the password
  for (let i = 4; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  // Shuffle the password characters
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

/**
 * Helper function to process roles
 */
const processRoles = (selectedRoles: UserRole[]): UserRole[] => {
  // Always include BUSINESS_OWNER
  const rolesToAssign = [UserRole.BUSINESS_OWNER];

  if (Array.isArray(selectedRoles)) {
    for (const role of selectedRoles) {
      if (
        role !== UserRole.BUSINESS_OWNER &&
        Object.values(UserRole).includes(role)
      ) {
        rolesToAssign.push(role);
      }
    }
  }

  return [...new Set(rolesToAssign)];
};

/**
 * Change password for an authenticated user
 * Requires the current password for verification
 */
const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  try {
    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new ApiError("User not found", httpStatus.NOT_FOUND);
    }

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new ApiError(
        "Current password is incorrect",
        httpStatus.UNAUTHORIZED
      );
    }

    // Check if new password meets requirements
    if (newPassword.length < 8) {
      throw new ApiError(
        "New password must be at least 8 characters long",
        httpStatus.BAD_REQUEST
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: "Password changed successfully",
      success: true,
    };
  } catch (error) {
    console.error("[changePassword] Error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Failed to change password",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Simple password update function for the change password screen
 * This doesn't require the current password verification
 */
const updateUserPassword = async (
  id: string | null,
  email: string | null,
  newPassword: string
) => {
  try {
    if (!id && !email) {
      throw new ApiError(
        "User ID or email is required",
        httpStatus.BAD_REQUEST
      );
    }

    // Find the user by ID or email
    const user = await prisma.user.findFirst({
      where: id
        ? { id }
        : {
            email: {
              equals: email!.toLowerCase(),
              mode: "insensitive",
            },
          },
    });

    if (!user) {
      throw new ApiError("User not found", httpStatus.NOT_FOUND);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("[updateUserPassword] Error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Failed to update password",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Utility function to reset all users marked as deleted to non-deleted status
 * @returns Number of users reset
 */
const resetDeletedUsers = async () => {
  try {
    console.log("Resetting users marked as deleted...");
    const result = await prisma.user.updateMany({
      where: { isDeleted: true },
      data: { isDeleted: false },
    });
    console.log(`Reset ${result.count} users from deleted status`);
    return result.count;
  } catch (error) {
    console.error("Error resetting deleted users:", error);
    throw new ApiError(
      "Failed to reset users",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Utility function to clean up all temporary users
 * @returns Count of cleaned up records
 */
const cleanupTempUsers = async () => {
  try {
    console.log("Cleaning up temporary users...");
    // Delete all temp users
    const result = await prisma.tempUser.deleteMany({});
    console.log(`Cleaned up ${result.count} temporary users`);

    // Also clean associated password reset records
    const pwReset = await prisma.passwordReset.deleteMany({});
    console.log(`Cleaned up ${pwReset.count} password reset records`);

    return {
      tempUsers: result.count,
      passwordResets: pwReset.count,
    };
  } catch (error) {
    console.error("Error cleaning up temp users:", error);
    throw new ApiError(
      "Failed to clean up temp users",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const UserService = {
  // Authentication related
  register,
  verifyOtpAndRegister,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword,
  updateUserPassword,

  // User management
  assignRoleToUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  adminCreateUser,
  // Utility functions
  resetDeletedUsers,
  cleanupTempUsers,
  generateRandomPassword,
  processRoles,
};
