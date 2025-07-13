"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interest_controller_1 = require("./interest.controller");
const router = (0, express_1.Router)();
// TODO: Add authentication middleware when available
// Express interest in a listing
// POST /api/v1/interests/listings/:listingId
router.post('/listings/:listingId', interest_controller_1.interestController.expressInterest);
// Update interest status (approve/reject) - for business owners
// PATCH /api/v1/interests/:interestId/status
router.patch('/:interestId/status', interest_controller_1.interestController.updateInterestStatus);
// Get all interests for a specific listing - for business owners
// GET /api/v1/interests/listings/:listingId
router.get('/listings/:listingId', interest_controller_1.interestController.getListingInterests);
// Get user's interests - for investors
// GET /api/v1/interests/my-interests
router.get('/my-interests', interest_controller_1.interestController.getUserInterests);
// Delete interest - for investors to withdraw interest
// DELETE /api/v1/interests/:interestId
router.delete('/:interestId', interest_controller_1.interestController.deleteInterest);
exports.default = router;
