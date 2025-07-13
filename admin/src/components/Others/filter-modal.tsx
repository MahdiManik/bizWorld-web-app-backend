/* eslint-disable @typescript-eslint/no-unused-vars */

import { FiX } from "react-icons/fi";
import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { FiSearch } from "react-icons/fi";
import { createPortal } from "react-dom";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterField {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "amount_range";
  placeholder?: string;
  options?: FilterOption[];
}

type FilterModalType = "user" | "listing";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  onReset: () => void;
  fields?: FilterField[];
  title?: string;
  modalType?: FilterModalType;
}

export interface FilterValues {
  [key: string]: string | undefined;
  minAmount?: string;
  maxAmount?: string;
}

// Define state interface
interface FilterModalState {
  filters: FilterValues;
}

// Define action types
type FilterModalAction =
  | { type: "INITIALIZE_FILTERS"; payload: FilterValues }
  | { type: "UPDATE_FILTER"; payload: { id: string; value: string } }
  | { type: "RESET_FILTERS"; payload: FilterValues };

// Reducer function
const reducer = (draft: FilterModalState, action: FilterModalAction) => {
  switch (action.type) {
    case "INITIALIZE_FILTERS":
      draft.filters = action.payload;
      return;
    case "UPDATE_FILTER":
      draft.filters[action.payload.id] = action.payload.value;
      return;
    case "RESET_FILTERS":
      draft.filters = action.payload;
      return;
  }
};

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  onReset,
  fields = defaultFields,
  title = "Filter Subscription",
  modalType = "listing",
}: FilterModalProps) {
  // Initialize state with useImmerReducer
  const [state, dispatch] = useImmerReducer<
    FilterModalState,
    FilterModalAction
  >(reducer, {
    filters: {},
  });

  // Initialize filters when fields change
  useEffect(() => {
    if (isOpen) {
      const initialFilters: FilterValues = {};
      fields.forEach((field) => {
        initialFilters[field.id] = "";
      });
      // Initialize min and max amount if there's an amount_range field
      if (fields.some((field) => field.type === "amount_range")) {
        initialFilters.minAmount = "";
        initialFilters.maxAmount = "";
      }
      dispatch({ type: "INITIALIZE_FILTERS", payload: initialFilters });
    }
  }, [isOpen, fields, dispatch]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(state.filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {};
    fields.forEach((field) => {
      resetFilters[field.id] = "";
    });
    // Reset min and max amount if there's an amount_range field
    if (fields.some((field) => field.type === "amount_range")) {
      resetFilters.minAmount = "";
      resetFilters.maxAmount = "";
    }
    dispatch({ type: "RESET_FILTERS", payload: resetFilters });
    onReset();
  };

  const handleInputChange = (id: string, value: string) => {
    dispatch({
      type: "UPDATE_FILTER",
      payload: { id, value },
    });
  };

  // Use createPortal to render the modal at the document body level
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-xl shadow-lg w-[450px] p-6 relative max-w-[95%] mx-auto my-auto">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black cursor-pointer"
        >
          <FiX className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <h2 className="text-lg font-semibold text-[#002C69] mb-6">{title}</h2>

        {/* Filter Form */}
        <div className="space-y-6">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="block text-[#002C69] font-medium mb-2">
                {field.label}
              </label>

              {field.type === "text" && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder={
                      field.placeholder || `Search By ${field.label}`
                    }
                    value={state.filters[field.id] || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}

              {field.type === "select" && (
                <div className="relative">
                  <select
                    value={state.filters[field.id] || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">
                      {field.placeholder || `Select ${field.label}`}
                    </option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-blue-900"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {field.type === "date" && (
                <div className="flex space-x-2 items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Jan 24, 2025"
                      value={state.filters["startDate"] || ""}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[#002C69] font-medium">To</span>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Jan 24, 2025"
                      value={state.filters["endDate"] || ""}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {field.type === "amount_range" && (
                <div className="flex space-x-2 items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Min Amount"
                      value={state.filters.minAmount || ""}
                      onChange={(e) =>
                        handleInputChange("minAmount", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-500 font-medium">$</span>
                    </div>
                  </div>
                  <span className="text-[#002C69] font-medium">To</span>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Max Amount"
                      value={state.filters.maxAmount || ""}
                      onChange={(e) =>
                        handleInputChange("maxAmount", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-500 font-medium">$</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={handleReset}
            className="flex-1 py-3 bg-gray-100 text-[#002C69] font-medium rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-[#002C69] text-white font-medium rounded-md hover:bg-blue-800 transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Default fields for backward compatibility
const defaultFields: FilterField[] = [
  {
    id: "id",
    label: "Search By ID",
    type: "text",
    placeholder: "Search By ID",
  },
  {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Search By Name",
  },
  {
    id: "category",
    label: "Category",
    type: "select",
    placeholder: "Select Category",
  },
  {
    id: "location",
    label: "Location",
    type: "select",
    placeholder: "Select Location",
  },
];
