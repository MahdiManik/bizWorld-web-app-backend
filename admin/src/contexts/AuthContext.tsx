"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthService, User } from "@/services/authService";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string; ok?: boolean }>;
  verifyOTP: (email: string, otp: string) => Promise<{ verified: boolean }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token on mount
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        
        // Check if we have an auth token
        const cookies = parseCookies();
        const hasToken = !!cookies.authToken;
        
        if (hasToken) {
          // Get the current user data
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
          
          // If we're on the login page, redirect to dashboard
          if (window.location.pathname === '/') {
            router.replace('/dashboard');
          }
        } else {
          // No token, ensure we're logged out
          setUser(null);
          
          // If we're not on the login page, redirect there
          if (window.location.pathname !== '/' && 
              !window.location.pathname.includes('/forgot-password') &&
              !window.location.pathname.includes('/reset-password')) {
            router.replace('/');
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true);
      const response = await AuthService.login(email, password, rememberMe);
      setUser(response.user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
      router.replace('/');
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      return await AuthService.forgotPassword(email);
    } catch (error: any) {
      console.error("Error in forgot password:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setLoading(true);
      return await AuthService.verifyOTP(email, otp);
    } catch (error: any) {
      console.error("Error verifying OTP:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      setLoading(true);
      return await AuthService.resetPassword(email, newPassword);
    } catch (error: any) {
      console.error("Error resetting password:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        forgotPassword,
        verifyOTP,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
