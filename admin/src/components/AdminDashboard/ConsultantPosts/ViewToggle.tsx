import React from "react";
import { FaTh } from "react-icons/fa";
import { VscThreeBars } from "react-icons/vsc";
import { Action } from "./types";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  dispatch: React.Dispatch<Action>;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, dispatch }) => {
  // Handle view mode change with explicit action dispatch
  const handleViewModeChange = (mode: "grid" | "list") => {
    console.log(`Setting view mode to: ${mode}`);
    dispatch({ type: "SET_VIEW_MODE", payload: mode });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleViewModeChange("list")}
        className={`text-xl ${
          viewMode === "list" ? "text-primary text-[#002C69]" : "text-gray-600"
        }`}
        aria-label="List view"
      >
        <VscThreeBars className="cursor-pointer" />
      </button>

      <button
        onClick={() => handleViewModeChange("grid")}
        className={`text-xl ${
          viewMode === "grid" ? "text-primary text-[#002C69]" : "text-gray-600"
        }`}
        aria-label="Grid view"
      >
        <FaTh className="cursor-pointer" />
      </button>
    </div>
  );
};

export default ViewToggle;
