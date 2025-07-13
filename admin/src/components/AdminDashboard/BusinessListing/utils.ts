import { Listing } from "./types";

export const filterListings = (
  listings: Listing[],
  tab: string,
  query: string
) => {
  let filtered = [...listings];

  // Filter by tab
  if (tab !== "all") {
    // Convert tab to uppercase to match API response format
    const upperTab = tab.toUpperCase();
    filtered = filtered.filter((listing) => {
      // Check both listingStatus and status fields to ensure compatibility
      const status = (
        listing.listingStatus ||
        listing.status ||
        ""
      ).toLowerCase();
      return (
        status === tab ||
        (listing.listingStatus || listing.status || "").toUpperCase() ===
          upperTab
      );
    });
  }

  // Filter by search query
  if (query) {
    const lowercaseQuery = query.toLowerCase();
    filtered = filtered.filter((listing) => {
      // Use optional chaining and nullish coalescing to safely access properties
      const title = (listing.title || listing.name || "").toLowerCase();
      const category = (listing.category || "").toLowerCase();
      const location = (listing.country || "").toLowerCase();
      const submitter = (listing.businessOwner?.fullName || "").toLowerCase();

      return (
        title.includes(lowercaseQuery) ||
        category.includes(lowercaseQuery) ||
        location.includes(lowercaseQuery) ||
        submitter.includes(lowercaseQuery)
      );
    });
  }

  return filtered;
};

export const getUniqueCategories = (listings: Listing[]) => {
  const categories = listings.map((listing) => listing.category);
  const uniqueCategories = [...new Set(categories)];
  return uniqueCategories.map((category) => ({
    label: category,
    value: category,
  }));
};

export const getUniqueLocations = (listings: Listing[]) => {
  const locations = listings.map((listing) => listing.location);
  const uniqueLocations = [...new Set(locations)];
  return uniqueLocations.map((location) => ({
    label: location,
    value: location,
  }));
};
