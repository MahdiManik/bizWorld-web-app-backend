import express from "express";
import { ListingCategoryController } from "./listing-category.controller";

const router = express.Router();

// Create a new category
router.post("/", ListingCategoryController.createCategory);

// Get all categories
router.get("/", ListingCategoryController.getAllCategories);

// Get a specific category by ID with its listings
router.get("/:categoryId", ListingCategoryController.getCategory);

// Update a specific category
router.patch("/:categoryId", ListingCategoryController.updateCategory);

// Delete a specific category
router.delete("/:categoryId", ListingCategoryController.deleteCategory);

export const ListingCategoryRoutes = router;
