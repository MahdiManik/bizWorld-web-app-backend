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
exports.ListingService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const errorHandler_1 = require("../../../middleware/error/errorHandler");
// Define enums manually to avoid type issues
var ListingStatus;
(function (ListingStatus) {
    ListingStatus["PENDING"] = "PENDING";
    ListingStatus["APPROVED"] = "APPROVED";
    ListingStatus["REJECTED"] = "REJECTED";
})(ListingStatus || (ListingStatus = {}));
// No longer using enum for categories as they are now dynamic from the database
const prisma = new client_1.PrismaClient();
const createListing = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Get companyId from URL params
    const { companyId } = req.params;
    const { title, image, askingPrice, category, // Single category enum value (SMALL_BUSINESS or ECOMMERCE)
    location, isFavorite, ownerId, // Allow directly providing ownerId in request body for testing
    // Financial data
    ebitda, revenueYoY, ebitdaYoY, marginYoY, monthlyData, // Array of monthly financial data
     } = req.body;
    // Get user ID from request body, authenticated user, or fail gracefully
    const ownerUserId = ownerId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    // Check if company exists
    const company = yield prisma.company.findUnique({
        where: { id: companyId },
    });
    if (!company) {
        throw new errorHandler_1.ApiError("Company not found", http_status_1.default.NOT_FOUND);
    }
    // Validate category enum value
    const validCategories = ['MOBILE', 'FINTECH', 'ECOMMERCE'];
    if (category && !validCategories.includes(category)) {
        throw new errorHandler_1.ApiError(`Invalid category. Must be one of: ${validCategories.join(', ')}`, http_status_1.default.BAD_REQUEST);
    }
    // Validate that monthlyData is an array if provided
    if (monthlyData && !Array.isArray(monthlyData)) {
        throw new errorHandler_1.ApiError("monthlyData must be an array", http_status_1.default.BAD_REQUEST);
    }
    // Create listing with default PENDING status
    const listing = yield prisma.listing.create({
        data: {
            title,
            image,
            askingPrice,
            status: ListingStatus.PENDING, // Default to PENDING as per schema default
            location,
            isFavorite: isFavorite || false,
            // Connect to owner (User model)
            owner: {
                connect: { id: ownerUserId },
            },
            // Connect to company
            company: {
                connect: { id: companyId },
            },
            // category (simple enum)
            category: category || 'ECOMMERCE', // Default to MOBILE
            // financial summary
            financialMetric: {
                create: {
                    ebitda,
                    revenueYoYChange: revenueYoY,
                    ebitdaYoYChange: ebitdaYoY,
                    profitMarginYoYChange: marginYoY,
                },
            },
            // monthly financials
            monthlyFinancials: monthlyData && {
                create: monthlyData.map((item) => ({
                    month: item.month,
                    year: item.year,
                    revenue: item.revenue,
                    ebitda: item.ebitda,
                    profitMargin: item.profitMargin,
                })),
            },
        },
        include: {
            company: true,
            owner: true,
            monthlyFinancials: true,
            financialMetric: true,
        },
    });
    return listing;
});
const getListing = (listingId) => __awaiter(void 0, void 0, void 0, function* () {
    const listing = yield prisma.listing.findUnique({
        where: { id: listingId },
        include: {
            company: true,
            owner: true,
            monthlyFinancials: true,
            financialMetric: true,
        },
    });
    if (!listing) {
        throw new errorHandler_1.ApiError("Listing not found", http_status_1.default.NOT_FOUND);
    }
    return listing;
});
const getListingsByCompany = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if company exists
    const company = yield prisma.company.findUnique({
        where: { id: companyId },
    });
    if (!company) {
        throw new errorHandler_1.ApiError("Company not found", http_status_1.default.NOT_FOUND);
    }
    // Get listings
    const listings = yield prisma.listing.findMany({
        where: { companyId },
        include: {
            company: true,
            owner: true,
            monthlyFinancials: true,
            financialMetric: true,
        },
    });
    return listings;
});
const updateListing = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { listingId } = req.params;
    const { title, image, askingPrice, category, // Single category enum value
    location, isFavorite, 
    // Financial data
    ebitda, revenueYoY, ebitdaYoY, marginYoY, monthlyData, // Array of monthly financial data
     } = req.body;
    // Check if listing exists
    const listing = yield prisma.listing.findUnique({
        where: { id: listingId },
    });
    if (!listing) {
        throw new errorHandler_1.ApiError("Listing not found", http_status_1.default.NOT_FOUND);
    }
    // Validate category enum value if provided
    const validCategories = ['ECOMMERCE', 'MOBILE', 'FINTECH'];
    if (category && !validCategories.includes(category)) {
        throw new errorHandler_1.ApiError(`Invalid category. Must be one of: ${validCategories.join(', ')}`, http_status_1.default.BAD_REQUEST);
    }
    // Prepare update data object
    const updateData = {
        title,
        image,
        askingPrice,
        location,
        isFavorite,
    };
    // Handle category if provided
    if (category) {
        updateData.category = category;
    }
    // Handle financial metrics if provided
    if (ebitda || revenueYoY || ebitdaYoY || marginYoY) {
        updateData.financialMetric = {
            // Use upsert to update if exists, create if not
            upsert: {
                create: {
                    ebitda,
                    revenueYoYChange: revenueYoY,
                    ebitdaYoYChange: ebitdaYoY,
                    profitMarginYoYChange: marginYoY,
                },
                update: {
                    ebitda,
                    revenueYoYChange: revenueYoY,
                    ebitdaYoYChange: ebitdaYoY,
                    profitMarginYoYChange: marginYoY,
                },
            },
        };
    }
    // Handle monthly financials if provided
    if (monthlyData && Array.isArray(monthlyData)) {
        // First delete existing monthly financials
        yield prisma.monthlyFinancial.deleteMany({
            where: { listingId },
        });
        // Then add the new ones
        updateData.monthlyFinancials = {
            create: monthlyData.map((item) => ({
                month: item.month,
                year: item.year,
                revenue: item.revenue,
                ebitda: item.ebitda,
                profitMargin: item.profitMargin,
            })),
        };
    }
    // Update listing with all changes
    const updatedListing = yield prisma.listing.update({
        where: { id: listingId },
        data: updateData,
        include: {
            company: true,
            owner: true,
            monthlyFinancials: true,
            financialMetric: true,
        },
    });
    return updatedListing;
});
const updateListingStatus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { listingId } = req.params;
    const { status } = req.body;
    // Validate status value
    if (!Object.values(ListingStatus).includes(status)) {
        throw new errorHandler_1.ApiError("Invalid listing status", http_status_1.default.BAD_REQUEST);
    }
    // Check if listing exists
    const listing = yield prisma.listing.findUnique({
        where: { id: listingId },
    });
    if (!listing) {
        throw new errorHandler_1.ApiError("Listing not found", http_status_1.default.NOT_FOUND);
    }
    // Update listing status
    const updatedListing = yield prisma.listing.update({
        where: { id: listingId },
        data: { status },
        include: {
            company: true,
            owner: true,
        },
    });
    return updatedListing;
});
const getAllListings = (status, category) => __awaiter(void 0, void 0, void 0, function* () {
    // Build where clause conditionally based on filters provided
    const where = {};
    if (status) {
        where.status = status;
    }
    if (category) {
        where.category = category;
    }
    console.log("Fetching listings with filters:", where);
    // Standard query with category filter as enum
    const listings = yield prisma.listing.findMany({
        where,
        include: {
            company: true,
            owner: true,
            monthlyFinancials: true,
            financialMetric: true,
        },
    });
    console.log(`Found ${listings.length} listings matching filters`);
    return listings;
});
const deleteListing = (listingId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if listing exists
    const listing = yield prisma.listing.findUnique({
        where: { id: listingId },
    });
    if (!listing) {
        throw new errorHandler_1.ApiError("Listing not found", http_status_1.default.NOT_FOUND);
    }
    // Delete the listing
    const deletedListing = yield prisma.listing.delete({
        where: { id: listingId },
    });
    return {
        message: "Listing deleted successfully",
        listing: deletedListing,
    };
});
const getListingsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Get all listings owned by this user
    const listings = yield prisma.listing.findMany({
        where: { ownerId: userId },
        include: {
            company: true,
            owner: true,
        },
    });
    return listings;
});
exports.ListingService = {
    createListing,
    getListing,
    getListingsByCompany,
    updateListing,
    updateListingStatus,
    getAllListings,
    deleteListing,
    getListingsByUserId,
};
