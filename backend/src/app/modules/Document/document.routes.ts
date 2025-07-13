import express from "express";
import { DocumentController } from "./document.controller";
import catchAsync from "../../shared/catchAsync";
import auth from "../../middlewares/auth";
import upload from "../../middlewares/upload";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup a more direct multer config for troubleshooting
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const directStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const directUpload = multer({ storage: directStorage });

const router = express.Router();

// Profile document routes
router.post(
  "/profile/:userId",
  auth(),
  upload.single("document"), // Add multer middleware to handle file upload
  catchAsync(DocumentController.addDocumentToProfile)
);

router.get(
  "/profile/:userId",
  auth(),
  catchAsync(DocumentController.getProfileDocuments)
);

// Company document routes - using userId since company isn't created yet
router.post(
  "/company/:userId",
  auth(),
  upload.single("company-file"), // Changed field name to match frontend/Postman
  catchAsync(DocumentController.addDocumentToCompany)
);

router.get(
  "/company/:userId",
  auth(),
  catchAsync(DocumentController.getCompanyDocuments)
);

// Listing document routes
router.post(
  "/listing/:listingId",
  auth(),
  upload.single("image"), // ✅ use the multer instance you configured
  catchAsync(DocumentController.addDocumentToListing)
);

// Generic document routes
router.delete(
  "/:documentId",
  auth(),
  catchAsync(DocumentController.deleteDocument)
);

export const DocumentRoutes = router;
