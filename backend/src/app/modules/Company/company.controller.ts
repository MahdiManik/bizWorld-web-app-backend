import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { CompanyService } from "./company.service";

const createCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyService.createCompany(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Company created successfully",
    data: result,
  });
});

const getCompany = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.params.companyId;
  const result = await CompanyService.getCompany(companyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Company retrieved successfully",
    data: result,
  });
});

const getCompanyByUserId = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await CompanyService.getCompanyByUserId(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Company retrieved successfully",
    data: result,
  });
});

const updateCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyService.updateCompany(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Company updated successfully",
    data: result,
  });
});

const updateCompanyStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyService.updateCompany(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Company status updated successfully",
    data: result,
  });
});

const addDocumentToCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyService.addDocumentToCompany(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Document added to company successfully",
    data: result,
  });
});

const getAllCompanies = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyService.getAllCompanies();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Companies retrieved successfully",
    data: result,
  });
});

const deleteCompany = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.params.companyId;
  const result = await CompanyService.deleteCompany(companyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Company deleted successfully",
    data: result,
  });
});

const deleteCompanyByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const result = await CompanyService.deleteCompanyByUserId(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Company deleted successfully",
      data: result,
    });
  }
);

const deleteCompanyDocument = catchAsync(
  async (req: Request, res: Response) => {
    const documentId = req.params.documentId;
    const result = await CompanyService.deleteCompanyDocument(documentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Company document deleted successfully",
      data: result,
    });
  }
);

export const CompanyController = {
  createCompany,
  getCompany,
  getCompanyByUserId,
  updateCompany,
  updateCompanyStatus,
  addDocumentToCompany,
  getAllCompanies,
  deleteCompany,
  deleteCompanyByUserId,
  deleteCompanyDocument,
};
