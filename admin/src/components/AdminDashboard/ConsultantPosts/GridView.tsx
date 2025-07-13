import React from "react";
import { FiFileText, FiTag } from "react-icons/fi";
import { LuCircleCheckBig } from "react-icons/lu";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { ContentItem } from "./types";
import { getStatusClass } from "./utils";

interface GridViewProps {
  items: ContentItem[];
  activeTab: "pending" | "approved" | "rejected";
  onPreview: (item: ContentItem) => void;
}

const GridView: React.FC<GridViewProps> = ({ items, activeTab, onPreview }) => {
  return (
    <div className="mt-6 grid md:grid-cols-2 gap-6">
      {items.length > 0 ? (
        items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  By {item.author} • {item.date}
                </p>
              </div>
              <span
                className={`${getStatusClass(
                  activeTab
                )} text-xs font-medium px-2.5 py-0.5 rounded capitalize`}
              >
                {activeTab}
              </span>
            </div>

            <p className="text-gray-600 text-sm mt-3">{item.description}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 text-sm bg-gray-100 px-2.5 py-0.5 rounded-full"
                >
                  <FiTag />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex mt-4 justify-between">
              <button
                className="inline-flex items-center text-gray-600 text-sm border border-gray-200 rounded px-4 py-2 cursor-pointer"
                onClick={() => onPreview(item)}
              >
                <FiFileText className="h-4 w-4 mr-1" />
                Preview
              </button>
              <div className="flex gap-2">
                {activeTab !== "rejected" && (
                  <button className="px-4 py-2 border border-red-200 text-red-600 flex items-center gap-2 rounded text-sm font-medium cursor-pointer">
                    <IoIosCloseCircleOutline className="h-4 w-4 mr-1" />{" "}
                    Reject
                  </button>
                )}
                {activeTab !== "approved" && (
                  <button className="px-4 py-2 bg-[#002C69] flex items-center gap-2 text-white rounded text-sm font-medium cursor-pointer">
                    <LuCircleCheckBig className="h-4 w-4 mr-1" /> Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-2 text-center py-8 text-gray-500">
          No {activeTab} items found matching your search.
        </div>
      )}
    </div>
  );
};

export default GridView;
