"use client";

import { useEffect, useState } from "react";
import { FiTag } from "react-icons/fi";
import { useImmerReducer } from "use-immer";
import DetailsModal from "./DetailsModal";
import { DataTable } from "@/components/Others/data-table";
import SearchBar from "./SearchBar";
import ConsultantSkeleton from "@/components/Skeletons/ConsultantSkeleton";
import { State, Action, ContentItem } from "./types";
import { reducer } from "./reducer";
import { filterItems } from "./utils";
import GridView from "./GridView";
import ViewToggle from "./ViewToggle";

export default function ConsultantPosts() {
  // Initialize state with useImmerReducer
  const [state, dispatch] = useImmerReducer<State, Action>(reducer, {
    activeTab: "pending",
    data: null,
    isLoading: true,
    searchQuery: "",
    viewMode: "grid",
  });

  // State for preview modal
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const response = await fetch("/data/consultant.json");
        const jsonData = await response.json();
        // Short timeout to ensure UI is responsive
        setTimeout(() => {
          dispatch({ type: "SET_DATA", payload: jsonData });
          dispatch({ type: "SET_LOADING", payload: false });
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchData();
  }, [dispatch]);

  // Handle tab change
  const handleTabChange = (tab: "pending" | "approved" | "rejected") => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: tab });
  };

  // Get filtered items based on active tab and search query
  const filteredItems = filterItems(
    state.data,
    state.activeTab,
    state.searchQuery
  );

  // Handle search reset
  const handleReset = () => {
    dispatch({ type: "RESET_SEARCH" });
  };

  // Handle preview modal
  const handlePreview = (item: ContentItem) => {
    setPreviewItem(item);
    setShowPreviewModal(true);
  };

  // Close preview modal
  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewItem(null);
  };

  return (
    <div className="mt-4">
      {state.isLoading ? (
        <ConsultantSkeleton viewMode={state.viewMode} />
      ) : (
        <>
          {/* Tabs */}
          <div className="border-b border-gray-200 flex items-center justify-between sticky top-2 z-50 bg-white">
            <div className="flex">
              <button
                className={`px-4 py-2 font-medium cursor-pointer ${
                  state.activeTab === "pending"
                    ? "text-[#002C69] border-b-2 border-[#002C69]"
                    : "text-gray-600"
                }`}
                onClick={() => handleTabChange("pending")}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 font-medium cursor-pointer ${
                  state.activeTab === "approved"
                    ? "text-[#002C69] border-b-2 border-[#002C69]"
                    : "text-gray-600"
                }`}
                onClick={() => handleTabChange("approved")}
              >
                Approved
              </button>
              <button
                className={`px-4 py-2 font-medium cursor-pointer ${
                  state.activeTab === "rejected"
                    ? "text-[#002C69] border-b-2 border-[#002C69]"
                    : "text-gray-600"
                }`}
                onClick={() => handleTabChange("rejected")}
              >
                Rejected
              </button>
            </div>
            <ViewToggle viewMode={state.viewMode} dispatch={dispatch} />
          </div>

          {/* View Toggle and Search */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            {state.viewMode === "grid" ? (
              <SearchBar
                searchQuery={state.searchQuery}
                onSearchChange={(value) =>
                  dispatch({ type: "SET_SEARCH_QUERY", payload: value })
                }
                onReset={handleReset}
              />
            ) : (
              <div>{/* Empty div to maintain layout when in list view */}</div>
            )}
          </div>

          {/* Content Views */}
          {state.viewMode === "grid" ? (
            // Grid View Component
            <GridView
              items={filteredItems}
              activeTab={state.activeTab}
              onPreview={handlePreview}
            />
          ) : (
            // List View using DataTable
            <div className="">
              <DataTable
                data={filteredItems}
                columns={[
                  {
                    key: "author",
                    title: "Name",
                    sortable: true,
                    filterable: true,
                    render: (value) => (
                      <div className="font-medium">{value as string}</div>
                    ),
                  },
                  {
                    key: "email",
                    title: "Email",
                    sortable: true,
                    filterable: true,
                    render: (value) => (
                      <div className="font-medium">{value as string}</div>
                    ),
                  },
                  {
                    key: "phone",
                    title: "Phone",
                    sortable: true,
                    filterable: true,
                    render: (value) => (
                      <div className="font-medium">{value as string}</div>
                    ),
                  },
                  {
                    key: "tags",
                    title: "Area of Expertise",
                    filterable: true,
                    render: (value) => (
                      <div className="flex flex-wrap gap-1">
                        {(value as string[]).map((tag, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full"
                          >
                            <FiTag />
                            {tag}
                          </span>
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: "date",
                    title: "Submitted on",
                    sortable: true,
                    filterable: true,
                  },
                  {
                    key: "id", // Using id key but overriding with custom render
                    title: "Status",
                    render: () => {
                      const statusConfig = {
                        pending: {
                          bgColor: "bg-yellow-50",
                          textColor: "text-yellow-500",
                          iconColor: "bg-yellow-500",
                        },
                        approved: {
                          bgColor: "bg-green-50",
                          textColor: "text-green-500",
                          iconColor: "bg-green-500",
                        },
                        rejected: {
                          bgColor: "bg-red-50",
                          textColor: "text-red-500",
                          iconColor: "bg-red-500",
                        }
                      };
                      
                      const config = statusConfig[state.activeTab];
                      
                      return (
                        <div className={`inline-flex items-center px-4 py-1.5 rounded-md ${config.bgColor}`}>
                          <div className={`w-4 h-4 ${config.iconColor} mr-2`}></div>
                          <span className={`text-sm font-medium ${config.textColor} capitalize`}>
                            {state.activeTab}
                          </span>
                        </div>
                      );
                    },
                  },
                ]}
                onView={(item) => handlePreview(item as ContentItem)}
                itemsPerPage={10}
                addButtonText="Add Consultant"
                filterTitle="Filter Consultants"
                filterFields={[
                  {
                    id: "author",
                    label: "Name",
                    type: "text",
                    placeholder: "Search by name",
                  },
                  {
                    id: "title",
                    label: "Post Title",
                    type: "text",
                    placeholder: "Search by post title",
                  },
                  {
                    id: "tags",
                    label: "Area of Expertise",
                    type: "select",
                    placeholder: "Select expertise",
                    options: [
                      { label: "Growth", value: "growth" },
                      { label: "Strategy", value: "strategy" },
                      { label: "Planning", value: "planning" },
                      { label: "Marketing", value: "marketing" },
                      { label: "Digital", value: "digital" },
                      { label: "Finance", value: "finance" },
                      { label: "Startup", value: "startup" },
                      { label: "Technology", value: "technology" },
                    ],
                  },
                  {
                    id: "date",
                    label: "Submitted Date",
                    type: "date",
                    placeholder: "Select date",
                  },
                ]}
                filterModalType="listing"
              />
            </div>
          )}
        </>
      )}

      {/* Preview Modal */}
      <DetailsModal
        isOpen={showPreviewModal}
        onClose={closePreviewModal}
        data={previewItem}
      />
    </div>
  );
}
