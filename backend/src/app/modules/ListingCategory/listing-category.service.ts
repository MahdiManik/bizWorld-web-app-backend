import { PrismaClient, ListingCategory } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import { ApiError } from "../../../middleware/error/errorHandler";

const prisma = new PrismaClient();

// All available categories from enum
const AVAILABLE_CATEGORIES = Object.values(ListingCategory);

// Create a new category - no longer supported with enum-only design
const createCategory = async (req: Request) => {
  throw new ApiError(
    "Creating custom categories is not supported. Only predefined enum categories are allowed.", 
    httpStatus.BAD_REQUEST
  );
};

// Get all categories from enum
const getAllCategories = async () => {
  // Get counts for each category from the listings table
  const categoryCounts = await Promise.all(
    AVAILABLE_CATEGORIES.map(async (categoryName) => {
      const count = await prisma.listing.count({
        where: { category: categoryName },
      });

      return {
        name: categoryName,
        _count: { listings: count },
      };
    })
  );

  return categoryCounts;
};

// Get category by name (since enums don't have IDs)
const getCategory = async (categoryName: string) => {
  // Check if category exists in the enum
  if (!AVAILABLE_CATEGORIES.includes(categoryName as ListingCategory)) {
    throw new ApiError("Category not found", httpStatus.NOT_FOUND);
  }

  // Get listings with this category
  const listings = await prisma.listing.findMany({
    where: { category: categoryName as ListingCategory },
    include: {
      company: true,
      owner: true,
      financialMetric: true
    }
  });

  return {
    name: categoryName,
    listings,
    _count: { listings: listings.length }
  };
};

// Update category - no longer supported with enum-only design
const updateCategory = async (req: Request) => {
  throw new ApiError(
    "Updating categories is not supported. Only predefined enum categories are allowed.",
    httpStatus.BAD_REQUEST
  );
};

// Delete category - no longer supported with enum-only design
const deleteCategory = async (categoryId: string) => {
  throw new ApiError(
    "Deleting categories is not supported. Only predefined enum categories are allowed.",
    httpStatus.BAD_REQUEST
  );
};

export const ListingCategoryService = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
