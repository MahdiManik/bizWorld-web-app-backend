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
exports.interestController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const interest_service_1 = require("./interest.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const errorHandler_1 = require("../../../middleware/error/errorHandler");
// Express interest in a listing
const expressInterest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interest = yield interest_service_1.interestService.expressInterest(req);
        res.status(http_status_1.default.CREATED).json({
            success: true,
            message: 'Interest expressed successfully',
            data: interest
        });
    }
    catch (error) {
        console.error('Error in expressInterest controller:', error);
        if (error instanceof errorHandler_1.ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to express interest',
            error: error.message || 'An unknown error occurred'
        });
    }
}));
// Update interest status (approve/reject)
const updateInterestStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedInterest = yield interest_service_1.interestService.updateInterestStatus(req);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: 'Interest status updated successfully',
            data: updatedInterest
        });
    }
    catch (error) {
        console.error('Error in updateInterestStatus controller:', error);
        if (error instanceof errorHandler_1.ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to update interest status',
            error: error.message || 'An unknown error occurred'
        });
    }
}));
// Get all interests for a specific listing
const getListingInterests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const interests = yield interest_service_1.interestService.getListingInterests(req);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Listing interests retrieved successfully',
        data: interests
    });
}));
// Get user's interests
const getUserInterests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const interests = yield interest_service_1.interestService.getUserInterests(req);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'User interests retrieved successfully',
        data: interests
    });
}));
// Delete interest
const deleteInterest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield interest_service_1.interestService.deleteInterest(req);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Interest deleted successfully',
        data: result
    });
}));
exports.interestController = {
    expressInterest,
    updateInterestStatus,
    getListingInterests,
    getUserInterests,
    deleteInterest
};
