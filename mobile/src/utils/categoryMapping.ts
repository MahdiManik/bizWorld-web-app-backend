// Map of category values to their display labels
export const CATEGORY_MAP = {
  'MOBILE': 'Mobile',
  'FINTECH': 'Fintech',
  'ECOMMERCE': 'E-commerce',
};

/**
 * Converts a category value to its display label
 * @param categoryValue The category value stored in the database
 * @returns The user-friendly display label for the category
 */
export const getCategoryLabel = (categoryValue: string | undefined): string => {
  if (!categoryValue) return '';
  
  return CATEGORY_MAP[categoryValue as keyof typeof CATEGORY_MAP] || categoryValue;
};
