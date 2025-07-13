import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import { ApiError } from "../../../middleware/error/errorHandler";
import { getFileUrl } from "../../utils/fileUploadService";
import { DocumentService, EntityType } from "../Document/document.service";

// Extended request interface to include file from multer
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

// Use Prisma type imports for strongly-typed operations

const prisma = new PrismaClient();

const createUserProfile = async (req: Request) => {
  const { userId } = req.params;
  const {
    professionalHeadline,
    industrySpecialization,
    areasOfExpertise,
    portfolioLink,
    introduction,
    hourlyRate,
  } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  // Check if profile already exists
  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    throw new ApiError("User profile already exists", httpStatus.BAD_REQUEST);
  }

  // Create user profile
  const profile = await prisma.userProfile.create({
    data: {
      userId,
      professionalHeadline,
      industrySpecialization,
      areasOfExpertise: Array.isArray(areasOfExpertise) ? areasOfExpertise : [],
      portfolioLink,
      introduction,
      hourlyRate: hourlyRate ? parseInt(hourlyRate) : null,
    },
  });

  return profile;
};

const getUserProfile = async (userId: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  // Get user profile
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    include: {
      documents: true,
    },
  });

  if (!profile) {
    throw new ApiError("User profile not found", httpStatus.NOT_FOUND);
  }

  return profile;
};

const updateUserProfile = async (req: Request) => {
  const { userId } = req.params;
  const {
    professionalHeadline,
    industrySpecialization,
    areasOfExpertise,
    portfolioLink,
    introduction,
    hourlyRate,
  } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  // Check if profile exists
  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    throw new ApiError("User profile not found", httpStatus.NOT_FOUND);
  }

  // Update user profile
  const updatedProfile = await prisma.userProfile.update({
    where: { userId },
    data: {
      professionalHeadline,
      industrySpecialization,
      areasOfExpertise: areasOfExpertise
        ? Array.isArray(areasOfExpertise)
          ? areasOfExpertise
          : existingProfile.areasOfExpertise
        : existingProfile.areasOfExpertise,
      portfolioLink,
      introduction,
      hourlyRate: hourlyRate
        ? parseInt(hourlyRate)
        : existingProfile.hourlyRate,
    },
  });

  return updatedProfile;
};

const addDocumentToProfile = async (req: Request) => {
  const { userId } = req.params;
  const { documentUrl, documentType } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  // Check if profile exists
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new ApiError("User profile not found", httpStatus.NOT_FOUND);
  }

  // Use the shared DocumentService to add a document to the profile
  return DocumentService.addDocument(
    EntityType.USER_PROFILE,
    profile.id,
    { documentUrl, documentType }
  );
};

const getAllUserProfiles = async () => {
  const profiles = await prisma.userProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
      },
      documents: true,
    },
  });

  return profiles;
};

const deleteUserProfile = async (userId: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  // Check if profile exists
  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    throw new ApiError("User profile not found", httpStatus.NOT_FOUND);
  }

  // Delete related documents first
  await prisma.document.deleteMany({
    where: { userProfileId: existingProfile.id },
  });

  // Delete the profile
  const deletedProfile = await prisma.userProfile.delete({
    where: { userId },
  });

  return {
    message: "User profile deleted successfully",
    profile: deletedProfile,
  };
};

const deleteDocument = async (documentId: string) => {
  // Use the shared DocumentService to delete the document
  return DocumentService.deleteDocument(documentId);
};

const uploadProfileImage = async (req: RequestWithFile) => {
  const { userId } = req.params;
  const file = req.file;

  if (!file) {
    throw new ApiError("No image file provided", httpStatus.BAD_REQUEST);
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  // Generate URL for the uploaded file
  const imageUrl = getFileUrl(file.path);

  try {
    // Use raw SQL query to bypass TypeScript typechecking issues
    // Check if profile exists
    const existingProfile = await prisma.$queryRaw`
      SELECT * FROM "user_profiles" WHERE "userId" = ${userId}
    `;

    let profile;

    if (
      existingProfile &&
      Array.isArray(existingProfile) &&
      existingProfile.length > 0
    ) {
      // If profile exists, update the image URL
      await prisma.$executeRaw`
        UPDATE "user_profiles"
        SET "imageUrl" = ${imageUrl}
        WHERE "userId" = ${userId}
      `;

      // Fetch the updated profile
      const updatedProfile = await prisma.$queryRaw`
        SELECT * FROM "user_profiles" WHERE "userId" = ${userId}
      `;

      profile = Array.isArray(updatedProfile) ? updatedProfile[0] : null;
    } else {
      // If profile doesn't exist, create a new one with just the image URL
      await prisma.$executeRaw`
        INSERT INTO "user_profiles" ("id", "userId", "imageUrl")
        VALUES (gen_random_uuid(), ${userId}, ${imageUrl})
      `;

      // Fetch the created profile
      const createdProfile = await prisma.$queryRaw`
        SELECT * FROM "user_profiles" WHERE "userId" = ${userId}
      `;

      profile = Array.isArray(createdProfile) ? createdProfile[0] : null;
    }

    return profile;
  } catch (error) {
    // Handle error with proper type checking
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    throw new ApiError(
      `Failed to update profile image: ${errorMessage}`,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const UserProfileService = {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  addDocumentToProfile,
  getAllUserProfiles,
  deleteUserProfile,
  deleteDocument,
  uploadProfileImage,
};
