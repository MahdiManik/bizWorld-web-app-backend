/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import type React from "react";
import { CiMail } from "react-icons/ci";
import { useImmerReducer } from "use-immer";

type State = {
  email: string;
  successMessage: string;
  errorMessage: string;
};

type Action =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_SUCCESS_MESSAGE"; payload: string }
  | { type: "SET_ERROR_MESSAGE"; payload: string };

const initialState: State = {
  email: "",
  successMessage: "",
  errorMessage: "",
};

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case "SET_EMAIL":
      draft.email = action.payload;
      break;
    case "SET_SUCCESS_MESSAGE":
      draft.successMessage = action.payload;
      draft.errorMessage = "";
      break;
    case "SET_ERROR_MESSAGE":
      draft.errorMessage = action.payload;
      draft.successMessage = "";
      break;
  }
}

export default function ForgotPasswordForm() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const login = () => {
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(state.email);

      if (response.ok) {
        sessionStorage.setItem("resetEmail", state.email);
        router.push("/otp-verification");
      } else {
        dispatch({
          type: "SET_SUCCESS_MESSAGE",
          payload: response.message,
        });
      }
    } catch (error: any) {
      dispatch({ type: "SET_ERROR_MESSAGE", payload: error.message });
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <CiMail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-10 py-3 font-medium border text-[#002C69] border-[#94A3B8] rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
            value={state.email}
            onChange={(e) =>
              dispatch({ type: "SET_EMAIL", payload: e.target.value })
            }
            required
          />
        </div>

        {state.successMessage && (
          <p className="text-[#002C69] font-medium text-sm">
            {state.successMessage}
          </p>
        )}

        {state.errorMessage && (
          <p className="text-red-600 font-medium text-sm">
            {state.errorMessage}
          </p>
        )}

        <button
          type="submit"
          className="w-full my-6 py-3 cursor-pointer font-semibold bg-[#002B6B] text-white rounded-md hover:bg-[#001F4D] transition-colors"
        >
          Continue
        </button>

        <div className="flex items-center justify-center">
          <p onClick={login} className="text-sm text-[#002B6B]">
            Go back to{" "}
            <span className="text-[#002B6B] font-semibold cursor-pointer hover:underline">
              Login Page
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
