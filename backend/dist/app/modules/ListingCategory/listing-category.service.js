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
exports.ListingCategoryService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const errorHandler_1 = require("../../../middleware/error/errorHandler");
const prisma = new client_1.PrismaClient();
// All available categories from enum
const AVAILABLE_CATEGORIES = Object.values(client_1.ListingCategory);
// Create a new category - no longer supported with enum-only design
const createCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    throw new errorHandler_1.ApiError("Creating custom categories is not supported. Only predefined enum categories are allowed.", http_status_1.default.BAD_REQUEST);
});
// Get all categories from enum
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get counts for each category from the listings table
    const categoryCounts = yield Promise.all(AVAILABLE_CATEGORIES.map((categoryName) => __awaiter(void 0, void 0, void 0, function* () {
        const count = yield prisma.listing.count({
            where: { category: categoryName },
        });
        return {
            name: categoryName,
            _count: { listings: count },
        };
    })));
    return categoryCounts;
});
// Get category by name (since enums don't have IDs)
const getCategory = (categoryName) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if category exists in the enum
    if (!AVAILABLE_CATEGORIES.includes(categoryName)) {
        throw new errorHandler_1.ApiError("Category not found", http_status_1.default.NOT_FOUND);
    }
    // Get listings with this category
    const listings = yield prisma.listing.findMany({
        where: { category: categoryName },
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
});
// Update category - no longer supported with enum-only design
const updateCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    throw new errorHandler_1.ApiError("Updating categories is not supported. Only predefined enum categories are allowed.", http_status_1.default.BAD_REQUEST);
});
// Delete category - no longer supported with enum-only design
const deleteCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    throw new errorHandler_1.ApiError("Deleting categories is not supported. Only predefined enum categories are allowed.", http_status_1.default.BAD_REQUEST);
});
exports.ListingCategoryService = {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
