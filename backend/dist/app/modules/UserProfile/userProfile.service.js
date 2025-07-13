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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const errorHandler_1 = require("../../../middleware/error/errorHandler");
const fileUploadService_1 = require("../../utils/fileUploadService");
const document_service_1 = require("../Document/document.service");
// Use Prisma type imports for strongly-typed operations
const prisma = new client_1.PrismaClient();
const createUserProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { professionalHeadline, industrySpecialization, areasOfExpertise, portfolioLink, introduction, hourlyRate, } = req.body;
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Check if profile already exists
    const existingProfile = yield prisma.userProfile.findUnique({
        where: { userId },
    });
    if (existingProfile) {
        throw new errorHandler_1.ApiError("User profile already exists", http_status_1.default.BAD_REQUEST);
    }
    // Create user profile
    const profile = yield prisma.userProfile.create({
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
});
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Get user profile
    const profile = yield prisma.userProfile.findUnique({
        where: { userId },
        include: {
            documents: true,
        },
    });
    if (!profile) {
        throw new errorHandler_1.ApiError("User profile not found", http_status_1.default.NOT_FOUND);
    }
    return profile;
});
const updateUserProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { professionalHeadline, industrySpecialization, areasOfExpertise, portfolioLink, introduction, hourlyRate, } = req.body;
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Check if profile exists
    const existingProfile = yield prisma.userProfile.findUnique({
        where: { userId },
    });
    if (!existingProfile) {
        throw new errorHandler_1.ApiError("User profile not found", http_status_1.default.NOT_FOUND);
    }
    // Update user profile
    const updatedProfile = yield prisma.userProfile.update({
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
});
const addDocumentToProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { documentUrl, documentType } = req.body;
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Check if profile exists
    const profile = yield prisma.userProfile.findUnique({
        where: { userId },
    });
    if (!profile) {
        throw new errorHandler_1.ApiError("User profile not found", http_status_1.default.NOT_FOUND);
    }
    // Use the shared DocumentService to add a document to the profile
    return document_service_1.DocumentService.addDocument(document_service_1.EntityType.USER_PROFILE, profile.id, { documentUrl, documentType });
});
const getAllUserProfiles = () => __awaiter(void 0, void 0, void 0, function* () {
    const profiles = yield prisma.userProfile.findMany({
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
});
const deleteUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Check if profile exists
    const existingProfile = yield prisma.userProfile.findUnique({
        where: { userId },
    });
    if (!existingProfile) {
        throw new errorHandler_1.ApiError("User profile not found", http_status_1.default.NOT_FOUND);
    }
    // Delete related documents first
    yield prisma.document.deleteMany({
        where: { userProfileId: existingProfile.id },
    });
    // Delete the profile
    const deletedProfile = yield prisma.userProfile.delete({
        where: { userId },
    });
    return {
        message: "User profile deleted successfully",
        profile: deletedProfile,
    };
});
const deleteDocument = (documentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Use the shared DocumentService to delete the document
    return document_service_1.DocumentService.deleteDocument(documentId);
});
const uploadProfileImage = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const file = req.file;
    if (!file) {
        throw new errorHandler_1.ApiError("No image file provided", http_status_1.default.BAD_REQUEST);
    }
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Generate URL for the uploaded file
    const imageUrl = (0, fileUploadService_1.getFileUrl)(file.path);
    try {
        // Use raw SQL query to bypass TypeScript typechecking issues
        // Check if profile exists
        const existingProfile = yield prisma.$queryRaw `
      SELECT * FROM "user_profiles" WHERE "userId" = ${userId}
    `;
        let profile;
        if (existingProfile &&
            Array.isArray(existingProfile) &&
            existingProfile.length > 0) {
            // If profile exists, update the image URL
            yield prisma.$executeRaw `
        UPDATE "user_profiles"
        SET "imageUrl" = ${imageUrl}
        WHERE "userId" = ${userId}
      `;
            // Fetch the updated profile
            const updatedProfile = yield prisma.$queryRaw `
        SELECT * FROM "user_profiles" WHERE "userId" = ${userId}
      `;
            profile = Array.isArray(updatedProfile) ? updatedProfile[0] : null;
        }
        else {
            // If profile doesn't exist, create a new one with just the image URL
            yield prisma.$executeRaw `
        INSERT INTO "user_profiles" ("id", "userId", "imageUrl")
        VALUES (gen_random_uuid(), ${userId}, ${imageUrl})
      `;
            // Fetch the created profile
            const createdProfile = yield prisma.$queryRaw `
        SELECT * FROM "user_profiles" WHERE "userId" = ${userId}
      `;
            profile = Array.isArray(createdProfile) ? createdProfile[0] : null;
        }
        return profile;
    }
    catch (error) {
        // Handle error with proper type checking
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        throw new errorHandler_1.ApiError(`Failed to update profile image: ${errorMessage}`, http_status_1.default.INTERNAL_SERVER_ERROR);
    }
});
exports.UserProfileService = {
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    addDocumentToProfile,
    getAllUserProfiles,
    deleteUserProfile,
    deleteDocument,
    uploadProfileImage,
};
