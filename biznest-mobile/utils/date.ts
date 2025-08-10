/**
 * Date utility functions
 */

/**
 * Formats a date to relative time (e.g., "1d", "1w", "2m")
 * @param dateString - The ISO date string or Date object
 * @returns The formatted relative time string
 */
export const formatRelativeTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  
  // Convert to different time units
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  // Return appropriate format
  if (diffInYears > 0) {
    return `${diffInYears}y`;
  } else if (diffInMonths > 0) {
    return `${diffInMonths}m`;
  } else if (diffInWeeks > 0) {
    return `${diffInWeeks}w`;
  } else if (diffInDays > 0) {
    return `${diffInDays}d`;
  } else if (diffInHours > 0) {
    return `${diffInHours}h`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}min`;
  } else {
    return 'now';
  }
};