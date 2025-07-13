import express from "express";
import { UserProfileController } from "./userProfile.controller";
import { profileImageUpload } from "../../utils/fileUploadService";
import auth from "../../middlewares/auth";

const router = express.Router();

// UserProfile routes
router.post("/:userId", auth(), UserProfileController.createUserProfile);
router.get("/:userId", auth(), UserProfileController.getUserProfile);
router.patch("/:userId", auth(), UserProfileController.updateUserProfile);
router.delete("/:userId", auth(), UserProfileController.deleteUserProfile);

// Profile image upload
router.post("/:userId/image", auth(), profileImageUpload.single('file'), UserProfileController.uploadProfileImage);

// Document routes
router.post("/:userId/document", auth(), UserProfileController.addDocumentToProfile);
router.delete("/document/:documentId", auth(), UserProfileController.deleteDocument);

// Admin routes
router.get("/", auth(['admin']), UserProfileController.getAllUserProfiles);

export const userProfileRoutes = router;
