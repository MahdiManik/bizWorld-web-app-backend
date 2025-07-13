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
exports.ListingController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const listing_service_1 = require("./listing.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const createListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Assuming req.body has been validated as CreateListingDto
    const body = req.body;
    // Get user ID from auth middleware depending on your setup
    // Adjust according to your actual auth implementation
    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.body.ownerId;
    try {
        const result = yield listing_service_1.ListingService.createListing(req);
        res.status(http_status_1.default.CREATED).json({
            success: true,
            message: "Listing created successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error creating listing:", error);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create listing",
            error: error.message || 'An unknown error occurred',
        });
    }
}));
const getListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { listingId } = req.params;
    try {
        const result = yield listing_service_1.ListingService.getListing(listingId);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Listing retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        if (error.statusCode === http_status_1.default.NOT_FOUND) {
            res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "Listing not found",
            });
            return;
        }
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve listing",
            error: error.message || 'An unknown error occurred',
        });
    }
}));
const getListingsByCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyId } = req.params;
    const result = yield listing_service_1.ListingService.getListingsByCompany(companyId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Listings retrieved successfully",
        data: result,
    });
}));
const updateListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listing_service_1.ListingService.updateListing(req);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Listing updated successfully",
        data: result,
    });
}));
const updateListingStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listing_service_1.ListingService.updateListingStatus(req);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Listing status updated successfully",
        data: result,
    });
}));
const getAllListings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Cast query params to filter DTO
    const filters = {
        status: req.query.status,
        categoryId: req.query.categoryId
    };
    console.log('Received listing request with filters:', filters);
    try {
        const result = yield listing_service_1.ListingService.getAllListings(filters.status, filters.categoryId);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "All listings retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error retrieving listings:", error);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve listings",
            error: error.message || 'An unknown error occurred',
        });
    }
}));
const deleteListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { listingId } = req.params;
    const result = yield listing_service_1.ListingService.deleteListing(listingId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: result.message,
        data: result.listing,
    });
}));
const getListingsByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield listing_service_1.ListingService.getListingsByUserId(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "User's listings retrieved successfully",
        data: result,
    });
}));
exports.ListingController = {
    createListing,
    getListing,
    getListingsByCompany,
    updateListing,
    updateListingStatus,
    getAllListings,
    deleteListing,
    getListingsByUserId,
};
