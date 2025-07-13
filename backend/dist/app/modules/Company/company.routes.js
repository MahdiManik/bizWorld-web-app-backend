"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const company_controller_1 = require("./company.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Company routes - create, read, update
router.post("/user/:userId", (0, auth_1.default)(), company_controller_1.CompanyController.createCompany);
router.get("/id/:companyId", (0, auth_1.default)(), company_controller_1.CompanyController.getCompany);
router.get("/user/:userId", (0, auth_1.default)(), company_controller_1.CompanyController.getCompanyByUserId);
router.patch("/user/:userId", (0, auth_1.default)(), company_controller_1.CompanyController.updateCompany);
// Delete operations
router.delete("/id/:companyId", (0, auth_1.default)(), company_controller_1.CompanyController.deleteCompany);
router.delete("/user/:userId", (0, auth_1.default)(), company_controller_1.CompanyController.deleteCompanyByUserId);
// Status update (admin operation)
router.patch("/id/:companyId/status", (0, auth_1.default)(['admin']), company_controller_1.CompanyController.updateCompanyStatus);
// Document operations
router.post("/id/:companyId/document", (0, auth_1.default)(), company_controller_1.CompanyController.addDocumentToCompany);
router.delete("/document/:documentId", (0, auth_1.default)(), company_controller_1.CompanyController.deleteCompanyDocument);
// List all companies (admin operation)
router.get("/", (0, auth_1.default)(['admin']), company_controller_1.CompanyController.getAllCompanies);
exports.companyRoutes = router;
