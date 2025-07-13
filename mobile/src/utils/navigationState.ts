// A simple module to share state between screens
// This is used for passing state between navigations

// For listing tabs
let activeListingTab = 'browse';

export const getActiveListingTab = (): string => {
  return activeListingTab;
};

export const setActiveListingTab = (tab: string): void => {
  activeListingTab = tab;
};

// For navbar active tab
let currentActiveNavTab = '/dashboard';

export const getCurrentNavTab = (): string => {
  return currentActiveNavTab;
};

export const setCurrentNavTab = (tab: string): void => {
  currentActiveNavTab = tab;
};
