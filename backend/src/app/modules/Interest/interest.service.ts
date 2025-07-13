import { Request } from 'express'
import { PrismaClient } from '@prisma/client'
import { ApiError } from '../../../middleware/error/errorHandler'
import httpStatus from 'http-status'

const prisma = new PrismaClient()

// Create or update interest in a listing
const expressInterest = async (req: Request) => {
  const { listingId } = req.params
  const { message } = req.body
  const userId = req.user?.userId

  if (!userId) {
    throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED)
  }

  if (!listingId) {
    throw new ApiError('Listing ID is required', httpStatus.BAD_REQUEST)
  }

  try {
    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { owner: true }
    })

    if (!listing) {
      throw new ApiError('Listing not found', httpStatus.NOT_FOUND)
    }

    // Check if user is trying to express interest in their own listing
    if (listing.ownerId === userId) {
      throw new ApiError('Cannot express interest in your own listing', httpStatus.BAD_REQUEST)
    }

    // Check if interest already exists
    const existingInterest = await prisma.listingInterest.findUnique({
      where: {
        listingId_userId: {
          listingId,
          userId
        }
      }
    })

    if (existingInterest) {
      throw new ApiError('You have already expressed interest in this listing', httpStatus.BAD_REQUEST)
    }

    // Create new interest
    const interest = await prisma.listingInterest.create({
      data: {
        listingId,
        userId,
        message: message || null,
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        listing: {
          select: {
            id: true,
            title: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return interest
  } catch (error) {
    console.error('Error expressing interest:', error)
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Failed to express interest', httpStatus.INTERNAL_SERVER_ERROR)
  }
}

// Update interest status (for business owners)
const updateInterestStatus = async (req: Request) => {
  const { interestId } = req.params
  const { status } = req.body
  const userId = req.user?.userId

  if (!userId) {
    throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED)
  }

  if (!interestId) {
    throw new ApiError('Interest ID is required', httpStatus.BAD_REQUEST)
  }

  if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
    throw new ApiError('Valid status is required (APPROVED or REJECTED)', httpStatus.BAD_REQUEST)
  }

  try {
    // Find the interest and verify ownership
    const interest = await prisma.listingInterest.findUnique({
      where: { id: interestId },
      include: {
        listing: {
          include: {
            owner: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!interest) {
      throw new ApiError('Interest not found', httpStatus.NOT_FOUND)
    }

    // Check if the current user is the owner of the listing
    if (interest.listing.ownerId !== userId) {
      throw new ApiError('Only the listing owner can update interest status', httpStatus.FORBIDDEN)
    }

    // Update the interest status
    const updatedInterest = await prisma.listingInterest.update({
      where: { id: interestId },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        listing: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return updatedInterest
  } catch (error) {
    console.error('Error updating interest status:', error)
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Failed to update interest status', httpStatus.INTERNAL_SERVER_ERROR)
  }
}

// Get interests for a specific listing (for business owners)
const getListingInterests = async (req: Request) => {
  const { listingId } = req.params
  const userId = req.user?.userId

  if (!userId) {
    throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED)
  }

  try {
    // Verify listing ownership
    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    })

    if (!listing) {
      throw new ApiError('Listing not found', httpStatus.NOT_FOUND)
    }

    if (listing.ownerId !== userId) {
      throw new ApiError('Only the listing owner can view interests', httpStatus.FORBIDDEN)
    }

    // Get all interests for this listing
    const interests = await prisma.listingInterest.findMany({
      where: { listingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                imageUrl: true,
                professionalHeadline: true,
                industrySpecialization: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return interests
  } catch (error) {
    console.error('Error getting listing interests:', error)
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Failed to get listing interests', httpStatus.INTERNAL_SERVER_ERROR)
  }
}

// Get user's interests (for investors)
const getUserInterests = async (req: Request) => {
  const userId = req.user?.userId

  if (!userId) {
    throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED)
  }

  try {
    const interests = await prisma.listingInterest.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            company: {
              select: {
                name: true,
                logo: true,
                industry: true,
                location: true
              }
            },
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return interests
  } catch (error) {
    console.error('Error getting user interests:', error)
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Failed to get user interests', httpStatus.INTERNAL_SERVER_ERROR)
  }
}

// Delete interest (for investors to withdraw interest)
const deleteInterest = async (req: Request) => {
  const { interestId } = req.params
  const userId = req.user?.userId

  if (!userId) {
    throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED)
  }

  try {
    // Find the interest and verify ownership
    const interest = await prisma.listingInterest.findUnique({
      where: { id: interestId }
    })

    if (!interest) {
      throw new ApiError('Interest not found', httpStatus.NOT_FOUND)
    }

    // Check if the current user owns this interest
    if (interest.userId !== userId) {
      throw new ApiError('You can only delete your own interests', httpStatus.FORBIDDEN)
    }

    // Delete the interest
    await prisma.listingInterest.delete({
      where: { id: interestId }
    })

    return { message: 'Interest deleted successfully' }
  } catch (error) {
    console.error('Error deleting interest:', error)
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Failed to delete interest', httpStatus.INTERNAL_SERVER_ERROR)
  }
}

export const interestService = {
  expressInterest,
  updateInterestStatus,
  getListingInterests,
  getUserInterests,
  deleteInterest
}
