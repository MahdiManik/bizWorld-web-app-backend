"use client";

import React from "react";
import { useImmerReducer } from "use-immer";
import { FiFilter, FiRefreshCw, FiSearch } from "react-icons/fi";
import FilterModal, { FilterValues } from "./filter-modal";

export interface TableSearchFilterProps {
  onSearch: (searchTerm: string) => void;
  onReset: () => void;
  onApplyFilters: (filters: FilterValues) => void;
  searchTerm: string;
  activeFilters: FilterValues;
  filterTitle?: string;
  modalType?: "user" | "listing";
  filterFields?: Array<{
    id: string;
    label: string;
    type: "text" | "select" | "date" | "amount_range";
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
  }>;
}

// Define state interface
interface TableSearchFilterState {
  isFilterModalOpen: boolean;
}

// Define action types
type TableSearchFilterAction =
  | { type: "OPEN_FILTER_MODAL" }
  | { type: "CLOSE_FILTER_MODAL" };

// Reducer function
const reducer = (draft: TableSearchFilterState, action: TableSearchFilterAction) => {
  switch (action.type) {
    case "OPEN_FILTER_MODAL":
      draft.isFilterModalOpen = true;
      return;
    case "CLOSE_FILTER_MODAL":
      draft.isFilterModalOpen = false;
      return;
  }
};

export function TableSearchFilter({
  onSearch,
  onReset,
  onApplyFilters,
  searchTerm,
  activeFilters,
  filterTitle = "Filter",
  modalType = "listing",
  filterFields,
}: TableSearchFilterProps) {
  // Initialize state with useImmerReducer
  const [state, dispatch] = useImmerReducer<TableSearchFilterState, TableSearchFilterAction>(reducer, {
    isFilterModalOpen: false
  });

  return (
    <div className="flex gap-5 items-center">
      <div className="relative w-80">
        <FiSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9 w-full h-9 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch({ type: "OPEN_FILTER_MODAL" })}
          className="flex items-center gap-2 h-9 px-4 text-sm font-medium border border-gray-300 rounded-md cursor-pointer"
        >
          <FiFilter className="h-4 w-4" />
          Filters
          {Object.values(activeFilters).some((value) => value) && (
            <span className="ml-1 w-2 h-2 bg-[#002C69] rounded-full"></span>
          )}
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 h-9 px-4 text-sm font-medium border border-gray-300 rounded-md cursor-pointer"
        >
          Reset
          <FiRefreshCw className="h-4 w-4" />
        </button>
      </div>

      {state.isFilterModalOpen && (
        <FilterModal
          isOpen={state.isFilterModalOpen}
          onClose={() => dispatch({ type: "CLOSE_FILTER_MODAL" })}
          onApply={onApplyFilters}
          onReset={onReset}
          title={filterTitle}
          modalType={modalType}
          fields={filterFields}
        />
      )}
    </div>
  );
}
