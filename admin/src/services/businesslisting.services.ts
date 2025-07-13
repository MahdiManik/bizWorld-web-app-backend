// Define the base API URL from environment variable or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

// Define Owner interface
export interface Owner {
  id: string;
  name: string;
  email?: string;
  // Add other owner-related fields as needed
}

// Define Listing interface to be used across components
export interface Listing {
  id: string;
  documentId: string;
  name: string;
  title?: string;
  category: string;
  location: string;
  rating?: number;
  status?: string;
  listingStatus?: string;
  date?: string;
  image?: string;
  description?: string;
  contact?: string;
  email?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  visibility?: string;
  owner?: Owner | null;
  // Add any other fields that your API returns
}

// Business Listing Service
export const BusinessListingService = {
  /**
   * Get all business listings
   * @returns Promise with listings array
   */
  getListings: async (): Promise<Listing[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/listings?populate=*`);
      const result = await handleResponse(response);

      // Handle Strapi response format: {data: Array, meta: {...}}
      if (result && typeof result === "object" && Array.isArray(result.data)) {
        return result.data;
      } else if (
        result &&
        typeof result === "object" &&
        result.success &&
        Array.isArray(result.data)
      ) {
        // Handle custom API format with success flag
        return result.data;
      } else if (Array.isArray(result)) {
        // If the API directly returns an array
        return result;
      } else {
        console.error("Unexpected API response format:", result);
        return [];
      }
    } catch (error) {
      console.error("Error fetching business listings:", error);
      throw error;
    }
  },

  /**
   * Get listing by ID
   * @param id Listing ID
   * @returns Promise with listing data
   */
  getListingById: async (id: string): Promise<Listing> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/listings/${id}`);
      const result = await handleResponse(response);

      // Handle API response format: { success, message, data: Listing }
      if (result && typeof result === "object") {
        if (result.success && result.data) {
          // Return the data property which contains the listing
          return result.data;
        } else if (result.name) {
          // Direct listing object
          return result;
        }
      }

      console.error("Unexpected listing data format:", result);
      throw new Error("Invalid listing data format");
    } catch (error) {
      console.error(`Error fetching listing with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new business listing
   * @param listingData Listing data object
   * @returns Promise with created listing data
   */
  createListing: async (listingData: Omit<Listing, "id">): Promise<Listing> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/listings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error creating business listing:", error);
      throw error;
    }
  },

  /**
   * Update listing data
   * @param id Listing ID
   * @param listingData Updated listing data
   * @returns Promise with updated listing data
   */
  updateListing: async (
    documentId: string,
    listingData: { listingStatus: string }
  ): Promise<Listing> => {
    try {
      // Get the auth token from cookies
      const cookies = document.cookie.split(";").reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split("=");
        return { ...cookies, [name]: value };
      }, {} as Record<string, string>);

      const authToken = cookies.authToken || cookies["auth.token"];

      if (!authToken) {
        throw new Error("No authentication token found in cookies");
      }

      // Make sure documentId is not empty
      if (!documentId) {
        throw new Error("Document ID is required");
      }
      const response = await fetch(
        `${API_BASE_URL}/api/listings/${documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            data: {
              listingStatus: listingData.listingStatus,
            },
          }),
        }
      );
      console.log("response", response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update listing status");
      }

      const result = await response.json();

      // Handle API response format
      if (result && result.data) {
        return result.data;
      }

      throw new Error("Invalid response format from server");
    } catch (error) {
      console.error(
        `Error updating listing status for ID ${documentId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Delete listing
   * @param id Listing ID
   * @returns Promise with deletion status
   */
  deleteListing: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
        method: "DELETE",
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting listing with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update listing status
   * @param id Listing ID
   * @param status New status (approved, rejected, pending)
   * @returns Promise with updated listing
   */
};

export default BusinessListingService;
