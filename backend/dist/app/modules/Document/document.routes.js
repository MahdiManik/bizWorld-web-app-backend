"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const document_controller_1 = require("./document.controller");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = __importDefault(require("../../middlewares/upload"));
const router = express_1.default.Router();
// Profile document routes
router.post("/profile/:userId", (0, auth_1.default)(), upload_1.default.single('document'), // Add multer middleware to handle file upload
(0, catchAsync_1.default)(document_controller_1.DocumentController.addDocumentToProfile));
router.get("/profile/:userId", (0, auth_1.default)(), (0, catchAsync_1.default)(document_controller_1.DocumentController.getProfileDocuments));
// Company document routes - using userId since company isn't created yet
router.post("/company/:userId", (0, auth_1.default)(), upload_1.default.single('company-file'), // Changed field name to match frontend/Postman
(0, catchAsync_1.default)(document_controller_1.DocumentController.addDocumentToCompany));
router.get("/company/:userId", (0, auth_1.default)(), (0, catchAsync_1.default)(document_controller_1.DocumentController.getCompanyDocuments));
// Generic document routes
router.delete("/:documentId", (0, auth_1.default)(), (0, catchAsync_1.default)(document_controller_1.DocumentController.deleteDocument));
exports.DocumentRoutes = router;
