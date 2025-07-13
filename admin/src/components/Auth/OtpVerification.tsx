/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import OtpInput from "react-otp-input";
import { useImmerReducer } from "use-immer";

type State = {
  otp: string;
  timeLeft: number;
  errorMessage: string;
  isLoading: boolean;
  isResending: boolean;
  email: string;
};

type Action =
  | { type: "SET_OTP"; payload: string }
  | { type: "TICK" }
  | { type: "RESET_TIMER" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_RESENDING"; payload: boolean }
  | { type: "SET_EMAIL"; payload: string };

const initialState: State = {
  otp: "",
  timeLeft: 59,
  errorMessage: "",
  isLoading: false,
  isResending: false,
  email: "",
};

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case "SET_OTP":
      draft.otp = action.payload;
      draft.errorMessage = "";
      break;
    case "TICK":
      if (draft.timeLeft > 0) {
        draft.timeLeft -= 1;
      }
      break;
    case "RESET_TIMER":
      draft.timeLeft = 59;
      break;
    case "SET_ERROR":
      draft.errorMessage = action.payload;
      break;
    case "SET_LOADING":
      draft.isLoading = action.payload;
      break;
    case "SET_RESENDING":
      draft.isResending = action.payload;
      break;
    case "SET_EMAIL":
      draft.email = action.payload;
      break;
  }
}

export default function OTPVerificationForm() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const { verifyOTP, forgotPassword } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Get email from session storage (set in ForgotPassword component)
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      // If no email is found, redirect to forgot password page
      router.replace("/forgot-password");
    } else {
      dispatch({ type: "SET_EMAIL", payload: storedEmail });
    }

    const timer = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.email) {
      dispatch({
        type: "SET_ERROR",
        payload: "Email not found. Please go back and try again.",
      });
      return;
    }

    if (state.otp.length !== 4) {
      dispatch({
        type: "SET_ERROR",
        payload: "Please enter a valid 4-digit OTP",
      });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const result = await verifyOTP(state.email, state.otp);

      if (result.verified) {
        router.push("/new-password");
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Invalid or expired OTP. Please try again.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleResend = async () => {
    try {
      dispatch({ type: "SET_RESENDING", payload: true });
      await forgotPassword(state.email);
      dispatch({ type: "RESET_TIMER" });
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to resend OTP. Please try again.",
      });
    } finally {
      dispatch({ type: "SET_RESENDING", payload: false });
    }
  };

  if (!state.email) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <OtpInput
            value={state.otp}
            onChange={(value) => dispatch({ type: "SET_OTP", payload: value })}
            numInputs={4}
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              width: "3rem",
              height: "3rem",
              margin: "0 0.5rem",
              fontSize: "1.5rem",
              borderRadius: "4px",
              border: "none",
              borderBottom: "2px solid #CBD5E0",
              outline: "none",
              textAlign: "center",
            }}
            containerStyle={{
              justifyContent: "center",
            }}
            shouldAutoFocus
          />
        </div>

        {state.errorMessage && (
          <div className="text-red-600 text-sm text-center">
            {state.errorMessage}
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          code expires in:{" "}
          {String(Math.floor(state.timeLeft / 60)).padStart(2, "0")}:
          {String(state.timeLeft % 60).padStart(2, "0")}
        </div>

        <button
          type="submit"
          disabled={state.isLoading}
          className={`w-full py-3 font-semibold text-white rounded-md transition-colors ${
            state.isLoading
              ? "bg-[#002C69]/50 cursor-not-allowed"
              : "bg-[#002C69] hover:bg-[#002C69]/80 cursor-pointer"
          }`}
        >
          {state.isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
              <span>Verifying...</span>
            </div>
          ) : (
            "Verify"
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={state.isResending || state.timeLeft > 0}
            className={`text-md ${
              state.timeLeft > 0 || state.isResending
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
          >
            Didn&apos;t receive a code?{" "}
            <span
              className={`text-[#002B6B] font-semibold ${
                state.timeLeft > 0 || state.isResending ? "" : "hover:underline"
              }`}
            >
              {state.isResending ? "Resending..." : "Resend"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
