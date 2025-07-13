/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { CiLock } from "react-icons/ci";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useImmerReducer } from "use-immer";

type State = {
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  newPassword: string;
  confirmPassword: string;
  errorMessage: string;
  isLoading: boolean;
  email: string;
};

type Action =
  | { type: "TOGGLE_NEW_PASSWORD_VISIBILITY" }
  | { type: "TOGGLE_CONFIRM_PASSWORD_VISIBILITY" }
  | { type: "SET_NEW_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_EMAIL"; payload: string };

const initialState: State = {
  showNewPassword: false,
  showConfirmPassword: false,
  newPassword: "",
  confirmPassword: "",
  errorMessage: "",
  isLoading: false,
  email: "",
};

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case "TOGGLE_NEW_PASSWORD_VISIBILITY":
      draft.showNewPassword = !draft.showNewPassword;
      break;
    case "TOGGLE_CONFIRM_PASSWORD_VISIBILITY":
      draft.showConfirmPassword = !draft.showConfirmPassword;
      break;
    case "SET_NEW_PASSWORD":
      draft.newPassword = action.payload;
      draft.errorMessage = "";
      break;
    case "SET_CONFIRM_PASSWORD":
      draft.confirmPassword = action.payload;
      draft.errorMessage = "";
      break;
    case "SET_ERROR":
      draft.errorMessage = action.payload;
      break;
    case "SET_LOADING":
      draft.isLoading = action.payload;
      break;
    case "SET_EMAIL":
      draft.email = action.payload;
      break;
  }
}

export default function NewPasswordForm() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const router = useRouter();
  const { resetPassword } = useAuth();

  useEffect(() => {
    // Get email from session storage (set in ForgotPassword component)
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      // If no email is found, redirect to forgot password page
      router.push("/forgot-password");
    } else {
      dispatch({ type: "SET_EMAIL", payload: storedEmail });
    }
  }, [router, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Password validation
    if (state.newPassword.length < 8) {
      dispatch({
        type: "SET_ERROR",
        payload: "Password must be at least 8 characters long",
      });
      return;
    }

    if (state.newPassword !== state.confirmPassword) {
      dispatch({
        type: "SET_ERROR",
        payload: "Passwords do not match",
      });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
     await resetPassword(state.email, state.newPassword);

      // Clear email from session storage after successful password reset
      sessionStorage.removeItem("resetEmail");

      router.push("/reset-complete");
    } catch (error: any) {
      console.error("Error updating password:", error.message);
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to reset password. Please try again.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {state.errorMessage && (
          <div className="text-red-600 text-sm text-center">
            {state.errorMessage}
          </div>
        )}
        {/* New Password */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <CiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={state.showNewPassword ? "text" : "password"}
            placeholder="Enter New Password"
            className="w-full pl-10 pr-10 py-3 border border-[#94A3B8] rounded-md focus:outline-none focus:ring-1 focus:ring-[#002B6B]"
            value={state.newPassword}
            onChange={(e) =>
              dispatch({ type: "SET_NEW_PASSWORD", payload: e.target.value })
            }
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={() => dispatch({ type: "TOGGLE_NEW_PASSWORD_VISIBILITY" })}
          >
            {state.showNewPassword ? (
              <IoEyeOffOutline className="h-5 w-5 text-[#3D4D7E]" />
            ) : (
              <IoEyeOutline className="h-5 w-5 text-[#3D4D7E]" />
            )}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <CiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={state.showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full pl-10 pr-10 py-3 border border-[#94A3B8] rounded-md focus:outline-none focus:ring-1 focus:ring-[#002B6B]"
            value={state.confirmPassword}
            onChange={(e) =>
              dispatch({
                type: "SET_CONFIRM_PASSWORD",
                payload: e.target.value,
              })
            }
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={() =>
              dispatch({ type: "TOGGLE_CONFIRM_PASSWORD_VISIBILITY" })
            }
          >
            {state.showConfirmPassword ? (
              <IoEyeOffOutline className="h-5 w-5 text-[#3D4D7E]" />
            ) : (
              <IoEyeOutline className="h-5 w-5 text-[#3D4D7E]" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={state.isLoading}
          className={`w-full my-6 py-3 font-semibold text-white rounded-md transition-colors ${
            state.isLoading
              ? "bg-[#002C69]/50 cursor-not-allowed"
              : "bg-[#002C69] hover:bg-[#002C69]/80 cursor-pointer"
          }`}
        >
          {state.isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
              <span>Creating...</span>
            </div>
          ) : (
            "Create"
          )}
        </button>

        <div className="flex items-center justify-center">
          <a href="/login" className="text-sm text-[#002C69]">
            Go back to{" "}
            <span className="text-[#002C69] font-semibold cursor-pointer">
              Login Page
            </span>
          </a>
        </div>
      </form>
    </div>
  );
}
