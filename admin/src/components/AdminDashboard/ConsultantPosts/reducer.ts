import { State, Action } from "./types";

// Reducer function
export const reducer = (draft: State, action: Action) => {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      draft.activeTab = action.payload;
      return;
    case "SET_DATA":
      draft.data = action.payload;
      return;
    case "SET_LOADING":
      draft.isLoading = action.payload;
      return;
    case "SET_SEARCH_QUERY":
      draft.searchQuery = action.payload;
      return;
    case "RESET_SEARCH":
      draft.searchQuery = "";
      return;
    case "SET_VIEW_MODE":
      draft.viewMode = action.payload;
      return;
  }
};
