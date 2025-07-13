/* eslint-disable @typescript-eslint/no-unused-vars */
// Define the base API URL from environment variable or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

// Define User interface to be used across components
export interface User {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  joinDate?: string;
  createdAt?: string;
  userStatus: string;
  image?: string | null;
}

// User Management Service
export const UserManagementService = {
  /**
   * Get all users
   * @returns Promise with users array
   */
  getUsers: async (): Promise<User[]> => {
    try {
      // Check if authToken exists in cookies
      const cookies = document.cookie.split(";").reduce((cookies, cookie) => {
        const [name, value] = cookie.split("=").map((c) => c.trim());
        cookies[name] = value;
        return cookies;
      }, {} as Record<string, string>);

      if (!cookies.authToken) {
        return [];
      }

      // Make the authenticated request
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${cookies.authToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await handleResponse(response);

      // Handle API response format: { success, message, data: User[] }
      if (result && typeof result === "object") {
        if (result.success && Array.isArray(result.data)) {
          return result.data;
        } else if (Array.isArray(result)) {
          return result;
        } else if (result.success && Array.isArray(result.users)) {
          return result.users;
        }
      }
      return [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user by ID
   * @param id User ID
   * @returns Promise with user data
   */
  getUserById: async (id: string): Promise<User> => {
    try {
      // Get auth token from cookies
      const cookies = document.cookie.split(";").reduce((cookies, cookie) => {
        const [name, value] = cookie.split("=").map((c) => c.trim());
        cookies[name] = value;
        return cookies;
      }, {} as Record<string, string>);

      const authToken = cookies.authToken;
      if (!authToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });

      const result = await handleResponse(response);

      if (result && typeof result === "object") {
        if (result.success && result.data) {
          return result.data;
        } else if (result.id && (result.email || result.fullName)) {
          return result;
        }
      }

      throw new Error("Invalid user data format");
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new user
   * @param userData User data object
   * @returns Promise with created user data
   */
  createUser: async (
    userData: Omit<User, "id" | "joinDate" | "createdAt"> & {
      username: string;
      password: string;
      role: string;
    }
  ): Promise<User> => {
    try {
      // First, register the user with basic info
      const registerResponse = await fetch(
        `${API_BASE_URL}/api/auth/local/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userData.username,
            email: userData.email,
            password: userData.password,
          }),
        }
      );

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.error?.message || "Failed to register user");
      }

      const { user, jwt } = await registerResponse.json();

      // Then, update the user profile with additional info
      const updateResponse = await fetch(
        `${API_BASE_URL}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            fullName: userData.fullName,
            phone: userData.phone,
            country: userData.country,
            userStatus: userData.userStatus || "PENDING",
            ...(userData.image && { image: userData.image }),
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error("User registered but profile update failed");
      }

      return handleResponse(updateResponse);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user data
   * @param id User ID
   * @param userData Updated user data
   * @returns Promise with updated user data
   */
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      // Get auth token from cookies
      const cookies = document.cookie.split(";").reduce((cookies, cookie) => {
        const [name, value] = cookie.split("=").map((c) => c.trim());
        cookies[name] = value;
        return cookies;
      }, {} as Record<string, string>);

      const authToken = cookies.authToken;
      if (!authToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete user
   * @param id User ID
   * @returns Promise with deletion status
   */
  deleteUser: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const cookies = document.cookie.split(";").reduce((cookies, cookie) => {
        const [name, value] = cookie.split("=").map((c) => c.trim());
        cookies[name] = value;
        return cookies;
      }, {} as Record<string, string>);

      const authToken = cookies.authToken;
      if (!authToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update user status
   * @param id User ID
   * @param status New status value
   * @returns Promise with status update result
   */
  updateUserStatus: async (
    id: string,
    status: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const cookies = document.cookie.split(";").reduce((cookies, cookie) => {
        const [name, value] = cookie.split("=").map((c) => c.trim());
        cookies[name] = value;
        return cookies;
      }, {} as Record<string, string>);

      const authToken = cookies.authToken;
      if (!authToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/users/${id}/userStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            userId: id,
            status: status,
          }),
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating status for user with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload user image
   * @param id User ID
   * @param imageFile Image file to upload
   * @returns Promise with image URL
   */
  uploadUserImage: async (
    id: string,
    imageFile: File
  ): Promise<{ imageUrl: string }> => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(`${API_BASE_URL}/users/${id}/upload-image`, {
        method: "POST",
        body: formData,
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Error uploading user image:", error);
      throw error;
    }
  },
};

export default UserManagementService;
