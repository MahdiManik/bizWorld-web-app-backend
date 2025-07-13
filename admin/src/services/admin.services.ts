// Define the base API URL from environment variable or use default
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

// Define interfaces for user statistics
export interface UserStatistics {
  totalUsers: number;
  percentageChange: number;
  last7DaysNewUsers: {
    day: string;
    users: number;
  }[];
}

// Admin Service
export const AdminService = {
  /**
   * Get user statistics for dashboard
   * @returns Promise with user statistics data
   */
  getUserStatistics: async (): Promise<UserStatistics> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/user-statistics`);
      const result = await handleResponse(response);

      // Handle API response format: { success, message, data: UserStatistics }
      if (
        result &&
        typeof result === "object" &&
        result.success &&
        result.data
      ) {
        return result.data;
      } else {
        console.error("Unexpected API response format:", result);
        throw new Error("Invalid user statistics data format");
      }
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      throw error;
    }
  },
};

export default AdminService;
