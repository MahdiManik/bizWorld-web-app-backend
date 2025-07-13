/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/services/supabase";
import { useImmerReducer } from "use-immer";

// Loading component for Suspense fallback
const SetPasswordLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
      <h1 className="text-2xl font-semibold mb-6 text-[#002C69] text-center">
        Set Your Password
      </h1>
      <div className="text-center py-4">
        <div className="animate-spin h-8 w-8 border-4 border-[#002C69] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-[#002C69] font-semibold">Loading...</p>
      </div>
    </div>
  </div>
);

// Inner component that uses searchParams
function SetPasswordForm() {
  const searchParams = useSearchParams();

  const initialState = {
    password: "",
    confirmPassword: "",
    loading: false,
    error: null as string | null,
    tokenVerified: false,
    email: null as string | null,
  };

  type Action =
    | { type: "SET_PASSWORD"; payload: string }
    | { type: "SET_CONFIRM_PASSWORD"; payload: string }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_TOKEN_VERIFIED"; payload: boolean }
    | { type: "SET_EMAIL"; payload: string | null };

  const reducer = (draft: typeof initialState, action: Action) => {
    switch (action.type) {
      case "SET_PASSWORD":
        draft.password = action.payload;
        break;
      case "SET_CONFIRM_PASSWORD":
        draft.confirmPassword = action.payload;
        break;
      case "SET_LOADING":
        draft.loading = action.payload;
        break;
      case "SET_ERROR":
        draft.error = action.payload;
        break;
      case "SET_TOKEN_VERIFIED":
        draft.tokenVerified = action.payload;
        break;
      case "SET_EMAIL":
        draft.email = action.payload;
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  // Extract token from URL and verify it with Supabase
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          dispatch({
            type: "SET_ERROR",
            payload:
              "Invalid or missing token. Please check your invitation link.",
          });
          return;
        }

        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          console.error("Error verifying token:", error);
          dispatch({
            type: "SET_ERROR",
            payload:
              "Invalid or expired token. Please request a new invitation.",
          });
          return;
        }

        dispatch({ type: "SET_TOKEN_VERIFIED", payload: true });
        if (data.session.user.email) {
          dispatch({ type: "SET_EMAIL", payload: data.session.user.email });
        }
      } catch (err) {
        console.error("Error during token verification:", err);
        dispatch({
          type: "SET_ERROR",
          payload: "An error occurred while verifying your invitation.",
        });
      }
    };

    verifyToken();
  }, [searchParams, dispatch]);

  const handleSetPassword = async () => {
    if (state.password.length < 8) {
      dispatch({
        type: "SET_ERROR",
        payload: "Password must be at least 8 characters long",
      });
      return;
    }

    if (state.password !== state.confirmPassword) {
      dispatch({
        type: "SET_ERROR",
        payload: "Passwords do not match",
      });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const { error } = await supabase.auth.updateUser({
        password: state.password,
      });

      if (error) {
        console.error("Error updating password:", error);
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Failed to set password. Please try again.",
        });
        return;
      }

      await supabase.auth.signOut();
    } catch (err: any) {
      console.error("Error in password update:", err);
      dispatch({
        type: "SET_ERROR",
        payload: err.message || "An error occurred while setting your password",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-semibold mb-6 text-[#002C69] text-center">
          Set Your Password
        </h1>

        {state.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {state.error}
          </div>
        )}

        {!state.tokenVerified ? (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-[#002C69] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[#002C69] font-semibold">
              Verifying your invitation...
            </p>
          </div>
        ) : (
          <>
            {state.email && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md mb-4">
                Setting password for: <strong>{state.email}</strong>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full pl-10 pr-10 py-3 font-medium border text-[#002C69] border-[#94A3B8] rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
                value={state.password}
                onChange={(e) =>
                  dispatch({ type: "SET_PASSWORD", payload: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full pl-10 pr-10 py-3 font-medium border text-[#002C69] border-[#94A3B8] rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
                value={state.confirmPassword}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CONFIRM_PASSWORD",
                    payload: e.target.value,
                  })
                }
              />
            </div>

            <button
              onClick={handleSetPassword}
              disabled={state.loading}
              className="w-full bg-[#002C69] text-white py-3 rounded-md hover:bg-[#003694] transition-colors disabled:bg-[#7a92b9] disabled:cursor-not-allowed"
            >
              {state.loading ? "Setting Password..." : "Set Password & Continue"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function SetPassword() {
  return (
    <Suspense fallback={<SetPasswordLoading />}>
      <SetPasswordForm />
    </Suspense>
  );
}
