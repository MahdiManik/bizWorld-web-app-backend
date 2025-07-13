"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userProfile_controller_1 = require("./userProfile.controller");
const fileUploadService_1 = require("../../utils/fileUploadService");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// UserProfile routes
router.post("/:userId", (0, auth_1.default)(), userProfile_controller_1.UserProfileController.createUserProfile);
router.get("/:userId", (0, auth_1.default)(), userProfile_controller_1.UserProfileController.getUserProfile);
router.patch("/:userId", (0, auth_1.default)(), userProfile_controller_1.UserProfileController.updateUserProfile);
router.delete("/:userId", (0, auth_1.default)(), userProfile_controller_1.UserProfileController.deleteUserProfile);
// Profile image upload
router.post("/:userId/image", (0, auth_1.default)(), fileUploadService_1.profileImageUpload.single('file'), userProfile_controller_1.UserProfileController.uploadProfileImage);
// Document routes
router.post("/:userId/document", (0, auth_1.default)(), userProfile_controller_1.UserProfileController.addDocumentToProfile);
router.delete("/document/:documentId", (0, auth_1.default)(), userProfile_controller_1.UserProfileController.deleteDocument);
// Admin routes
router.get("/", (0, auth_1.default)(['admin']), userProfile_controller_1.UserProfileController.getAllUserProfiles);
exports.userProfileRoutes = router;
