import React from "react";
import {
  FaEye,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaCheck,
  FaRegImage,
} from "react-icons/fa";
import { Listing } from "./types";
import { MdOutlineMargin } from "react-icons/md";
import { BusinessListingService } from "@/services/businesslisting.services";

interface GridViewProps {
  listings: Listing[];
  handleViewDetails: (listing: Listing) => void;
  // Optional callback to refresh listings after status update
  refreshListings?: () => void;
}

const GridView: React.FC<GridViewProps> = ({
  listings,
  handleViewDetails,
  refreshListings,
}) => {
  // Function to handle approving a listing
  const handleApproveListing = async (listingId: string) => {
    try {
      // Call the service to update the listing status
      await BusinessListingService.updateListing(listingId, {
        listingStatus: "APPROVED",
      });
      console.log(`Listing ${listingId} approved successfully`);

      // Refresh the listings if callback provided
      if (refreshListings) {
        refreshListings();
      }
    } catch (error) {
      console.error(`Error approving listing ${listingId}:`, error);
    }
  };
  if (listings.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg">No results found</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[620px]"
        >
          <div className="relative">
            <div className="h-80 bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400">
                <FaRegImage className="h-12 w-12" />
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  (listing.listingStatus || "").toLowerCase() === "pending" ||
                  (listing.listingStatus || "").toUpperCase() === "PENDING"
                    ? "bg-[#F59E0B] text-white"
                    : (listing.listingStatus || "").toLowerCase() ===
                        "approved" ||
                      (listing.listingStatus || "").toUpperCase() === "APPROVED"
                    ? "bg-[#167F60] text-white"
                    : "bg-[#EF4444] text-white"
                }`}
              >
                {typeof listing.listingStatus === "string"
                  ? listing.listingStatus.charAt(0).toUpperCase() +
                    listing.listingStatus.toLowerCase().slice(1)
                  : "Pending"}
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-2">
                {listing.title || listing.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {listing.description || "No description available"}
              </p>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 flex items-center">
                  <MdOutlineMargin className="mr-2 text-gray-400" />
                  {listing.category}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  {listing.country}
                </p>
                {listing.businessOwner && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaUser className="mr-2 text-gray-400" />
                    {listing.businessOwner?.fullName}
                  </p>
                )}
                {(listing.createdAt || listing.date) && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    Submitted on{" "}
                    {
                      new Date(listing.createdAt || listing.date || "")
                        .toISOString()
                        .split("T")[0]
                    }
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center w-full mt-auto">
              {(listing.listingStatus || "").toLowerCase() === "pending" ||
              (listing.listingStatus || "").toUpperCase() === "PENDING" ? (
                <div className="flex justify-between items-center gap-5 w-full">
                  <button
                    onClick={() => handleViewDetails(listing)}
                    className="flex items-center justify-center p-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors w-full cursor-pointer"
                  >
                    <FaEye className="mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => {
                      if (listing.documentId) {
                        handleApproveListing(listing.documentId);
                      }
                    }}
                    className="flex items-center justify-center gap-2 p-2 bg-[#0F172A] text-white rounded-md w-full cursor-pointer"
                  >
                    <FaCheck />
                    Approve
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleViewDetails(listing)}
                  className="flex items-center justify-center p-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors w-full cursor-pointer"
                >
                  <FaEye className="mr-1" />
                  Preview
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridView;
