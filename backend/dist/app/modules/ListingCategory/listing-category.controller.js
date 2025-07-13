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
exports.ListingCategoryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const listing_category_service_1 = require("./listing-category.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
// Create a new category
const createCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield listing_category_service_1.ListingCategoryService.createCategory(req);
        res.status(http_status_1.default.CREATED).json({
            success: true,
            message: "Category created successfully",
            data: result,
        });
    }
    catch (error) {
        if (error.statusCode === http_status_1.default.CONFLICT) {
            res.status(http_status_1.default.CONFLICT).json({
                success: false,
                message: error.message,
            });
            return;
        }
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create category",
            error: error.message || "An unknown error occurred",
        });
    }
}));
// Get all categories
const getAllCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield listing_category_service_1.ListingCategoryService.getAllCategories();
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Categories retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve categories",
            error: error.message || "An unknown error occurred",
        });
    }
}));
// Get category by ID
const getCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        const result = yield listing_category_service_1.ListingCategoryService.getCategory(categoryId);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Category retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        if (error.statusCode === http_status_1.default.NOT_FOUND) {
            res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "Category not found",
            });
            return;
        }
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve category",
            error: error.message || "An unknown error occurred",
        });
    }
}));
// Update category
const updateCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield listing_category_service_1.ListingCategoryService.updateCategory(req);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Operation not supported with enum-based categories",
            data: null,
        });
    }
    catch (error) {
        if (error.statusCode === http_status_1.default.NOT_FOUND) {
            res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "Category not found",
            });
            return;
        }
        if (error.statusCode === http_status_1.default.CONFLICT) {
            res.status(http_status_1.default.CONFLICT).json({
                success: false,
                message: error.message,
            });
            return;
        }
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to update category",
            error: error.message || "An unknown error occurred",
        });
    }
}));
// Delete category
const deleteCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        yield listing_category_service_1.ListingCategoryService.deleteCategory(categoryId);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Operation not supported with enum-based categories",
            data: null,
        });
    }
    catch (error) {
        if (error.statusCode === http_status_1.default.NOT_FOUND) {
            res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "Category not found",
            });
            return;
        }
        if (error.statusCode === http_status_1.default.BAD_REQUEST) {
            res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: error.message,
            });
            return;
        }
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to delete category",
            error: error.message || "An unknown error occurred",
        });
    }
}));
exports.ListingCategoryController = {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
