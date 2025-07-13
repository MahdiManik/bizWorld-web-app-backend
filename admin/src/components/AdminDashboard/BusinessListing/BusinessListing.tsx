/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useImmerReducer } from "use-immer";
import BusinessListingSkeleton from "@/components/Skeletons/BusinessListingSkeleton";
import {
  BusinessListingService,
  Listing as ListingType,
} from "@/services/businesslisting.services";

// Import our modular components
import { reducer } from "./reducer";
import { filterListings } from "./utils";
import { State, Action } from "./types";

// Use the Listing type from our service
import ListingTabs from "./ListingTabs";
import GridView from "./GridView";
import SearchFilter from "./SearchFilter";
import TableView from "./TableView";

export default function ListingDashboard() {
  const router = useRouter();
  const itemsPerPage = 14;

  const [state, dispatch] = useImmerReducer<State, Action>(reducer, {
    listings: [],
    filteredListings: [],
    activeTab: "pending",
    searchQuery: "",
    viewMode: "grid",
    currentPage: 1,
    selectedRows: [],
    selectAll: false,
    isLoading: true,
    activeFilters: {},
    country: "",
    businessOwner: "",
  });

  // Define fetchData function at component level so it can be passed to child components
  const fetchData = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const data = await BusinessListingService.getListings();
      const compatibleData = data.map((listing: any) => ({
        ...listing,
        id: listing.id || "",
        name: listing.name || "",
        category: listing.category || "",
        country: listing.country || "",
        listingStatus: listing.listingStatus || "PENDING",
      }));

      dispatch({ type: "SET_LISTINGS", payload: compatibleData });

      // Apply initial filtering
      const filtered = filterListings(
        compatibleData,
        state.activeTab,
        state.searchQuery
      );
      dispatch({ type: "SET_FILTERED_LISTINGS", payload: filtered });
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Fetch data only once on component mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // Only run on mount

  // Handle filtering separately when tab or search query changes
  useEffect(() => {
    // Only filter if we have listings data
    if (state.listings.length > 0) {
      const filtered = filterListings(
        state.listings,
        state.activeTab,
        state.searchQuery
      );
      dispatch({ type: "SET_FILTERED_LISTINGS", payload: filtered });
    }
  }, [state.activeTab, state.searchQuery, state.listings, dispatch]);

  useEffect(() => {
    // Reset selected rows when page changes
    dispatch({ type: "SET_SELECTED_ROWS", payload: [] });
    dispatch({ type: "TOGGLE_SELECT_ALL" });
  }, [state.currentPage, dispatch]);

  const handleTabChange = (tab: string) => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: tab });
    const filtered = filterListings(state.listings, tab, state.searchQuery);
    dispatch({ type: "SET_FILTERED_LISTINGS", payload: filtered });
    dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
  };

  const getPaginatedData = () => {
    const indexOfLastItem = state.currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = state.filteredListings.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    const totalPages = Math.ceil(state.filteredListings.length / itemsPerPage);
    return { currentItems, totalPages };
  };

  const handleViewDetails = (listing: ListingType) => {
    router.push(`/business-listings/view-details?id=${listing.id}`);
  };

  return (
    <div className="">
      {state.isLoading ? (
        <BusinessListingSkeleton />
      ) : (
        <>
          {/* Tabs and View Mode Selector */}
          <ListingTabs
            activeTab={state.activeTab}
            viewMode={state.viewMode}
            handleTabChange={handleTabChange}
            dispatch={dispatch}
          />

          {/* Search and Filter - Only shown in grid view */}
          {state.viewMode === "grid" && (
            <div className="sticky top-[50px] z-50 bg-[#F9FAFB]">
              <SearchFilter
                searchTerm={state.searchQuery}
                activeTab={state.activeTab}
                listings={state.listings}
                activeFilters={state.activeFilters}
                dispatch={dispatch}
              />
            </div>
          )}

          {/* Grid View */}
          {state.viewMode === "grid" ? (
            <>
              <GridView
                listings={getPaginatedData().currentItems}
                handleViewDetails={handleViewDetails}
                refreshListings={fetchData}
              />

              {/* Pagination */}
              {getPaginatedData().totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        dispatch({
                          type: "SET_CURRENT_PAGE",
                          payload: Math.max(1, state.currentPage - 1),
                        })
                      }
                      disabled={state.currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        state.currentPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: getPaginatedData().totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() =>
                          dispatch({
                            type: "SET_CURRENT_PAGE",
                            payload: page,
                          })
                        }
                        className={`px-3 py-1 rounded-md ${
                          state.currentPage === page
                            ? "bg-[#002C69] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        dispatch({
                          type: "SET_CURRENT_PAGE",
                          payload: Math.min(
                            getPaginatedData().totalPages,
                            state.currentPage + 1
                          ),
                        })
                      }
                      disabled={
                        state.currentPage === getPaginatedData().totalPages
                      }
                      className={`px-3 py-1 rounded-md ${
                        state.currentPage === getPaginatedData().totalPages
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Table view
            <TableView
              listings={getPaginatedData().currentItems}
              selectedRows={state.selectedRows}
              selectAll={state.selectAll}
              currentPage={state.currentPage}
              totalPages={getPaginatedData().totalPages}
              handleViewDetails={handleViewDetails}
              dispatch={dispatch}
            />
          )}
        </>
      )}
    </div>
  );
}
