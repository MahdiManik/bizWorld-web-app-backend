"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.deleteFile = exports.documentUpload = exports.companyLogoUpload = exports.profileImageUpload = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const errorHandler_1 = require("../../middleware/error/errorHandler");
const http_status_1 = __importDefault(require("http-status"));
const multer_1 = __importDefault(require("multer"));
// Define upload directory paths
const UPLOADS_DIR = path_1.default.join(process.cwd(), "uploads");
const PROFILE_IMAGES_DIR = path_1.default.join(UPLOADS_DIR, "profile-images");
const COMPANY_LOGOS_DIR = path_1.default.join(UPLOADS_DIR, "company-logos");
const DOCUMENTS_DIR = path_1.default.join(UPLOADS_DIR, "documents");
// Ensure directories exist
[UPLOADS_DIR, PROFILE_IMAGES_DIR, COMPANY_LOGOS_DIR, DOCUMENTS_DIR].forEach((dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
// File type validation
const fileFilter = (fileTypes) => (req, file, callback) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (fileTypes.includes(ext)) {
        return callback(null, true);
    }
    callback(new errorHandler_1.ApiError(`Only ${fileTypes.join(", ")} files are allowed`, http_status_1.default.BAD_REQUEST));
};
// Storage configuration for profile images
const profileImageStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, PROFILE_IMAGES_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${(0, uuid_1.v4)()}`;
        const ext = path_1.default.extname(file.originalname);
        cb(null, `profile-${uniqueSuffix}${ext}`);
    },
});
// Storage configuration for company logos
const companyLogoStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, COMPANY_LOGOS_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${(0, uuid_1.v4)()}`;
        const ext = path_1.default.extname(file.originalname);
        cb(null, `logo-${uniqueSuffix}${ext}`);
    },
});
// Storage configuration for documents
const documentStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, DOCUMENTS_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${(0, uuid_1.v4)()}`;
        const ext = path_1.default.extname(file.originalname);
        cb(null, `doc-${uniqueSuffix}${ext}`);
    },
});
// Multer configurations
exports.profileImageUpload = (0, multer_1.default)({
    storage: profileImageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max size
    },
    fileFilter: fileFilter([".jpg", ".jpeg", ".png"]),
});
exports.companyLogoUpload = (0, multer_1.default)({
    storage: companyLogoStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max size
    },
    fileFilter: fileFilter([".jpg", ".jpeg", ".png", ".svg"]),
});
exports.documentUpload = (0, multer_1.default)({
    storage: documentStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max size
    },
    fileFilter: fileFilter([
        ".pdf",
        ".doc",
        ".docx",
        ".txt",
        ".jpg",
        ".jpeg",
        ".png",
    ]),
});
// Helper functions for file management
const deleteFile = (filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            return true;
        }
        return false;
    }
    catch (error) {
        // Using type guard for error handling
        const err = error;
        console.error("Error deleting file:", err.message);
        return false;
    }
};
exports.deleteFile = deleteFile;
// Get public URL for a file
const getFileUrl = (filePath) => {
    // Check if input is valid
    if (!filePath) {
        return "";
    }
    // Extract the relative path from the full path
    const parts = filePath.split("uploads");
    if (parts.length < 2) {
        return "";
    }
    const relativePath = parts[1];
    // Replace backslashes with forward slashes for URL
    const formattedPath = relativePath.replace(/\\/g, "/");
    // Construct and return the URL
    return `/uploads${formattedPath}`;
};
exports.getFileUrl = getFileUrl;
