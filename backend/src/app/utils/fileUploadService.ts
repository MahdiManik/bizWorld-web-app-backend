import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { ApiError } from "../../middleware/error/errorHandler";
import httpStatus from "http-status";
import multer, { FileFilterCallback } from "multer";

// Define upload directory paths
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const PROFILE_IMAGES_DIR = path.join(UPLOADS_DIR, "profile-images");
const COMPANY_LOGOS_DIR = path.join(UPLOADS_DIR, "company-logos");
const DOCUMENTS_DIR = path.join(UPLOADS_DIR, "documents");

// Ensure directories exist
[UPLOADS_DIR, PROFILE_IMAGES_DIR, COMPANY_LOGOS_DIR, DOCUMENTS_DIR].forEach(
  (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
);

// File type validation
const fileFilter =
  (fileTypes: string[]) =>
  (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (fileTypes.includes(ext)) {
      return callback(null, true);
    }

    callback(
      new ApiError(
        `Only ${fileTypes.join(", ")} files are allowed`,
        httpStatus.BAD_REQUEST
      )
    );
  };

// Storage configuration for profile images
const profileImageStorage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, PROFILE_IMAGES_DIR);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const ext = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${ext}`);
  },
});

// Storage configuration for company logos
const companyLogoStorage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, COMPANY_LOGOS_DIR);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const ext = path.extname(file.originalname);
    cb(null, `logo-${uniqueSuffix}${ext}`);
  },
});

// Storage configuration for documents
const documentStorage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, DOCUMENTS_DIR);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

// Multer configurations
export const profileImageUpload = multer({
  storage: profileImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size
  },
  fileFilter: fileFilter([".jpg", ".jpeg", ".png"]),
});

export const companyLogoUpload = multer({
  storage: companyLogoStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size
  },
  fileFilter: fileFilter([".jpg", ".jpeg", ".png", ".svg"]),
});

export const documentUpload = multer({
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
export const deleteFile = (filePath: string): boolean => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    // Using type guard for error handling
    const err = error as Error;
    console.error("Error deleting file:", err.message);
    return false;
  }
};

// Get public URL for a file
export const getFileUrl = (filePath: string): string => {
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
