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
exports.DocumentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const document_service_1 = require("./document.service");
/**
 * Add a document to a user profile
 */
const addDocumentToProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield document_service_1.DocumentService.addDocumentToProfile(req);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "Document added successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error in addDocumentToProfile:", error);
        throw error;
    }
});
/**
 * Add a document to a company
 */
const addDocumentToCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield document_service_1.DocumentService.addDocumentToCompany(req);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "Document added successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error in addDocumentToCompany:", error);
        throw error;
    }
});
/**
 * Get documents for a user profile
 */
const getProfileDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield document_service_1.DocumentService.getProfileDocuments(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Documents retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error in getProfileDocuments:", error);
        throw error;
    }
});
/**
 * Get documents for a company using userId
 * Note: This currently uses userId since company may not be created yet
 */
const getCompanyDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield document_service_1.DocumentService.getCompanyDocuments(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Documents retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error in getCompanyDocuments:", error);
        throw error;
    }
});
/**
 * Delete a document
 */
const deleteDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documentId } = req.params;
        const result = yield document_service_1.DocumentService.deleteDocument(documentId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Document deleted successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error in deleteDocument:", error);
        throw error;
    }
});
exports.DocumentController = {
    addDocumentToProfile,
    addDocumentToCompany,
    getProfileDocuments,
    getCompanyDocuments,
    deleteDocument,
};
