/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import { ApiError } from "../../../middleware/error/errorHandler";

// Define enums manually to avoid type issues
enum ListingStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// No longer using enum for categories as they are now dynamic from the database
const prisma = new PrismaClient();

const createListing = async (req: Request) => {
  // Get companyId from URL params
  const { companyId } = req.params;

  const {
    title,
    image,
    askingPrice,
    category, // Single category enum value (SMALL_BUSINESS or ECOMMERCE)
    location,
    isFavorite,
    ownerId, // Allow directly providing ownerId in request body for testing
    // Financial data
    ebitda,
    revenueYoY,
    ebitdaYoY,
    marginYoY,
    monthlyData, // Array of monthly financial data
    visibility,
  } = req.body;

  // Get user ID from request body, authenticated user, or fail gracefully
  const ownerUserId = ownerId || req.user?.userId;

  // Check if company exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new ApiError("Company not found", httpStatus.NOT_FOUND);
  }

  // Validate category enum value
  const validCategories = ["MOBILE", "FINTECH", "ECOMMERCE"];
  if (category && !validCategories.includes(category)) {
    throw new ApiError(
      `Invalid category. Must be one of: ${validCategories.join(", ")}`,
      httpStatus.BAD_REQUEST
    );
  }

  // Validate that monthlyData is an array if provided
  if (monthlyData && !Array.isArray(monthlyData)) {
    throw new ApiError("monthlyData must be an array", httpStatus.BAD_REQUEST);
  }

  // Create listing with default PENDING status
  const listing = await prisma.listing.create({
    data: {
      title,
      image,
      askingPrice,
      status: ListingStatus.PENDING, // Default to PENDING as per schema default
      location,
      isFavorite: isFavorite || false,
      visibility,

      // Connect to owner (User model)
      owner: {
        connect: { id: ownerUserId },
      },

      // Connect to company
      company: {
        connect: { id: companyId },
      },

      // category (simple enum)
      category: category || "ECOMMERCE", // Default to MOBILE

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
        create: monthlyData.map((item: any) => ({
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
};

const getListing = async (listingId: string) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      company: true,
      owner: true,
      monthlyFinancials: true,
      financialMetric: true,
    },
  });

  if (!listing) {
    throw new ApiError("Listing not found", httpStatus.NOT_FOUND);
  }

  return listing;
};

const getListingsByCompany = async (companyId: string) => {
  // Check if company exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new ApiError("Company not found", httpStatus.NOT_FOUND);
  }

  // Get listings
  const listings = await prisma.listing.findMany({
    where: { companyId },
    include: {
      company: true,
      owner: true,
      monthlyFinancials: true,
      financialMetric: true,
    },
  });

  return listings;
};

/**
 * Updates a listing with new data
 * @param {Request} req Request object from Express
 * @returns {Promise<Listing>} Updated listing
 */

const updateListing = async (req: Request) => {
  const { listingId } = req.params;
  const {
    title,
    image,
    askingPrice,
    category, // Single category enum value
    location,
    isFavorite,
    visibility,
    // Financial data
    ebitda,
    revenueYoY,
    ebitdaYoY,
    marginYoY,
    monthlyData, // Array of monthly financial data
  } = req.body;

  // Check if listing exists
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    throw new ApiError("Listing not found", httpStatus.NOT_FOUND);
  }

  // Validate category enum value if provided
  const validCategories = ["ECOMMERCE", "MOBILE", "FINTECH"];
  if (category && !validCategories.includes(category)) {
    throw new ApiError(
      `Invalid category. Must be one of: ${validCategories.join(", ")}`,
      httpStatus.BAD_REQUEST
    );
  }

  // Prepare update data object
  const updateData: any = {
    title,
    image,
    askingPrice,
    location,
    isFavorite,
    visibility,
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
    await prisma.monthlyFinancial.deleteMany({
      where: { listingId },
    });

    // Then add the new ones
    updateData.monthlyFinancials = {
      create: monthlyData.map((item: any) => ({
        month: item.month,
        year: item.year,
        revenue: item.revenue,
        ebitda: item.ebitda,
        profitMargin: item.profitMargin,
      })),
    };
  }

  // Update listing with all changes
  const updatedListing = await prisma.listing.update({
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
};

const updateListingStatus = async (req: Request) => {
  const { listingId } = req.params;
  const { status } = req.body;

  // Validate status value
  if (!Object.values(ListingStatus).includes(status)) {
    throw new ApiError("Invalid listing status", httpStatus.BAD_REQUEST);
  }

  // Check if listing exists
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    throw new ApiError("Listing not found", httpStatus.NOT_FOUND);
  }

  // Update listing status
  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: { status },
    include: {
      company: true,
      owner: true,
    },
  });

  return updatedListing;
};

const getAllListings = async (status?: ListingStatus, category?: string) => {
  // Build where clause conditionally based on filters provided
  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (category) {
    where.category = category;
  }

  console.log("Fetching listings with filters:", where);

  // Standard query with category filter as enum
  const listings = await prisma.listing.findMany({
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
};

const deleteListing = async (listingId: string) => {
  // Check if listing exists
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    throw new ApiError("Listing not found", httpStatus.NOT_FOUND);
  }

  // Delete the listing
  const deletedListing = await prisma.listing.delete({
    where: { id: listingId },
  });

  return {
    message: "Listing deleted successfully",
    listing: deletedListing,
  };
};

const getListingsByUserId = async (userId: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  // Get all listings owned by this user
  const listings = await prisma.listing.findMany({
    where: { ownerId: userId },
    include: {
      company: true,
      owner: true,
    },
  });

  return listings;
};

export const ListingService = {
  createListing,
  getListing,
  getListingsByCompany,
  updateListing,
  updateListingStatus,
  getAllListings,
  deleteListing,
  getListingsByUserId,
};
