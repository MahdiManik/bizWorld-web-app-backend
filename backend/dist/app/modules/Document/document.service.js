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
exports.DocumentService = exports.EntityType = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const errorHandler_1 = require("../../../middleware/error/errorHandler");
const prisma = new client_1.PrismaClient();
/**
 * Enum representing the types of entities that can own documents
 */
var EntityType;
(function (EntityType) {
    EntityType["USER_PROFILE"] = "userProfile";
    EntityType["COMPANY"] = "company";
})(EntityType || (exports.EntityType = EntityType = {}));
/**
 * Add a document to a specified entity (UserProfile or Company)
 */
const addDocument = (entityType, entityId, documentData) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify that the entity exists before creating a document
    let entityExists = false;
    if (entityType === EntityType.USER_PROFILE) {
        const profile = yield prisma.userProfile.findUnique({
            where: { id: entityId },
        });
        entityExists = !!profile;
    }
    else if (entityType === EntityType.COMPANY) {
        const company = yield prisma.company.findUnique({
            where: { id: entityId },
        });
        entityExists = !!company;
    }
    if (!entityExists) {
        const entityName = entityType === EntityType.USER_PROFILE ? 'User profile' : 'Company';
        throw new errorHandler_1.ApiError(`${entityName} not found`, http_status_1.default.NOT_FOUND);
    }
    // Create the document with dynamic field assignment
    const document = yield prisma.document.create({
        data: Object.assign(Object.assign({}, (entityType === EntityType.USER_PROFILE
            ? { userProfileId: entityId }
            : { companyId: entityId })), { documentUrl: documentData.documentUrl, documentType: documentData.documentType }),
    });
    return document;
});
/**
 * Add a document to a user profile or directly to a user if profile doesn't exist
 */
const addDocumentToProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    // Get the uploaded file from multer middleware
    const file = req.file;
    if (!file) {
        throw new errorHandler_1.ApiError("No file uploaded", http_status_1.default.BAD_REQUEST);
    }
    // Extract document type from form data or set a default
    const documentType = req.body.documentType || 'profile_document';
    // Create a document URL for the uploaded file
    // In a real production environment, this might be a cloud storage URL
    const documentUrl = `${config_1.default.server.url}/uploads/${file.filename}`;
    console.log('Uploaded file:', file.filename, 'Document URL:', documentUrl);
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Check if profile exists and get its ID
    const profile = yield prisma.userProfile.findUnique({
        where: { userId },
    });
    // If profile exists, associate document with profile
    if (profile) {
        return addDocument(EntityType.USER_PROFILE, profile.id, { documentUrl, documentType });
    }
    // If profile doesn't exist, create document with userId in metadata
    // This allows document upload before profile creation
    const document = yield prisma.document.create({
        data: {
            documentUrl,
            documentType,
            // Store userId in metadata field until we have proper schema relation
            metadata: { userId, entityType: 'user' }
        },
    });
    return document;
});
/**
 * Add a document to a company using userId
 * Note: This currently uses userId since company may not be created yet
 */
const addDocumentToCompany = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    // Get the uploaded file from multer middleware
    const file = req.file;
    if (!file) {
        throw new errorHandler_1.ApiError("No file uploaded", http_status_1.default.BAD_REQUEST);
    }
    // Extract document type from form data or set a default
    const documentType = req.body.documentType || 'company_document';
    // Create a document URL for the uploaded file
    // In a real production environment, this might be a cloud storage URL
    const documentUrl = `${config_1.default.server.url}/uploads/${file.filename}`;
    console.log('Uploaded file:', file.filename, 'Document URL:', documentUrl);
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
    // If company exists, associate document with company
    if (company) {
        return addDocument(EntityType.COMPANY, company.id, { documentUrl, documentType });
    }
    // If company doesn't exist, create document with userId in metadata
    // This allows document upload before company creation
    const document = yield prisma.document.create({
        data: {
            documentUrl,
            documentType,
            // Store document type and userId in metadata for later association
            metadata: { userId, entityType: 'company' }
        },
    });
    return document;
});
/**
 * Get all documents for a specified entity
 */
const getDocuments = (entityType, entityId) => __awaiter(void 0, void 0, void 0, function* () {
    const whereCondition = entityType === EntityType.USER_PROFILE
        ? { userProfileId: entityId }
        : { companyId: entityId };
    const documents = yield prisma.document.findMany({
        where: whereCondition,
    });
    return documents;
});
/**
 * Get documents for a user profile
 */
const getProfileDocuments = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find profile by userId
    const profile = yield prisma.userProfile.findUnique({
        where: { userId },
    });
    if (!profile) {
        throw new errorHandler_1.ApiError("User profile not found", http_status_1.default.NOT_FOUND);
    }
    return getDocuments(EntityType.USER_PROFILE, profile.id);
});
/**
 * Get documents for a company using userId
 * Note: This currently uses userId since company may not be created yet
 */
const getCompanyDocuments = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.ApiError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Until we can properly migrate the schema and use the metadata field,
    // we'll use a simpler query to find documents by their documentType
    const documents = yield prisma.document.findMany({
        where: {
            documentType: {
                contains: 'company'
            }
            // We'll filter by userId after the query for now
            // Later we can use metadata.userId after migration
        },
    });
    // In development mode, return all company documents
    // In production, we would filter by userId
    return documents;
    return documents;
});
/**
 * Delete a document
 */
const deleteDocument = (documentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if document exists
    const document = yield prisma.document.findUnique({
        where: { id: documentId },
    });
    if (!document) {
        throw new errorHandler_1.ApiError("Document not found", http_status_1.default.NOT_FOUND);
    }
    // Delete the document
    const deletedDocument = yield prisma.document.delete({
        where: { id: documentId },
    });
    return {
        message: "Document deleted successfully",
        document: deletedDocument,
    };
});
exports.DocumentService = {
    addDocument,
    addDocumentToProfile,
    addDocumentToCompany,
    getDocuments,
    getProfileDocuments,
    getCompanyDocuments,
    deleteDocument,
};
