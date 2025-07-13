"use client";

import { useRef } from "react";
import { BiCalendar, BiChevronDown } from "react-icons/bi";
import { useImmerReducer } from "use-immer";

const timePeriods = [
  { value: "this-month", label: "This Month" },
  { value: "previous-month", label: "Previous Month" },
  { value: "previous-3-months", label: "Previous 3 Months" },
  { value: "previous-6-months", label: "Previous 6 Months" },
  { value: "1-year", label: "1 Year" },
];

// Define state type
type DropdownState = {
  selectedPeriod: string;
  isOpen: boolean;
};

// Define action type
type DropdownAction =
  | { type: "TOGGLE_DROPDOWN" }
  | { type: "CLOSE_DROPDOWN" }
  | { type: "SELECT_PERIOD"; payload: string };

// Initial state
const initialState: DropdownState = {
  selectedPeriod: "this-month",
  isOpen: false,
};

// Reducer function
function dropdownReducer(draft: DropdownState, action: DropdownAction) {
  switch (action.type) {
    case "TOGGLE_DROPDOWN":
      draft.isOpen = !draft.isOpen;
      break;
    case "CLOSE_DROPDOWN":
      draft.isOpen = false;
      break;
    case "SELECT_PERIOD":
      draft.selectedPeriod = action.payload;
      draft.isOpen = false;
      break;
  }
}

export default function TimePeriodDropdown() {
  const [state, dispatch] = useImmerReducer(dropdownReducer, initialState);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    timePeriods.find((period) => period.value === state.selectedPeriod)
      ?.label || "This Month";

  // Using onBlur instead of document event listeners
  const handleBlur = (e: React.FocusEvent) => {
    // Check if the related target is inside the dropdown
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.relatedTarget as Node)
    ) {
      dispatch({ type: "CLOSE_DROPDOWN" });
    }
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onBlur={handleBlur}
      tabIndex={0}
    >
      {/* Main clickable button */}
      <div
        onClick={() => dispatch({ type: "TOGGLE_DROPDOWN" })}
        className="flex w-64 items-center justify-between p-2 bg-blue-50 border border-[#002C69] rounded-lg cursor-pointer hover:border-[#002C69] transition-colors"
      >
        <div className="flex items-center gap-2">
          <BiCalendar className="w-4 h-4 text-[#002C69]" />
          <span className="text-sm font-medium text-[#002C69]">
            {selectedLabel}
          </span>
        </div>
        <BiChevronDown
          className={`w-4 h-4 text-right text-[#002C69] transition-transform ${
            state.isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown menu */}
      {state.isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-300 rounded-lg shadow-lg z-50">
          <div className="py-1 w-64">
            {timePeriods.map((period) => (
              <div
                key={period.value}
                onClick={() => {
                  dispatch({ type: "SELECT_PERIOD", payload: period.value });
                }}
                className={`
                  flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors text-sm
                  ${
                    state.selectedPeriod === period.value
                      ? "bg-blue-50 text-[#002C69] w-[250px]"
                      : "hover:bg-gray-50 hover:w-[250px] "
                  }
                `}
              >
                <BiCalendar className="w-3 h-3 text-[#002C69]" />
                <span className="font-medium text-[#002C69]">
                  {period.label}
                </span>
                {state.selectedPeriod === period.value && (
                  <div className="ml-auto w-2 h-2 bg-[#002C69] rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
