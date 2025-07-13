import express from "express";
import { ListingController } from "./listing.controller";

const router = express.Router();

// Create a new listing for a company
router.post("/company/:companyId", ListingController.createListing);

// Get a specific listing by ID
router.get("/:listingId", ListingController.getListing);

// Get all listings for a specific user
router.get("/user/:userId", ListingController.getListingsByUserId);

// Get all listings for a specific company
router.get("/company/:companyId", ListingController.getListingsByCompany);

// Update a specific listing
router.patch("/:listingId", ListingController.updateListing);

// Update listing status (approve/reject)
router.patch("/:listingId/status", ListingController.updateListingStatus);

// Get all listings (with optional status filter)
router.get("/", ListingController.getAllListings);

// Delete a specific listing
router.delete("/:listingId", ListingController.deleteListing);

export const ListingRoutes = router;
