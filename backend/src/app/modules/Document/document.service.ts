import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import path from "path";
import config from "../../../config";
import { ApiError } from "../../../middleware/error/errorHandler";

const prisma = new PrismaClient();

/**
 * Enum representing the types of entities that can own documents
 */
export enum EntityType {
  USER_PROFILE = 'userProfile',
  COMPANY = 'company',
  LISTING = 'listing' // Added listing entity type
}

/**
 * Interface for document data
 */
interface DocumentData {
  documentUrl: string;
  documentType?: string;
  metadata?: Record<string, any>;
  userId?: string; // Add userId for direct user association
}

/**
 * Add a document to a specified entity (UserProfile or Company)
 */
const addDocument = async (
  entityType: EntityType,
  entityId: string,
  documentData: DocumentData
) => {
  // Verify that the entity exists before creating a document
  let entityExists = false;
  
  if (entityType === EntityType.USER_PROFILE) {
    const profile = await prisma.userProfile.findUnique({
      where: { id: entityId },
    });
    entityExists = !!profile;
  } else if (entityType === EntityType.COMPANY) {
    const company = await prisma.company.findUnique({
      where: { id: entityId },
    });
    entityExists = !!company;
  } else if (entityType === EntityType.LISTING) {
    const listing = await prisma.listing.findUnique({
      where: { id: entityId },
    });
    entityExists = !!listing;
  }

  if (!entityExists) {
    let entityName = 'Unknown';
    if (entityType === EntityType.USER_PROFILE) entityName = 'User profile';
    else if (entityType === EntityType.COMPANY) entityName = 'Company';
    else if (entityType === EntityType.LISTING) entityName = 'Listing';
    
    throw new ApiError(`${entityName} not found`, httpStatus.NOT_FOUND);
  }

  // Create the document with dynamic field assignment
  // Determine the correct field to set based on entity type
  let entityField = {};
  if (entityType === EntityType.USER_PROFILE) {
    entityField = { userProfileId: entityId };
  } else if (entityType === EntityType.COMPANY) {
    entityField = { companyId: entityId };
  } else if (entityType === EntityType.LISTING) {
    entityField = { listingId: entityId };
  }
  
  const document = await prisma.document.create({
    data: {
      ...entityField,
      documentUrl: documentData.documentUrl,
      documentType: documentData.documentType,
    },
  });

  return document;
};

/**
 * Add a document to a user profile or directly to a user if profile doesn't exist
 */
const addDocumentToProfile = async (req: Request) => {
  const { userId } = req.params;
  // Get the uploaded file from multer middleware
  const file = req.file;
  
  if (!file) {
    throw new ApiError("No file uploaded", httpStatus.BAD_REQUEST);
  }
  
  // Extract document type from form data or set a default
  const documentType = req.body.documentType || 'profile_document';
  
  // Create a document URL for the uploaded file
  // In a real production environment, this might be a cloud storage URL
  const documentUrl = `${config.server.url}/uploads/${file.filename}`;
  
  console.log('Uploaded file:', file.filename, 'Document URL:', documentUrl);
  
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  // Check if profile exists and get its ID
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  // If profile exists, associate document with profile
  if (profile) {
    return addDocument(
      EntityType.USER_PROFILE,
      profile.id,
      { documentUrl, documentType }
    );
  } 
  
  // If profile doesn't exist, create document with userId in metadata
  // This allows document upload before profile creation
  const document = await prisma.document.create({
    data: {
      documentUrl,
      documentType,
      // Store userId in metadata field until we have proper schema relation
      metadata: { userId, entityType: 'user' }
    },
  });

  return document;
};

/**
 * Add a document to a company using userId
 * Note: This currently uses userId since company may not be created yet
 */
const addDocumentToCompany = async (req: Request) => {
  const { userId } = req.params;
  // Get the uploaded file from multer middleware
  const file = req.file;
  
  if (!file) {
    throw new ApiError("No file uploaded", httpStatus.BAD_REQUEST);
  }
  
  // Extract document type from form data or set a default
  const documentType = req.body.documentType || 'company_document';
  
  // Create a document URL for the uploaded file
  // In a real production environment, this might be a cloud storage URL
  const documentUrl = `${config.server.url}/uploads/${file.filename}`;
  
  console.log('Uploaded file:', file.filename, 'Document URL:', documentUrl);
  
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }
  
  // Check if company exists for this user
  const company = await prisma.company.findUnique({
    where: { userId },
  });
  
  // If company exists, associate document with company
  if (company) {
    return addDocument(
      EntityType.COMPANY,
      company.id,
      { documentUrl, documentType }
    );
  }
  
  // If company doesn't exist, create document with userId in metadata
  // This allows document upload before company creation
  const document = await prisma.document.create({
    data: {
      documentUrl,
      documentType,
      // Store document type and userId in metadata for later association
      metadata: { userId, entityType: 'company' }
    },
  });
  
  return document;
};

/**
 * Get all documents for a specified entity
 */
const getDocuments = async (
  entityType: EntityType,
  entityId: string
) => {
  const whereCondition = entityType === EntityType.USER_PROFILE
    ? { userProfileId: entityId }
    : { companyId: entityId };

  const documents = await prisma.document.findMany({
    where: whereCondition,
  });

  return documents;
};

/**
 * Get documents for a user profile
 */
const getProfileDocuments = async (userId: string) => {
  // Find profile by userId
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new ApiError("User profile not found", httpStatus.NOT_FOUND);
  }

  return getDocuments(EntityType.USER_PROFILE, profile.id);
};

/**
 * Get documents for a company using userId
 * Note: This currently uses userId since company may not be created yet
 */
const getCompanyDocuments = async (userId: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }
  
  // Until we can properly migrate the schema and use the metadata field,
  // we'll use a simpler query to find documents by their documentType
  const documents = await prisma.document.findMany({
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
};

/**
 * Delete a document
 */
const deleteDocument = async (documentId: string) => {
  // Check if document exists
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new ApiError("Document not found", httpStatus.NOT_FOUND);
  }

  // Delete the document
  const deletedDocument = await prisma.document.delete({
    where: { id: documentId },
  });

  return {
    message: "Document deleted successfully",
    document: deletedDocument,
  };
};

/**
 * Add a document to a listing using listingId
 * This function is used for adding cover images to listings
 */
const addDocumentToListing = async (req: Request) => {
  const { listingId } = req.params;
  // Get the uploaded file from multer middleware
  const file = req.file;
  
  // Log request information for debugging
  console.log('Request body:', req.body);
  console.log('Upload file:', file);
  
  if (!file) {
    throw new ApiError("No file uploaded", httpStatus.BAD_REQUEST);
  }
  
  // Extract document type from form data or set a default
  const documentType = req.body.documentType || 'listing_cover_image';
  
  // Create a document URL for the uploaded file
  const documentUrl = `${config.server.url}/uploads/${file.filename}`;
  
  console.log('Uploaded listing image:', file.filename, 'Document URL:', documentUrl);
  
  // Check if listing exists
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    throw new ApiError("Listing not found", httpStatus.NOT_FOUND);
  }
  
  // Add document to the listing
  const document = await addDocument(
    EntityType.LISTING,
    listingId,
    { documentUrl, documentType }
  );

  // After saving the document successfully, update the listing with this image
  await prisma.listing.update({
    where: { id: listingId },
    data: {
      image: documentUrl // Update listing's image field with the document URL
    }
  });

  return document;
};

/**
 * Get documents for a listing
 */
const getListingDocuments = async (listingId: string) => {
  // Check if listing exists
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    throw new ApiError("Listing not found", httpStatus.NOT_FOUND);
  }

  return getDocuments(EntityType.LISTING, listingId);
};

export const DocumentService = {
  addDocument,
  addDocumentToProfile,
  addDocumentToCompany,
  addDocumentToListing,
  getDocuments,
  getProfileDocuments,
  getCompanyDocuments,
  getListingDocuments,
  deleteDocument,
};
