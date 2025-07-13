"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const listing_controller_1 = require("./listing.controller");
const router = express_1.default.Router();
// Create a new listing for a company
router.post("/company/:companyId", listing_controller_1.ListingController.createListing);
// Get a specific listing by ID
router.get("/:listingId", listing_controller_1.ListingController.getListing);
// Get all listings for a specific user
router.get("/user/:userId", listing_controller_1.ListingController.getListingsByUserId);
// Get all listings for a specific company
router.get("/company/:companyId", listing_controller_1.ListingController.getListingsByCompany);
// Update a specific listing
router.patch("/:listingId", listing_controller_1.ListingController.updateListing);
// Update listing status (approve/reject)
router.patch("/:listingId/status", listing_controller_1.ListingController.updateListingStatus);
// Get all listings (with optional status filter)
router.get("/", listing_controller_1.ListingController.getAllListings);
// Delete a specific listing
router.delete("/:listingId", listing_controller_1.ListingController.deleteListing);
exports.ListingRoutes = router;
