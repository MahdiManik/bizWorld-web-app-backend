import { FilterValues } from "@/components/Others/filter-modal";
import { Listing as ServiceListing } from "@/services/businesslisting.services";

// Extend the service listing type with any additional fields needed in the UI
export interface BusinessOwner {
  fullName: string;
  // Add other business owner properties here if needed
}

export interface Listing extends ServiceListing {
  // Fields from original interface that aren't in the service
  title?: string;
  submitter?: string;
  submissionDate?: string;
  submittedOn?: string;
  country?: string;
  businessOwner?: BusinessOwner;
}

export interface State {
  listings: Listing[];
  filteredListings: Listing[];
  activeTab: string;
  searchQuery: string;
  viewMode: "grid" | "table";
  currentPage: number;
  selectedRows: string[];
  selectAll: boolean;
  isLoading: boolean;
  activeFilters: FilterValues;
  businessOwner: string;
  country: string;
}

export type Action =
  | { type: "SET_LISTINGS"; payload: Listing[] }
  | { type: "SET_FILTERED_LISTINGS"; payload: Listing[] }
  | { type: "SET_ACTIVE_TAB"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_VIEW_MODE"; payload: "grid" | "table" }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "TOGGLE_ROW_SELECTION"; payload: string }
  | { type: "SET_SELECTED_ROWS"; payload: string[] }
  | { type: "TOGGLE_SELECT_ALL" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ACTIVE_FILTERS"; payload: FilterValues };
