/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import { ListingCategoryService } from "./listing-category.service";
import catchAsync from "../../shared/catchAsync";

// Create a new category
const createCategory = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await ListingCategoryService.createCategory(req);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.statusCode === httpStatus.CONFLICT) {
      res.status(httpStatus.CONFLICT).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create category",
      error: error.message || "An unknown error occurred",
    });
  }
});

// Get all categories
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await ListingCategoryService.getAllCategories();
    res.status(httpStatus.OK).json({
      success: true,
      message: "Categories retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve categories",
      error: error.message || "An unknown error occurred",
    });
  }
});

// Get category by ID
const getCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const result = await ListingCategoryService.getCategory(categoryId);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Category retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.statusCode === httpStatus.NOT_FOUND) {
      res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve category",
      error: error.message || "An unknown error occurred",
    });
  }
});

// Update category
const updateCategory = catchAsync(async (req: Request, res: Response) => {
  try {
    await ListingCategoryService.updateCategory(req);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Operation not supported with enum-based categories",
      data: null,
    });
  } catch (error: any) {
    if (error.statusCode === httpStatus.NOT_FOUND) {
      res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    if (error.statusCode === httpStatus.CONFLICT) {
      res.status(httpStatus.CONFLICT).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update category",
      error: error.message || "An unknown error occurred",
    });
  }
});

// Delete category
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    await ListingCategoryService.deleteCategory(categoryId);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Operation not supported with enum-based categories",
      data: null,
    });
  } catch (error: any) {
    if (error.statusCode === httpStatus.NOT_FOUND) {
      res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    if (error.statusCode === httpStatus.BAD_REQUEST) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete category",
      error: error.message || "An unknown error occurred",
    });
  }
});

export const ListingCategoryController = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
