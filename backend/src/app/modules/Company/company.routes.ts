import express from "express";
import { CompanyController } from "./company.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// Company routes - create, read, update
router.post("/user/:userId", auth(), CompanyController.createCompany);
router.get("/id/:companyId", auth(), CompanyController.getCompany);
router.get("/user/:userId", auth(), CompanyController.getCompanyByUserId);
router.patch("/user/:userId", auth(), CompanyController.updateCompany);

// Delete operations
router.delete("/id/:companyId", auth(), CompanyController.deleteCompany);
router.delete("/user/:userId", auth(), CompanyController.deleteCompanyByUserId);

// Status update (admin operation)
router.patch("/id/:companyId/status", auth(['admin']), CompanyController.updateCompanyStatus);

// Document operations
router.post("/id/:companyId/document", auth(), CompanyController.addDocumentToCompany);
router.delete("/document/:documentId", auth(), CompanyController.deleteCompanyDocument);

// List all companies (admin operation)
router.get("/", auth(['admin']), CompanyController.getAllCompanies);

export const companyRoutes = router;
