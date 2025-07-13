import { ContentData, ContentItem } from "./types";

// Filter items based on active tab and search query
export const filterItems = (
  data: ContentData | null,
  activeTab: "pending" | "approved" | "rejected",
  searchQuery: string
): ContentItem[] => {
  if (!data) return [];
  
  return data[activeTab]?.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  ) || [];
};

// Get status class based on status
export const getStatusClass = (status: string): string => {
  switch (status) {
    case "pending":
      return "bg-[#F59E0B] text-white";
    case "approved":
      return "bg-[#167F60] text-white";
    case "rejected":
      return "bg-[#EF4444] text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
