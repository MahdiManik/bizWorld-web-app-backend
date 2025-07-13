/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { setCookie, destroyCookie, parseCookies } from "nookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  image?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  location?: string;
  company?: string;
  website?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface UserUpdatePayload {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  location?: string;
  company?: string;
  website?: string;
  bio?: string;
}

export interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Helper API caller
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookies = parseCookies();
  const token = cookies.authToken;

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Include cookies in the request
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      // Try to parse error response as JSON
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      } catch (jsonError) {
        // If JSON parsing fails, throw generic error with status
        throw new Error(`HTTP error ${response.status}`);
      }
    }

    return (await response.json()) as T;
  } catch (error) {
    console.log("API Request Error:", error);
    throw error;
  }
}

// Auth Service
export const AuthService = {
  login: async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<AuthResponse> => {
    try {
      const response = await apiRequest<{
        jwt: string;
        user: User;
      }>("/api/auth/local", {
        method: "POST",
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      });

      if (!response || !response.jwt || !response.user) {
        throw new Error("Login failed. Invalid response from server.");
      }

      const { jwt: token, user } = response;

      // Set the cookie with appropriate options
      setCookie(null, "authToken", token, {
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 8 * 60 * 60, // 30 days or 8 hours
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("rememberMe", rememberMe ? "true" : "false");
      }

      return { token, user };
    } catch (error) {
      console.error("Login error:", error);
      throw error instanceof Error ? error : new Error("Unknown login error");
    }
  },

  logout: async (): Promise<void> => {
    destroyCookie(null, "authToken", { path: "/" });
    if (typeof window !== "undefined") {
      localStorage.removeItem("rememberMe");
    }
  },

  forgotPassword: async (
    email: string
  ): Promise<{ message: string; ok?: boolean }> => {
    try {
      const response = await apiRequest<ApiResponse<null>>(
        "/api/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        }
      );

      return {
        message:
          response.message ||
          "If an account exists, you will receive an email.",
        ok: response.success || (response as any).ok,
      };
    } catch {
      return {
        message: "If an account exists, you will receive an email.",
        ok: false,
      };
    }
  },

  verifyOTP: async (
    email: string,
    otp: string
  ): Promise<{ verified: boolean }> => {
    try {
      const response = await apiRequest<any>("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });
      if (response && (response.data?.code || response.data?.jwt)) {
        if (response.data.code) {
          sessionStorage.setItem("resetCode", response.data.code);
        }
        return { verified: true };
      }

      throw new Error(response.message || "OTP verification failed");
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error instanceof Error
        ? error
        : new Error("OTP verification failed");
    }
  },

  resetPassword: async (
    email: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    try {
      // Get the reset code from sessionStorage
      const code = sessionStorage.getItem("resetCode");

      if (!code) {
        throw new Error(
          "Reset code not found. Please try the forgot password process again."
        );
      }

      const response = await apiRequest<ApiResponse<null>>(
        "/api/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            password: newPassword,
            passwordConfirmation: newPassword,
            code: code,
          }),
        }
      );

      // Clear the reset code from sessionStorage after successful reset
      sessionStorage.removeItem("resetCode");

      return { message: response.message || "Password reset successful" };
    } catch (error) {
      console.error("Password reset error:", error);
      throw error instanceof Error ? error : new Error("Password reset failed");
    }
  },

  isAuthenticated: (): boolean => {
    const cookies = parseCookies();
    return !!cookies.authToken;
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (!AuthService.isAuthenticated()) {
      return null;
    }

    try {
      const cookies = parseCookies();
      const token = cookies.authToken;
      if (!token) {
        return null;
      }

      const apiUrl = API_BASE_URL || "";

      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      headers.set("Authorization", `Bearer ${token}`);

      const response = await fetch(`${apiUrl}/api/users/me`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to get user data: ${response.status}`);
      }

      const data = await response.json();
      if (data && typeof data === "object") {
        // If data.data exists and is an object, return it
        if (data.data && typeof data.data === "object") {
          return data.data;
        }
        // If data itself looks like a user object, return it
        else if ("id" in data && "email" in data) {
          return data;
        }
        // If data.user exists, return it
        else if (data.user && typeof data.user === "object") {
          return data.user;
        }
      }
      return null;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("token") ||
          error.message.includes("authentication"))
      ) {
        return null;
      }
      throw error;
    }
  },

  updateProfile: async (userData: UserUpdatePayload): Promise<User> => {
    try {
      const cookies = parseCookies();
      const token = cookies.authToken;
      if (!token) throw new Error("No authentication token found");

      // Get user ID from token
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) throw new Error("Invalid token format");

      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.id || payload.userId || payload.sub;
      if (!userId) throw new Error("User ID not found in token");

      const cleanedUserData = { ...userData };
      Object.keys(cleanedUserData).forEach((key) => {
        const value = cleanedUserData[key as keyof UserUpdatePayload];
        if (typeof value === "string") {
          cleanedUserData[key as keyof UserUpdatePayload] = value.trim() as any;
        }
      });

      // Convert fullName to name if needed for API compatibility
      if (cleanedUserData.fullName && !("name" in cleanedUserData)) {
        (cleanedUserData as any).name = cleanedUserData.fullName;
      }

      try {
        const response = await apiRequest<ApiResponse<User>>(
          `/api/users/${userId}`,
          {
            method: "PUT",
            body: JSON.stringify(cleanedUserData),
          }
        );

        if (!response.success || !response.data) {
          throw new Error(response.message || "Profile update failed");
        }

        return response.data;
      } catch (apiError) {
        throw apiError;
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error("Profile update failed");
    }
  },

  changePassword: async (
    data: PasswordChangePayload
  ): Promise<{ message: string }> => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      const cookies = parseCookies();
      const token = cookies.authToken;
      if (!token) throw new Error("No authentication token found");

      const apiPayload = {
        currentPassword: data.currentPassword,
        password: data.newPassword,
        passwordConfirmation: data.confirmPassword,
      };

      const response = await apiRequest<ApiResponse<null>>(
        `/api/auth/change-password`,
        {
          method: "POST",
          body: JSON.stringify(apiPayload),
        }
      );

      return {
        message: response.message || "Password changed successfully",
      };
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Password change failed");
    }
  },
};

export default AuthService;
