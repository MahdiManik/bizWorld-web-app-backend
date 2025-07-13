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
exports.interestService = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../../../middleware/error/errorHandler");
const http_status_1 = __importDefault(require("http-status"));
const prisma = new client_1.PrismaClient();
// Create or update interest in a listing
const expressInterest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { listingId } = req.params;
    const { message } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new errorHandler_1.ApiError('User not authenticated', http_status_1.default.UNAUTHORIZED);
    }
    if (!listingId) {
        throw new errorHandler_1.ApiError('Listing ID is required', http_status_1.default.BAD_REQUEST);
    }
    try {
        // Check if listing exists
        const listing = yield prisma.listing.findUnique({
            where: { id: listingId },
            include: { owner: true }
        });
        if (!listing) {
            throw new errorHandler_1.ApiError('Listing not found', http_status_1.default.NOT_FOUND);
        }
        // Check if user is trying to express interest in their own listing
        if (listing.ownerId === userId) {
            throw new errorHandler_1.ApiError('Cannot express interest in your own listing', http_status_1.default.BAD_REQUEST);
        }
        // Check if interest already exists
        const existingInterest = yield prisma.listingInterest.findUnique({
            where: {
                listingId_userId: {
                    listingId,
                    userId
                }
            }
        });
        if (existingInterest) {
            throw new errorHandler_1.ApiError('You have already expressed interest in this listing', http_status_1.default.BAD_REQUEST);
        }
        // Create new interest
        const interest = yield prisma.listingInterest.create({
            data: {
                listingId,
                userId,
                message: message || null,
                status: 'PENDING'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                listing: {
                    select: {
                        id: true,
                        title: true,
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        return interest;
    }
    catch (error) {
        console.error('Error expressing interest:', error);
        if (error instanceof errorHandler_1.ApiError) {
            throw error;
        }
        throw new errorHandler_1.ApiError('Failed to express interest', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
});
// Update interest status (for business owners)
const updateInterestStatus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { interestId } = req.params;
    const { status } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new errorHandler_1.ApiError('User not authenticated', http_status_1.default.UNAUTHORIZED);
    }
    if (!interestId) {
        throw new errorHandler_1.ApiError('Interest ID is required', http_status_1.default.BAD_REQUEST);
    }
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
        throw new errorHandler_1.ApiError('Valid status is required (APPROVED or REJECTED)', http_status_1.default.BAD_REQUEST);
    }
    try {
        // Find the interest and verify ownership
        const interest = yield prisma.listingInterest.findUnique({
            where: { id: interestId },
            include: {
                listing: {
                    include: {
                        owner: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        if (!interest) {
            throw new errorHandler_1.ApiError('Interest not found', http_status_1.default.NOT_FOUND);
        }
        // Check if the current user is the owner of the listing
        if (interest.listing.ownerId !== userId) {
            throw new errorHandler_1.ApiError('Only the listing owner can update interest status', http_status_1.default.FORBIDDEN);
        }
        // Update the interest status
        const updatedInterest = yield prisma.listingInterest.update({
            where: { id: interestId },
            data: { status },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                listing: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
        return updatedInterest;
    }
    catch (error) {
        console.error('Error updating interest status:', error);
        if (error instanceof errorHandler_1.ApiError) {
            throw error;
        }
        throw new errorHandler_1.ApiError('Failed to update interest status', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
});
// Get interests for a specific listing (for business owners)
const getListingInterests = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { listingId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new errorHandler_1.ApiError('User not authenticated', http_status_1.default.UNAUTHORIZED);
    }
    try {
        // Verify listing ownership
        const listing = yield prisma.listing.findUnique({
            where: { id: listingId }
        });
        if (!listing) {
            throw new errorHandler_1.ApiError('Listing not found', http_status_1.default.NOT_FOUND);
        }
        if (listing.ownerId !== userId) {
            throw new errorHandler_1.ApiError('Only the listing owner can view interests', http_status_1.default.FORBIDDEN);
        }
        // Get all interests for this listing
        const interests = yield prisma.listingInterest.findMany({
            where: { listingId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                imageUrl: true,
                                professionalHeadline: true,
                                industrySpecialization: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return interests;
    }
    catch (error) {
        console.error('Error getting listing interests:', error);
        if (error instanceof errorHandler_1.ApiError) {
            throw error;
        }
        throw new errorHandler_1.ApiError('Failed to get listing interests', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
});
// Get user's interests (for investors)
const getUserInterests = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new errorHandler_1.ApiError('User not authenticated', http_status_1.default.UNAUTHORIZED);
    }
    try {
        const interests = yield prisma.listingInterest.findMany({
            where: { userId },
            include: {
                listing: {
                    include: {
                        company: {
                            select: {
                                name: true,
                                logo: true,
                                industry: true,
                                location: true
                            }
                        },
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return interests;
    }
    catch (error) {
        console.error('Error getting user interests:', error);
        if (error instanceof errorHandler_1.ApiError) {
            throw error;
        }
        throw new errorHandler_1.ApiError('Failed to get user interests', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
});
// Delete interest (for investors to withdraw interest)
const deleteInterest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { interestId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new errorHandler_1.ApiError('User not authenticated', http_status_1.default.UNAUTHORIZED);
    }
    try {
        // Find the interest and verify ownership
        const interest = yield prisma.listingInterest.findUnique({
            where: { id: interestId }
        });
        if (!interest) {
            throw new errorHandler_1.ApiError('Interest not found', http_status_1.default.NOT_FOUND);
        }
        // Check if the current user owns this interest
        if (interest.userId !== userId) {
            throw new errorHandler_1.ApiError('You can only delete your own interests', http_status_1.default.FORBIDDEN);
        }
        // Delete the interest
        yield prisma.listingInterest.delete({
            where: { id: interestId }
        });
        return { message: 'Interest deleted successfully' };
    }
    catch (error) {
        console.error('Error deleting interest:', error);
        if (error instanceof errorHandler_1.ApiError) {
            throw error;
        }
        throw new errorHandler_1.ApiError('Failed to delete interest', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
});
exports.interestService = {
    expressInterest,
    updateInterestStatus,
    getListingInterests,
    getUserInterests,
    deleteInterest
};
