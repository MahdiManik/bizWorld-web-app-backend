/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useImmerReducer } from "use-immer";
import { enableMapSet } from "immer";

// Enable MapSet to allow Set objects to work with Immer
enableMapSet();
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FilterValues } from "../Others/filter-modal";
import { TableSearchFilter } from "../Others/table-search-filter";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaRegEye } from "react-icons/fa";

// Define the state interface
interface DataTableState {
  searchTerm: string;
  currentPage: number;
  sortConfig: {
    key: string;
    direction: "ascending" | "descending";
  } | null;
  selectedItems: Set<number>;
  activeFilters: FilterValues;
}

// Define action types
type DataTableAction =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | {
      type: "SET_SORT_CONFIG";
      payload: { key: string; direction: "ascending" | "descending" } | null;
    }
  | { type: "SET_SELECTED_ITEMS"; payload: Set<number> }
  | { type: "TOGGLE_SELECT_ITEM"; payload: number }
  | { type: "SELECT_ALL"; payload: number }
  | { type: "DESELECT_ALL" }
  | { type: "SET_ACTIVE_FILTERS"; payload: FilterValues }
  | { type: "RESET_FILTERS" };

// Reducer function
const reducer = (draft: DataTableState, action: DataTableAction) => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      draft.searchTerm = action.payload;
      draft.currentPage = 1; // Reset to first page when search changes
      return;
    case "SET_CURRENT_PAGE":
      draft.currentPage = action.payload;
      return;
    case "SET_SORT_CONFIG":
      draft.sortConfig = action.payload;
      return;
    case "SET_SELECTED_ITEMS":
      draft.selectedItems = action.payload;
      return;
    case "TOGGLE_SELECT_ITEM":
      if (draft.selectedItems.has(action.payload)) {
        draft.selectedItems.delete(action.payload);
      } else {
        draft.selectedItems.add(action.payload);
      }
      return;
    case "SELECT_ALL":
      const newSelectedItems = new Set<number>();
      for (let i = 0; i < action.payload; i++) {
        newSelectedItems.add(i);
      }
      draft.selectedItems = newSelectedItems;
      return;
    case "DESELECT_ALL":
      draft.selectedItems = new Set();
      return;
    case "SET_ACTIVE_FILTERS":
      draft.activeFilters = action.payload;
      draft.currentPage = 1; // Reset to first page when filters change
      return;
    case "RESET_FILTERS":
      draft.searchTerm = "";
      draft.sortConfig = null;
      draft.currentPage = 1;
      draft.selectedItems = new Set();
      draft.activeFilters = {};
      return;
  }
};

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T & string;
    title: string;
    sortable?: boolean;
    render?: (value: unknown, item: T) => React.ReactNode;
    filterable?: boolean;
  }[];
  itemsPerPage?: number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onAddNew?: () => void;
  addButtonText?: string;
  filterTitle?: string;
  filterModalType?: "user" | "listing";
  filterFields?: Array<{
    id: string;
    label: string;
    type: "text" | "select" | "date" | "amount_range";
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
  }>;
}

export function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  itemsPerPage = 10,
  onEdit,
  onDelete,
  onView,
  onAddNew,
  addButtonText = "Add User",
  filterTitle = "Filter",
  filterModalType = "listing",
  filterFields,
}: DataTableProps<T>) {
  // Initialize state with useImmerReducer
  const [state, dispatch] = useImmerReducer<DataTableState, DataTableAction>(
    reducer,
    {
      searchTerm: "",
      currentPage: 1,
      sortConfig: null,
      selectedItems: new Set<number>(),
      activeFilters: {},
    }
  );

  // Generate default filter fields based on columns if not provided
  const generatedFilterFields: Array<{
    id: string;
    label: string;
    type: "text" | "select" | "date" | "amount_range";
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
  }> =
    filterFields ||
    columns
      .filter((column) => column.filterable)
      .map((column) => ({
        id: column.key,
        label: column.title,
        type: "text" as const,
        placeholder: `Search by ${column.title}`,
      }));

  // Filter data based on search term and active filters
  const filteredData = data.filter((item) => {
    const matchesSearchTerm = Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(state.searchTerm.toLowerCase())
    );

    const matchesAllFilters = Object.entries(state.activeFilters).every(
      ([key, value]) => {
        if (!value) return true;

        const itemValue = item[key];
        if (!itemValue) return false;

        return itemValue.toString().toLowerCase().includes(value.toLowerCase());
      }
    );

    return matchesSearchTerm && matchesAllFilters;
  });

  // Sort data if sort config is set
  const sortedData = state.sortConfig
    ? [...filteredData].sort((a, b) => {
        const aValue = a[state.sortConfig!.key];
        const bValue = b[state.sortConfig!.key];

        if (aValue < bValue) {
          return state.sortConfig!.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return state.sortConfig!.direction === "ascending" ? 1 : -1;
        }
        return 0;
      })
    : filteredData;

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (state.currentPage - 1) * itemsPerPage,
    state.currentPage * itemsPerPage
  );

  // Handle sort
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";

    if (
      state.sortConfig &&
      state.sortConfig.key === key &&
      state.sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    dispatch({ type: "SET_SORT_CONFIG", payload: { key, direction } });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (state.selectedItems.size === paginatedData.length) {
      dispatch({ type: "DESELECT_ALL" });
    } else {
      dispatch({ type: "SELECT_ALL", payload: paginatedData.length });
    }
  };

  // Handle select item
  const handleSelectItem = (index: number) => {
    dispatch({ type: "TOGGLE_SELECT_ITEM", payload: index });
  };

  // Handle reset filters
  const handleReset = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  // Handle filter application
  const handleApplyFilters = (filters: FilterValues) => {
    dispatch({ type: "SET_ACTIVE_FILTERS", payload: filters });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4 relative">
        <div className="flex items-center justify-between sticky top-4 bg-[#F8FAFC]">
          <TableSearchFilter
            searchTerm={state.searchTerm}
            onSearch={(value) =>
              dispatch({ type: "SET_SEARCH_TERM", payload: value })
            }
            onReset={handleReset}
            onApplyFilters={handleApplyFilters}
            activeFilters={state.activeFilters}
            filterTitle={filterTitle}
            modalType={filterModalType}
            filterFields={generatedFilterFields}
          />

          <div className="">
            {onAddNew && (
              <button
                onClick={onAddNew}
                className="bg-[#002C69] hover:bg-[#002C69]/80 text-white h-9 px-4 rounded-md flex items-center gap-1 cursor-pointer"
              >
                <FiPlus className="h-4 w-4" />
                {addButtonText}
              </button>
            )}
          </div>
        </div>

        <div className="rounded-md border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#E6F0F8] border-b border-gray-200">
                  <th className="w-12 px-4 py-3.5 ">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 &&
                        state.selectedItems.size === paginatedData.length
                      }
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {column.sortable ? (
                        <button
                          className="flex items-center gap-1"
                          onClick={() => requestSort(column.key)}
                        >
                          {column.title}
                          {state.sortConfig?.key === column.key ? (
                            state.sortConfig.direction === "ascending" ? (
                              <TiArrowSortedUp className="h-4 w-4 text-[#002C69]" />
                            ) : (
                              <TiArrowSortedDown className="h-4 w-4 text-[#002C69]" />
                            )
                          ) : (
                            <span className="ml-1 flex flex-col items-center leading-none">
                              <TiArrowSortedUp className="h-4 w-4 text-gray-400" />
                              <TiArrowSortedDown className="h-4 w-4 text-gray-400 -mt-2" />
                            </span>
                          )}
                        </button>
                      ) : (
                        column.title
                      )}
                    </th>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <th className="px-4 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={state.selectedItems.has(index)}
                          onChange={() => handleSelectItem(index)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                      {columns.map((column) => (
                        <td
                          key={`${index}-${column.key}`}
                          className="px-4 py-4 text-sm text-gray-900"
                        >
                          {column.render
                            ? column.render(item[column.key], item)
                            : item[column.key]}
                        </td>
                      ))}
                      {(onEdit || onDelete || onView) && (
                        <td className="px-4 py-4 text-sm text-center space-x-2">
                          {onView && (
                            <button
                              onClick={() => onView(item)}
                              className="text-[#475569] font-medium cursor-pointer"
                            >
                              <FaRegEye className="h-5 w-5" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="text-[#475569] font-medium cursor-pointer"
                            >
                              <FaRegEdit className="h-5 w-5" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="text-[#475569] font-medium cursor-pointer"
                            >
                              <FaRegTrashCan className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        1 +
                        (onEdit || onDelete || onView ? 1 : 0)
                      }
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-500">
            Displaying {paginatedData.length} of {filteredData.length}{" "}
            {filteredData.length === 1 ? "User" : "Users"}
          </p>
          {totalPages > 0 && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() =>
                  dispatch({
                    type: "SET_CURRENT_PAGE",
                    payload: Math.max(1, state.currentPage - 1),
                  })
                }
                disabled={state.currentPage === 1}
                className={`h-8 w-8 flex items-center justify-center border rounded ${
                  state.currentPage === 1
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Previous page</span>
                <FiChevronLeft className="h-4 w-4 cursor-pointer" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() =>
                      dispatch({
                        type: "SET_CURRENT_PAGE",
                        payload: pageNumber,
                      })
                    }
                    className={`h-8 w-8 flex items-center justify-center border rounded cursor-pointer ${
                      pageNumber === state.currentPage
                        ? "bg-[#002C69] text-white border-[#002C69]"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  dispatch({
                    type: "SET_CURRENT_PAGE",
                    payload: Math.min(totalPages, state.currentPage + 1),
                  })
                }
                disabled={state.currentPage === totalPages}
                className={`h-8 w-8 flex items-center justify-center border rounded ${
                  state.currentPage === totalPages
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Next page</span>
                <FiChevronRight className="h-4 w-4 cursor-pointer" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
