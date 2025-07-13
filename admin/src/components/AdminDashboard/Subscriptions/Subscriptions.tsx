"use client";

import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import SubscriptionSkeleton from "@/components/Skeletons/SubscriptionSkeleton";
import SubscriptionPlanComponent from "./SubscriptionPlan";
import UserSubscriptionsComponent from "./UserSubscriptions";

// Define action types for the main component
type MainAction = 
  | { type: "SET_ACTIVE_TAB"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

// Define state type for the main component
interface MainState {
  activeTab: string;
  isLoading: boolean;
}

// Define reducer for the main component
const mainReducer = (draft: MainState, action: MainAction) => {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      draft.activeTab = action.payload;
      break;
    case "SET_LOADING":
      draft.isLoading = action.payload;
      break;
  }
};

export default function SubscriptionsManagement() {
  const [state, dispatch] = useImmerReducer<MainState, MainAction>(mainReducer, {
    activeTab: "subscription-plan",
    isLoading: true
  });

  // Fetch data
  useEffect(() => {
    // Add a small delay to show the skeleton for a moment
    const timer = setTimeout(() => {
      dispatch({ type: "SET_LOADING", payload: false });
    });

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="mt-6">
      {state.isLoading ? (
        <SubscriptionSkeleton activeTab={state.activeTab} />
      ) : (
        <>
          <div className="border-b border-gray-200 sticky top-2 z-50 bg-white">
            <div className="flex">
              <button
                className={`py-4 px-6 font-medium cursor-pointer text-xl ${
                  state.activeTab === "subscription-plan"
                    ? "text-[#002C69] border-b-2 border-[#002C69]"
                    : "text-[#002C69]"
                }`}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_TAB", payload: "subscription-plan" })
                }
              >
                Subscription Plan
              </button>
              <button
                className={`py-4 px-6 font-medium cursor-pointer text-xl ${
                  state.activeTab === "user-subscriptions"
                    ? "text-[#002C69] border-b-2 border-[#002C69]"
                    : "text-[#002C69]"
                }`}
                onClick={() =>
                  dispatch({
                    type: "SET_ACTIVE_TAB",
                    payload: "user-subscriptions",
                  })
                }
              >
                User Subscriptions
              </button>
            </div>
          </div>

          {state.activeTab === "subscription-plan" ? (
            <SubscriptionPlanComponent />
          ) : (
            <UserSubscriptionsComponent />
          )}
        </>
      )}
    </div>
  );
}
