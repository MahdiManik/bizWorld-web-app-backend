import React from "react";
import { FaTh } from "react-icons/fa";
import { VscThreeBars } from "react-icons/vsc";
import { Action } from "./types";

interface ListingTabsProps {
  activeTab: string;
  viewMode: "grid" | "table";
  handleTabChange: (tab: string) => void;
  dispatch: React.Dispatch<Action>;
}

const ListingTabs: React.FC<ListingTabsProps> = ({
  activeTab,
  viewMode,
  handleTabChange,
  dispatch,
}) => {
  return (
    <div className="border-b flex justify-between items-center mb-5 sticky top-2 z-50 bg-white">
      <div className="flex">
        <button
          onClick={() => handleTabChange("pending")}
          className={`px-6 py-2 cursor-pointer ${
            activeTab === "pending"
              ? "border-b-2 border-[#002C69] text-[#002C69]"
              : "text-gray-600"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => handleTabChange("approved")}
          className={`px-6 py-2 cursor-pointer ${
            activeTab === "approved"
              ? "border-b-2 border-[#002C69] text-[#002C69]"
              : "text-gray-600"
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => handleTabChange("rejected")}
          className={`px-6 py-2 cursor-pointer ${
            activeTab === "rejected"
              ? "border-b-2 border-[#002C69] text-[#002C69]"
              : "text-gray-600"
          }`}
        >
          Rejected
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            dispatch({ type: "SET_VIEW_MODE", payload: "table" })
          }
          className={`text-xl ${
            viewMode === "table" ? "text-[#002C69]" : "text-gray-600"
          }`}
          aria-label="List view"
        >
          <VscThreeBars className="cursor-pointer" />
        </button>

        <button
          onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "grid" })}
          className={
            viewMode === "grid" ? "text-[#002C69] pr-4" : "text-gray-600"
          }
          aria-label="Grid view"
        >
          <FaTh className="cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default ListingTabs;
