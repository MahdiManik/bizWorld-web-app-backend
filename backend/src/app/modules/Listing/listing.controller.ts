/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import { ListingService } from "./listing.service";
import catchAsync from "../../shared/catchAsync";
import { CreateListingDto, UpdateListingDto, ListingFilterDto } from "../../../shared-types/listing.dto";

const createListing = catchAsync(async (req: Request, res: Response) => {
  // Assuming req.body has been validated as CreateListingDto
  const body = req.body as CreateListingDto;
  
  // Get user ID from auth middleware depending on your setup
  // Adjust according to your actual auth implementation
  const userId = (req as any).user?.id || req.body.ownerId;
  
  try {
    const result = await ListingService.createListing(req);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Listing created successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error creating listing:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create listing",
      error: error.message || 'An unknown error occurred',
    });
  }
});

const getListing = catchAsync(async (req: Request, res: Response) => {
  const { listingId } = req.params;
  try {
    const result = await ListingService.getListing(listingId);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Listing retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.statusCode === httpStatus.NOT_FOUND) {
      res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Listing not found",
      });
      return;
    }
    
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve listing",
      error: error.message || 'An unknown error occurred',
    });
  }
});

const getListingsByCompany = catchAsync(async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const result = await ListingService.getListingsByCompany(companyId);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Listings retrieved successfully",
    data: result,
  });
});

const updateListing = catchAsync(async (req: Request, res: Response) => {
  const result = await ListingService.updateListing(req);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Listing updated successfully",
    data: result,
  });
});

const updateListingStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await ListingService.updateListingStatus(req);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Listing status updated successfully",
    data: result,
  });
});

const getAllListings = catchAsync(async (req: Request, res: Response) => {
  // Cast query params to filter DTO
  const filters: ListingFilterDto = {
    status: req.query.status as string,
    categoryId: req.query.categoryId as string
  };
  
  console.log('Received listing request with filters:', filters);
  
  try {
    const result = await ListingService.getAllListings(
      filters.status as any, 
      filters.categoryId
    );
    
    res.status(httpStatus.OK).json({
      success: true,
      message: "All listings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error retrieving listings:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve listings",
      error: error.message || 'An unknown error occurred',
    });
  }
});

const deleteListing = catchAsync(async (req: Request, res: Response) => {
  const { listingId } = req.params;
  const result = await ListingService.deleteListing(listingId);
  res.status(httpStatus.OK).json({
    success: true,
    message: result.message,
    data: result.listing,
  });
});

const getListingsByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await ListingService.getListingsByUserId(userId);
  res.status(httpStatus.OK).json({
    success: true,
    message: "User's listings retrieved successfully",
    data: result,
  });
});

export const ListingController = {
  createListing,
  getListing,
  getListingsByCompany,
  updateListing,
  updateListingStatus,
  getAllListings,
  deleteListing,
  getListingsByUserId,
};
