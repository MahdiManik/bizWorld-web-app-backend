/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { BsEye } from "react-icons/bs";
import { CiLock, CiMail } from "react-icons/ci";
import { IoEyeOff } from "react-icons/io5";
import { useImmerReducer } from "use-immer";

type State = {
  showPassword: boolean;
  email: string;
  password: string;
  rememberMe: boolean;
  errorMessage: string;
  loading: boolean;
};

type Action =
  | { type: "TOGGLE_PASSWORD_VISIBILITY" }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_REMEMBER_ME"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: State = {
  showPassword: false,
  email: "",
  password: "",
  rememberMe: false,
  errorMessage: "",
  loading: false,
};

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case "TOGGLE_PASSWORD_VISIBILITY":
      draft.showPassword = !draft.showPassword;
      break;
    case "SET_EMAIL":
      draft.email = action.payload;
      break;
    case "SET_PASSWORD":
      draft.password = action.payload;
      break;
    case "SET_REMEMBER_ME":
      draft.rememberMe = action.payload;
      break;
    case "SET_ERROR":
      draft.errorMessage = action.payload;
      break;
    case "SET_LOADING":
      draft.loading = action.payload;
      break;
  }
}

export default function LoginForm() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const { signIn, loading } = useAuth();
  const router = useRouter();

  const forgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.email || !state.password) {
      dispatch({
        type: "SET_ERROR",
        payload: "Please enter both email and password",
      });
      return;
    }

    try {
      dispatch({ type: "SET_ERROR", payload: "" });
      dispatch({ type: "SET_LOADING", payload: true });

      // Call signIn from AuthContext - this will handle the API call and navigation
      // Pass the rememberMe state to persist login if checked
      await signIn(state.email, state.password, state.rememberMe);
    } catch (error: any) {
      console.error("Error signing in:", error);
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({
        type: "SET_ERROR",
        payload:
          error.message || "Invalid email or password. Please try again.",
      });
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
            className="w-full pl-10 pr-3 py-3 font-medium border text-[#002C69] border-[#94A3B8] rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
            value={state.email}
            onChange={(e) =>
              dispatch({ type: "SET_EMAIL", payload: e.target.value })
            }
            required
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <CiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={state.showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-3 font-medium border text-[#002C69] border-[#94A3B8] rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
            value={state.password}
            onChange={(e) =>
              dispatch({ type: "SET_PASSWORD", payload: e.target.value })
            }
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={() => dispatch({ type: "TOGGLE_PASSWORD_VISIBILITY" })}
          >
            {state.showPassword ? (
              <IoEyeOff className="h-5 w-5 text-[#3D4D7E]" />
            ) : (
              <BsEye className="h-5 w-5 text-[#3D4D7E]" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#94A3B8] text-[#002C69] focus:ring-[#002C69] cursor-pointer"
              checked={state.rememberMe}
              onChange={(e) =>
                dispatch({
                  type: "SET_REMEMBER_ME",
                  payload: e.target.checked,
                })
              }
            />
            <span className="text-[#002C69]">Remember Me</span>
          </label>
          <a
            onClick={forgotPassword}
            className="text-[#002C69] hover:underline cursor-pointer"
          >
            Forgot Password?
          </a>
        </div>

        {state.errorMessage && (
          <div className="text-sm text-red-600">{state.errorMessage}</div>
        )}
        <button
          type="submit"
          disabled={state.loading}
          className={`w-full py-3 font-semibold text-white rounded-md transition-colors ${
            state.loading
              ? "bg-[#002C69]/50 cursor-not-allowed"
              : "bg-[#002C69] hover:bg-[#002C69]/80 cursor-pointer"
          }`}
        >
          {state.loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
              <span>Logging in...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}
