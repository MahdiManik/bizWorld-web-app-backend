import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { interestService } from './interest.service'
import catchAsync from '../../shared/catchAsync'
import { ApiError } from '../../../middleware/error/errorHandler'

// Express interest in a listing
const expressInterest = catchAsync(async (req: Request, res: Response) => {
  try {
    const interest = await interestService.expressInterest(req)

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Interest expressed successfully',
      data: interest
    })
  } catch (error: any) {
    console.error('Error in expressInterest controller:', error)

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      })
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to express interest',
      error: error.message || 'An unknown error occurred'
    })
  }
})

// Update interest status (approve/reject)
const updateInterestStatus = catchAsync(async (req: Request, res: Response) => {
  try {
    const updatedInterest = await interestService.updateInterestStatus(req)

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Interest status updated successfully',
      data: updatedInterest
    })
  } catch (error: any) {
    console.error('Error in updateInterestStatus controller:', error)

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      })
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update interest status',
      error: error.message || 'An unknown error occurred'
    })
  }
})

// Get all interests for a specific listing
const getListingInterests = catchAsync(async (req: Request, res: Response) => {
  const interests = await interestService.getListingInterests(req)

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Listing interests retrieved successfully',
    data: interests
  })
})

// Get user's interests
const getUserInterests = catchAsync(async (req: Request, res: Response) => {
  const interests = await interestService.getUserInterests(req)

  res.status(httpStatus.OK).json({
    success: true,
    message: 'User interests retrieved successfully',
    data: interests
  })
})

// Delete interest
const deleteInterest = catchAsync(async (req: Request, res: Response) => {
  const result = await interestService.deleteInterest(req)

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Interest deleted successfully',
    data: result
  })
})

export const interestController = {
  expressInterest,
  updateInterestStatus,
  getListingInterests,
  getUserInterests,
  deleteInterest
}
