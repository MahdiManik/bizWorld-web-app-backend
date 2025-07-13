/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Utility function to calculate growth percentage between two periods
 * @param currentItems - Array of items from the current period
 * @param previousItems - Array of items from the previous period
 * @returns Object containing percentage change and whether it's an increase
 */
export interface GrowthResult {
  percentage: number;
  isIncrease: boolean;
}

/**
 * Calculates the growth percentage between two periods
 *
 * @param currentItems - Array of items from the current period
 * @param previousItems - Array of items from the previous period
 * @returns Object with percentage change and boolean indicating if it's an increase
 *
 * Example:
 * If 12 users were created this week and 8 users last week:
 * → percentage = ((12 - 8) / 8) * 100 = 50%
 * → isIncrease = true
 */
export function calculateGrowth<T>(
  currentItems: T[],
  previousItems: T[]
): GrowthResult {
  const currentCount = currentItems.length;
  const previousCount = previousItems.length;

  let percentage = 0;
  let isIncrease = false;

  // Calculate percentage change
  if (previousCount === 0) {
    // If there were no items in the previous period, show 100% increase if there are current items
    percentage = currentCount > 0 ? 100 : 0;
    isIncrease = currentCount > 0;
  } else {
    // ((current - previous) / previous) * 100
    percentage = ((currentCount - previousCount) / previousCount) * 100;
    isIncrease = percentage >= 0;
  }

  // For example, if count increases from 1 to 2, that should be 100% increase
  return {
    percentage: Math.round(Math.abs(percentage)), // Round and return absolute value for display
    isIncrease,
  };
}

/**
 * Filter items based on their creation date within a specific date range
 * Strictly uses the createdAt field only, as requested
 *
 * @param items - Array of items with createdAt field
 * @param startDate - Start date of the range (inclusive)
 * @param endDate - End date of the range (inclusive)
 * @returns Array of items that fall within the date range
 */
export function filterItemsByDateRange<T extends { createdAt?: string | Date }>(
  items: T[],
  startDate: Date,
  endDate: Date
): T[] {
  return items.filter((item) => {
    // Only use createdAt field as requested
    const dateField = item.createdAt;
    if (!dateField) return false;

    try {
      const itemDate = new Date(dateField);
      // Check if date is valid
      if (isNaN(itemDate.getTime())) return false;

      return itemDate >= startDate && itemDate <= endDate;
    } catch (e) {
      return false;
    }
  });
}

/**
 * Calculate growth between current period and previous period
 *
 * @param items - All items with createdAt field
 * @param periodDays - Number of days in each period
 * @param filterFn - Optional filter function to apply before calculating growth (e.g., for active listings)
 * @returns Growth result object
 */
export function calculatePeriodGrowth<T extends { createdAt?: string | Date }>(
  items: T[],
  periodDays: number = 7,
  filterFn?: (item: T) => boolean
): GrowthResult {
  // Apply optional filter function (e.g., for active listings)
  const filteredItems = filterFn ? items.filter(filterFn) : items;

  // Get current date
  const currentDate = new Date();

  // Current period (e.g., last 7 days)
  const currentPeriodStart = new Date(currentDate);
  currentPeriodStart.setDate(currentDate.getDate() - periodDays);

  // Previous period (e.g., 7 days before the current period)
  const previousPeriodEnd = new Date(currentPeriodStart);
  previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);

  const previousPeriodStart = new Date(previousPeriodEnd);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - (periodDays - 1));

  // Filter items for each period
  const currentPeriodItems = filterItemsByDateRange(
    filteredItems,
    currentPeriodStart,
    currentDate
  );
  const previousPeriodItems = filterItemsByDateRange(
    filteredItems,
    previousPeriodStart,
    previousPeriodEnd
  );

  // Calculate growth
  return calculateGrowth(currentPeriodItems, previousPeriodItems);
}
