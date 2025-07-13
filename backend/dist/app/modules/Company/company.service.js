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
exports.CompanyService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const errorHandler_1 = require("../../../middleware/error/errorHandler");
const document_service_1 = require("../Document/document.service");
const prisma = new client_1.PrismaClient();
const createCompany = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { name, logo, industry, location, size, website, description, established, equityOffered, businessType, // Add businessType field
     } = req.body;
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Validate businessType enum value if provided
    const validBusinessTypes = ['SMALL_BUSINESS', 'STARTUP', 'ENTERPRISE'];
    if (businessType && !validBusinessTypes.includes(businessType)) {
        throw new errorHandler_1.ApiError(`Invalid businessType. Must be one of: ${validBusinessTypes.join(', ')}`, http_status_1.default.BAD_REQUEST);
    }
    // Check if company already exists for this user
    const existingCompany = yield prisma.company.findUnique({
        where: { userId },
        select: {
            id: true,
            name: true,
            userId: true,
        },
    });
    if (existingCompany) {
        throw new errorHandler_1.ApiError("User already has a registered company", http_status_1.default.BAD_REQUEST);
    }
    // Create company - only include fields that exist in the Prisma schema
    const company = yield prisma.company.create({
        data: {
            userId,
            name: name || '',
            logo: logo || null,
            industry: industry || null,
            location: location || null,
            size: size || null,
            website: website || null,
            description: description || null,
            status: "Active",
            established: established || null,
            equityOffered: equityOffered || null,
            businessType: businessType || 'SMALL_BUSINESS', // Default to SMALL_BUSINESS
        },
    });
    return company;
});
const getCompany = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield prisma.company.findUnique({
        where: { id: companyId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    status: true,
                },
            },
            documents: true,
        },
    });
    if (!company) {
        throw new errorHandler_1.ApiError("Company not found", http_status_1.default.NOT_FOUND);
    }
    return company;
});
const getCompanyByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Get company
    const company = yield prisma.company.findUnique({
        where: { userId },
        include: {
            documents: true,
        },
    });
    if (!company) {
        throw new errorHandler_1.ApiError("Company not found for this user", http_status_1.default.NOT_FOUND);
    }
    return company;
});
const updateCompany = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { name, logo, industry, location, size, website, description, established, equityOffered, businessType, // Add businessType field
     } = req.body;
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Validate businessType enum value if provided
    const validBusinessTypes = ['SMALL_BUSINESS', 'STARTUP', 'ENTERPRISE'];
    if (businessType && !validBusinessTypes.includes(businessType)) {
        throw new errorHandler_1.ApiError(`Invalid businessType. Must be one of: ${validBusinessTypes.join(', ')}`, http_status_1.default.BAD_REQUEST);
    }
    // Check if company exists for this user
    const existingCompany = yield prisma.company.findUnique({
        where: { userId },
    });
    if (!existingCompany) {
        throw new errorHandler_1.ApiError("Company not found for this user", http_status_1.default.NOT_FOUND);
    }
    // Update company
    const updatedCompany = yield prisma.company.update({
        where: { userId },
        data: {
            name,
            logo,
            industry,
            location,
            size,
            website,
            description,
            established,
            equityOffered,
            businessType, // Include businessType in update
        },
    });
    return updatedCompany;
});
// updateCompanyStatus method removed as company no longer has a status field
const addDocumentToCompany = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyId } = req.params;
    const { documentUrl, documentType } = req.body;
    // Use the shared DocumentService to add a document to the company
    return document_service_1.DocumentService.addDocument(document_service_1.EntityType.COMPANY, companyId, {
        documentUrl,
        documentType,
    });
});
const getAllCompanies = () => __awaiter(void 0, void 0, void 0, function* () {
    const companies = yield prisma.company.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    status: true,
                },
            },
            documents: true,
        },
    });
    return companies;
});
const deleteCompany = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if company exists
    const company = yield prisma.company.findUnique({
        where: { id: companyId },
    });
    if (!company) {
        throw new errorHandler_1.ApiError("Company not found", http_status_1.default.NOT_FOUND);
    }
    // Delete related documents first
    yield prisma.document.deleteMany({
        where: { companyId },
    });
    // Delete the company
    const deletedCompany = yield prisma.company.delete({
        where: { id: companyId },
    });
    return {
        message: "Company deleted successfully",
        company: deletedCompany,
    };
});
const deleteCompanyByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Check if company exists for this user
    const company = yield prisma.company.findUnique({
        where: { userId },
    });
    if (!company) {
        throw new errorHandler_1.ApiError("Company not found for this user", http_status_1.default.NOT_FOUND);
    }
    // Delete related documents first
    yield prisma.document.deleteMany({
        where: { companyId: company.id },
    });
    // Delete the company
    const deletedCompany = yield prisma.company.delete({
        where: { userId },
    });
    return {
        message: "Company deleted successfully",
        company: deletedCompany,
    };
});
const deleteCompanyDocument = (documentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Use the shared DocumentService to delete the document
    return document_service_1.DocumentService.deleteDocument(documentId);
});
exports.CompanyService = {
    createCompany,
    getCompany,
    getCompanyByUserId,
    updateCompany,
    addDocumentToCompany,
    getAllCompanies,
    deleteCompany,
    deleteCompanyByUserId,
    deleteCompanyDocument,
};
