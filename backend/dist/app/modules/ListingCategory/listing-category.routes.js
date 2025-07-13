"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingCategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const listing_category_controller_1 = require("./listing-category.controller");
const router = express_1.default.Router();
// Create a new category
router.post("/", listing_category_controller_1.ListingCategoryController.createCategory);
// Get all categories
router.get("/", listing_category_controller_1.ListingCategoryController.getAllCategories);
// Get a specific category by ID with its listings
router.get("/:categoryId", listing_category_controller_1.ListingCategoryController.getCategory);
// Update a specific category
router.patch("/:categoryId", listing_category_controller_1.ListingCategoryController.updateCategory);
// Delete a specific category
router.delete("/:categoryId", listing_category_controller_1.ListingCategoryController.deleteCategory);
exports.ListingCategoryRoutes = router;
