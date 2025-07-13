import React from "react";
import { BiSearch } from "react-icons/bi";
import { FiRefreshCw } from "react-icons/fi";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onReset,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <BiSearch className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 border w-[400px] border-gray-300 rounded-md  focus:outline-none focus:ring-1 focus:ring-[#002C69]"
        />
      </div>
      <button
        className="flex items-center gap-2 text-gray-600 px-4 py-2 border border-gray-600 rounded-md cursor-pointer"
        onClick={onReset}
      >
        <FiRefreshCw className="h-4 w-4" />
        Reset
      </button>
    </div>
  );
}
