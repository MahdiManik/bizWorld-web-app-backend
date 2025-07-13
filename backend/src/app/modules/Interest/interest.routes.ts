import { Router } from 'express'
import { interestController } from './interest.controller'

const router = Router()

// TODO: Add authentication middleware when available

// Express interest in a listing
// POST /api/v1/interests/listings/:listingId
router.post('/listings/:listingId', interestController.expressInterest)

// Update interest status (approve/reject) - for business owners
// PATCH /api/v1/interests/:interestId/status
router.patch('/:interestId/status', interestController.updateInterestStatus)

// Get all interests for a specific listing - for business owners
// GET /api/v1/interests/listings/:listingId
router.get('/listings/:listingId', interestController.getListingInterests)

// Get user's interests - for investors
// GET /api/v1/interests/my-interests
router.get('/my-interests', interestController.getUserInterests)

// Delete interest - for investors to withdraw interest
// DELETE /api/v1/interests/:interestId
router.delete('/:interestId', interestController.deleteInterest)

export default router
