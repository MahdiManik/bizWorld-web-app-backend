// Define content item type
export type ContentItem = {
  id: number;
  title: string;
  author: string;
  date: string;
  description: string;
  tags: string[];
  fullName?: string;
  email?: string;
  phone?: string;
  submissionFor?: string;
  postTitle?: string;
  areaOfExpertise?: string[];
  yearsOfExperience?: string;
  attachments?: {
    name: string;
    size: string;
  }[];
  portfolioLink?: string;
  additionalInfo?: string;
};

// Define content data type
export type ContentData = {
  pending: ContentItem[];
  approved: ContentItem[];
  rejected: ContentItem[];
};

// Define the state interface
export interface State {
  activeTab: "pending" | "approved" | "rejected";
  data: ContentData | null;
  isLoading: boolean;
  searchQuery: string;
  viewMode: "grid" | "list";
}

// Define action types
export type Action =
  | { type: "SET_ACTIVE_TAB"; payload: "pending" | "approved" | "rejected" }
  | { type: "SET_DATA"; payload: ContentData }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "RESET_SEARCH" }
  | { type: "SET_VIEW_MODE"; payload: "grid" | "list" };
