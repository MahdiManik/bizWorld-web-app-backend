import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { DocumentService } from "./document.service";
import { ApiError } from "../../shared/ApiError";

/**
 * Add a document to a user profile
 */
const addDocumentToProfile = async (req: Request, res: Response) => {
  try {
    const result = await DocumentService.addDocumentToProfile(req);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Document added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in addDocumentToProfile:", error);
    throw error;
  }
};

/**
 * Add a document to a company
 */
const addDocumentToCompany = async (req: Request, res: Response) => {
  try {
    const result = await DocumentService.addDocumentToCompany(req);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Document added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in addDocumentToCompany:", error);
    throw error;
  }
};

/**
 * Get documents for a user profile
 */
const getProfileDocuments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await DocumentService.getProfileDocuments(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Documents retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in getProfileDocuments:", error);
    throw error;
  }
};

/**
 * Get documents for a company using userId
 * Note: This currently uses userId since company may not be created yet
 */
const getCompanyDocuments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await DocumentService.getCompanyDocuments(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Documents retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in getCompanyDocuments:", error);
    throw error;
  }
};

/**
 * Delete a document
 */
const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const result = await DocumentService.deleteDocument(documentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Document deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in deleteDocument:", error);
    throw error;
  }
};

/**
 * Add a document to a listing (cover image)
 */
const addDocumentToListing = async (req: Request, res: Response) => {
  try {
    const result = await DocumentService.addDocumentToListing(req);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Listing cover image added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in addDocumentToListing:", error);
    throw error;
  }
};

export const DocumentController = {
  addDocumentToProfile,
  addDocumentToCompany,
  getProfileDocuments,
  getCompanyDocuments,
  deleteDocument,
  addDocumentToListing,
};
