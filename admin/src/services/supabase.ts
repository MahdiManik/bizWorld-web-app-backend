
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// For production environment - uncomment this to use Constants
// const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || '';
// const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase configuration. Please check your app.config.js file."
  );
}

// Create the Supabase client with proper typing for v2.49.4
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Authentication service for handling user registration and login
 */
export class AuthService {
  /**
   * Register a new user
   * @param email User's email
   * @param password User's password
   * @returns Promise with the registration result
   */
  static async register(email: string, password: string) {
    try {
      // Using type assertion to bypass TypeScript error
      // This is safe because we know the method exists in the actual runtime API
      const { data, error } = await (supabase.auth as any).signUp({
        email,
        password,
        options: {
          data: {
            email,
            password,
            role: "admin",
            full_name: "yeakub ali",
          },
        },
      });
      return { data, error };
    } catch (e) {
      console.error("Error in register:", e);
      return { data: null, error: e as Error };
    }
  }

  /**
   * Login an existing user
   * @param email User's email
   * @param password User's password
   * @returns Promise with the login result
   */
  static async login(email: string, password: string) {
    try {
      const { data, error } = await (supabase.auth as any).signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (e) {
      console.error("Error in login:", e);
      return { data: null, error: e as Error };
    }
  }

  /**
   * Logout the current user
   * @returns Promise with the logout result
   */
  static async logout() {
    try {
      const { error } = await (supabase.auth as any).signOut();
      return { error };
    } catch (e) {
      console.error("Error in logout:", e);
      return { error: e as Error };
    }
  }

  /**
   * Reset password for a user
   * @param email User's email
   * @returns Promise with the password reset result
   */
  static async resetPassword(email: string) {
    try {
      // Using type assertion to bypass TypeScript error
      // This is safe because we know the method exists in the actual runtime API
      const { data, error } = await (
        supabase.auth as any
      ).resetPasswordForEmail(email, {
        redirectTo: "ventureNest://reset-password",
      });

      return { data, error };
    } catch (e) {
      console.error("Error in resetPassword:", e);
      return { data: null, error: e as Error };
    }
  }

  /**
   * Get the current user session
   * @returns Promise with the current session
   */
  static async getSession() {
    try {
      return await (supabase.auth as any).getSession();
    } catch (e) {
      console.error("Error in getSession:", e);
      return { data: { session: null }, error: e as Error };
    }
  }

  /**
   * Get the current user
   * @returns The current user or null
   */
  static async getCurrentUser() {
    try {
      const { data } = await (supabase.auth as any).getUser();
      return data.user;
    } catch (e) {
      console.error("Error in getCurrentUser:", e);
      return null;
    }
  }

  /**
   * Update user password
   * @param newPassword The new password to set
   * @returns Promise with the update result
   */
  static async updatePassword(newPassword: string) {
    try {
      const { data, error } = await (supabase.auth as any).updateUser({
        password: newPassword,
      });
      return { data, error };
    } catch (e) {
      console.error("Error in updatePassword:", e);
      return { data: null, error: e as Error };
    }
  }
}
