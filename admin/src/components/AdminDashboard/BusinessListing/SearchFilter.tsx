import React from "react";
import { TableSearchFilter } from "@/components/Others/table-search-filter";
import { FilterValues } from "@/components/Others/filter-modal";
import { Action, Listing } from "./types";
import {
  filterListings,
  getUniqueCategories,
  getUniqueLocations,
} from "./utils";

interface SearchFilterProps {
  searchTerm: string;
  activeTab: string;
  listings: Listing[];
  activeFilters: FilterValues;
  dispatch: React.Dispatch<Action>;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  activeTab,
  listings,
  activeFilters,
  dispatch,
}) => {
  return (
    <div className="my-4">
      <TableSearchFilter
        searchTerm={searchTerm}
        onSearch={(value) => {
          dispatch({ type: "SET_SEARCH_QUERY", payload: value });
          // Apply search immediately
          const filtered = filterListings(listings, activeTab, value);
          dispatch({ type: "SET_FILTERED_LISTINGS", payload: filtered });
        }}
        onReset={() => {
          dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
          dispatch({ type: "SET_ACTIVE_FILTERS", payload: {} });

          // Use the filterListings function to apply only the active tab filter
          const filtered = filterListings(listings, activeTab, "");

          dispatch({
            type: "SET_FILTERED_LISTINGS",
            payload: filtered,
          });
          dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
        }}
        onApplyFilters={(filters) => {
          // Save active filters to state
          dispatch({ type: "SET_ACTIVE_FILTERS", payload: filters });

          // First apply custom filters
          let filtered = listings.filter((listing) => {
            return Object.entries(filters).every(([key, value]) => {
              if (!value) return true; // Skip empty filters
              const listingValue = listing[key as keyof Listing];
              return String(listingValue)
                .toLowerCase()
                .includes(String(value).toLowerCase());
            });
          });

          // Then apply tab filter using the filterListings function
          // but without the search query since we're applying custom filters
          filtered = filterListings(filtered, activeTab, "");

          dispatch({ type: "SET_FILTERED_LISTINGS", payload: filtered });
          dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
        }}
        activeFilters={activeFilters}
        filterTitle="Filter Listings"
        modalType="listing"
        filterFields={[
          {
            id: "id",
            label: "ID",
            type: "text",
            placeholder: "Search By ID",
          },
          {
            id: "title",
            label: "Name",
            type: "text",
            placeholder: "Search By Name",
          },
          {
            id: "category",
            label: "Category",
            type: "select",
            placeholder: "Select Category",
            options: getUniqueCategories(listings),
          },
          {
            id: "country",
            label: "Location",
            type: "select",
            placeholder: "Select Location",
            options: getUniqueLocations(listings),
          },
          {
            id: "listingStatus",
            label: "Status",
            type: "select",
            placeholder: "Select Status",
            options: [
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ],
          },
        ]}
      />
    </div>
  );
};

export default SearchFilter;
