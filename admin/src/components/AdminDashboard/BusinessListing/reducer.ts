import { State, Action } from "./types";

export const reducer = (draft: State, action: Action) => {
  switch (action.type) {
    case "SET_LISTINGS":
      draft.listings = action.payload;
      return;
    case "SET_FILTERED_LISTINGS":
      draft.filteredListings = action.payload;
      return;
    case "SET_ACTIVE_TAB":
      draft.activeTab = action.payload;
      return;
    case "SET_SEARCH_QUERY":
      draft.searchQuery = action.payload;
      return;
    case "SET_VIEW_MODE":
      draft.viewMode = action.payload;
      return;
    case "SET_CURRENT_PAGE":
      draft.currentPage = action.payload;
      return;
    case "TOGGLE_ROW_SELECTION":
      const index = draft.selectedRows.indexOf(action.payload);
      if (index === -1) {
        draft.selectedRows.push(action.payload);
      } else {
        draft.selectedRows.splice(index, 1);
      }
      draft.selectAll =
        draft.selectedRows.length === draft.filteredListings.length;
      return;
    case "SET_SELECTED_ROWS":
      draft.selectedRows = action.payload;
      return;
    case "TOGGLE_SELECT_ALL":
      if (draft.selectAll) {
        draft.selectedRows = [];
      } else {
        draft.selectedRows = draft.filteredListings.map((item) => item.id);
      }
      draft.selectAll = !draft.selectAll;
      return;
    case "SET_LOADING":
      draft.isLoading = action.payload;
      return;
    case "SET_ACTIVE_FILTERS":
      draft.activeFilters = action.payload;
      return;
  }
};
