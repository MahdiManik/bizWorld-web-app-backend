import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import { ApiError } from "../../../middleware/error/errorHandler";
import { DocumentService, EntityType } from "../Document/document.service";

const prisma = new PrismaClient();

const createCompany = async (req: Request) => {
  const { userId } = req.params;
  const {
    name,
    logo,
    industry,
    location,
    size,
    website,
    description,
    established,
    equityOffered,
    businessType, // Add businessType field
  } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  // Validate businessType enum value if provided
  const validBusinessTypes = ['SMALL_BUSINESS', 'STARTUP', 'ENTERPRISE'];
  if (businessType && !validBusinessTypes.includes(businessType)) {
    throw new ApiError(
      `Invalid businessType. Must be one of: ${validBusinessTypes.join(', ')}`,
      httpStatus.BAD_REQUEST
    );
  }

  // Check if company already exists for this user
  const existingCompany = await prisma.company.findUnique({
    where: { userId },
    select: {
      id: true,
      name: true,
      userId: true,
    },
  });

  if (existingCompany) {
    throw new ApiError(
      "User already has a registered company",
      httpStatus.BAD_REQUEST
    );
  }

  // Create company - only include fields that exist in the Prisma schema
  const company = await prisma.company.create({
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
};

const getCompany = async (companyId: string) => {
  const company = await prisma.company.findUnique({
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
    throw new ApiError("Company not found", httpStatus.NOT_FOUND);
  }

  return company;
};

const getCompanyByUserId = async (userId: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  // Get company
  const company = await prisma.company.findUnique({
    where: { userId },
    include: {
      documents: true,
    },
  });

  if (!company) {
    throw new ApiError("Company not found for this user", httpStatus.NOT_FOUND);
  }

  return company;
};

const updateCompany = async (req: Request) => {
  const { userId } = req.params;
  const {
    name,
    logo,
    industry,
    location,
    size,
    website,
    description,
    established,
    equityOffered,
    businessType, // Add businessType field
  } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  // Validate businessType enum value if provided
  const validBusinessTypes = ['SMALL_BUSINESS', 'STARTUP', 'ENTERPRISE'];
  if (businessType && !validBusinessTypes.includes(businessType)) {
    throw new ApiError(
      `Invalid businessType. Must be one of: ${validBusinessTypes.join(', ')}`,
      httpStatus.BAD_REQUEST
    );
  }

  // Check if company exists for this user
  const existingCompany = await prisma.company.findUnique({
    where: { userId },
  });

  if (!existingCompany) {
    throw new ApiError("Company not found for this user", httpStatus.NOT_FOUND);
  }

  // Update company
  const updatedCompany = await prisma.company.update({
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
};

// updateCompanyStatus method removed as company no longer has a status field

const addDocumentToCompany = async (req: Request) => {
  const { companyId } = req.params;
  const { documentUrl, documentType } = req.body;

  // Use the shared DocumentService to add a document to the company
  return DocumentService.addDocument(EntityType.COMPANY, companyId, {
    documentUrl,
    documentType,
  });
};

const getAllCompanies = async () => {
  const companies = await prisma.company.findMany({
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
};

const deleteCompany = async (companyId: string) => {
  // Check if company exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new ApiError("Company not found", httpStatus.NOT_FOUND);
  }

  // Delete related documents first
  await prisma.document.deleteMany({
    where: { companyId },
  });

  // Delete the company
  const deletedCompany = await prisma.company.delete({
    where: { id: companyId },
  });

  return {
    message: "Company deleted successfully",
    company: deletedCompany,
  };
};

const deleteCompanyByUserId = async (userId: string) => {
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

  if (!company) {
    throw new ApiError("Company not found for this user", httpStatus.NOT_FOUND);
  }

  // Delete related documents first
  await prisma.document.deleteMany({
    where: { companyId: company.id },
  });

  // Delete the company
  const deletedCompany = await prisma.company.delete({
    where: { userId },
  });

  return {
    message: "Company deleted successfully",
    company: deletedCompany,
  };
};

const deleteCompanyDocument = async (documentId: string) => {
  // Use the shared DocumentService to delete the document
  return DocumentService.deleteDocument(documentId);
};

export const CompanyService = {
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
