"use client";

import SubscriptionSkeleton from "@/components/Skeletons/SubscriptionSkeleton";
import {
  SubscriptionPlan as SubscriptionPlanType,
  subscriptionService,
} from "@/services/subscriptionService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";
import { RiVipCrownFill } from "react-icons/ri";
import { useImmerReducer } from "use-immer";

// Define local type that matches our service's SubscriptionPlan
type SubscriptionPlanItem = SubscriptionPlanType;

// Define action types for the SubscriptionPlan component
type SubscriptionPlanAction =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_PLANS"; payload: SubscriptionPlanItem[] }
  | { type: "SET_FILTERED_PLANS"; payload: SubscriptionPlanItem[] }
  | { type: "SET_SHOW_DELETE_MODAL"; payload: boolean }
  | { type: "SET_PLAN_TO_DELETE"; payload: SubscriptionPlanItem | null }
  | { type: "RESET_SEARCH" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Define state type for the SubscriptionPlan component
interface SubscriptionPlanState {
  searchTerm: string;
  plans: SubscriptionPlanItem[];
  filteredPlans: SubscriptionPlanItem[];
  showDeleteModal: boolean;
  planToDelete: SubscriptionPlanItem | null;
  loading: boolean;
  error: string | null;
}

// Define reducer for the SubscriptionPlan component
const subscriptionPlanReducer = (
  draft: SubscriptionPlanState,
  action: SubscriptionPlanAction
) => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      draft.searchTerm = action.payload;
      break;
    case "SET_PLANS":
      draft.plans = action.payload;
      break;
    case "SET_FILTERED_PLANS":
      draft.filteredPlans = action.payload;
      break;
    case "SET_SHOW_DELETE_MODAL":
      draft.showDeleteModal = action.payload;
      break;
    case "SET_PLAN_TO_DELETE":
      draft.planToDelete = action.payload;
      break;
    case "RESET_SEARCH":
      draft.searchTerm = "";
      break;
    case "SET_LOADING":
      draft.loading = action.payload;
      break;
    case "SET_ERROR":
      draft.error = action.payload;
      break;
  }
};

export default function SubscriptionPlan() {
  const router = useRouter();
  const [state, dispatch] = useImmerReducer(subscriptionPlanReducer, {
    searchTerm: "",
    plans: [],
    filteredPlans: [],
    showDeleteModal: false,
    planToDelete: null,
    loading: true,
    error: null,
  });

  // State to track if component is mounted (client-side only)
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch subscription plans data
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const data = await subscriptionService.getAllPlans();
        // Ensure data is an array
        const plansArray = Array.isArray(data) ? data : [];
        dispatch({ type: "SET_PLANS", payload: plansArray });
        dispatch({ type: "SET_FILTERED_PLANS", payload: plansArray });
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Oops! No subscription plans available at the moment.",
        });
      } finally {
        // Add a small delay to show the skeleton for a moment
        setTimeout(() => {
          dispatch({ type: "SET_LOADING", payload: false });
        }, 300);
      }
    };

    fetchData();
  }, [dispatch]);

  // Filter plans based on search term
  useEffect(() => {
    if (state.searchTerm.trim() === "") {
      dispatch({ type: "SET_FILTERED_PLANS", payload: state.plans });
    } else {
      const filtered = state.plans.filter(
        (plan: SubscriptionPlanItem) =>
          plan.planType
            .toLowerCase()
            .includes(state.searchTerm.toLowerCase()) ||
          plan.features.some((feature: string) =>
            feature.toLowerCase().includes(state.searchTerm.toLowerCase())
          )
      );
      dispatch({ type: "SET_FILTERED_PLANS", payload: filtered });
    }
  }, [state.searchTerm, state.plans, dispatch]);

  // Handle reset search
  const handleReset = () => {
    dispatch({ type: "RESET_SEARCH" });
  };

  // Handle add plan
  const handleAddPlan = () => {
    router.push("/subscriptions/create-new-subscription-plan");
  };

  // Handle edit plan
  const handleEditPlan = (plan: SubscriptionPlanItem) => {
    if (!plan.documentId) {
      return;
    }

    const planId = plan.documentId.toString();
    router.push(`/subscriptions/edit-subscription-plan?id=${planId}`);
    console.log(planId);
  };

  // Handle delete plan
  const handleDeletePlan = (plan: SubscriptionPlanItem) => {
    dispatch({ type: "SET_PLAN_TO_DELETE", payload: plan });
    dispatch({ type: "SET_SHOW_DELETE_MODAL", payload: true });
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!state.planToDelete) return;

    const plan = state.planToDelete as SubscriptionPlanType;
    const planId = plan.documentId;

    if (!planId) {
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await subscriptionService.deletePlan(planId);

      // Refresh the plans list after deletion
      const updatedPlans = await subscriptionService.getAllPlans();
      dispatch({ type: "SET_PLANS", payload: updatedPlans });
      dispatch({ type: "SET_FILTERED_PLANS", payload: updatedPlans });

      // Close the modal
      dispatch({ type: "SET_SHOW_DELETE_MODAL", payload: false });
      dispatch({ type: "SET_PLAN_TO_DELETE", payload: null });
    } catch (error) {
      console.error("Error deleting plan:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    dispatch({ type: "SET_SHOW_DELETE_MODAL", payload: false });
    dispatch({ type: "SET_PLAN_TO_DELETE", payload: null });
  };

  // Show loading skeleton while fetching data
  if (state.loading) {
    return <SubscriptionSkeleton activeTab="subscription-plan" />;
  }

  // Show error message if there's an error
  if (state.error) {
    return (
      <div className="p-4 text-xl text-center text-red-500">{state.error}</div>
    );
  }

  // Show skeleton while loading or during client-side hydration
  if (state.loading || !isMounted) {
    return (
      <div className="p-6">
        <SubscriptionSkeleton activeTab="subscription-plan" />
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Delete Confirmation Modal */}
      {state.showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] relative text-center">
            <button
              onClick={handleCancelDelete}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <IoCloseSharp className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Delete Subscription
            </h2>

            <p className="mb-1 text-gray-700">
              Are you sure you want to delete this{" "}
              <span className="text-blue-900">Subscription</span>?
            </p>
            <p className="mb-6 text-gray-700">
              This action is permanent and cannot be undone.
            </p>

            <div className="flex justify-between">
              <button
                onClick={handleCancelDelete}
                className="py-2 px-6 bg-gray-100 text-blue-900 rounded-md font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="py-2 px-6 bg-red-600 text-white rounded-md font-medium cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-96">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-[#C1DADE] rounded-md w-full"
              value={state.searchTerm}
              onChange={(e) =>
                dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
              }
            />
          </div>
          <div className="">
            <button
              className="flex items-center gap-2 text-blue-800 px-4 py-2 border border-blue-800 rounded-md cursor-pointer"
              onClick={handleReset}
            >
              <FiRefreshCw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="bg-[#002C69] text-white flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer"
            onClick={handleAddPlan}
          >
            <FiPlus className="h-4 w-4" />
            Add Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.filteredPlans.map((plan: SubscriptionPlanItem) => (
          <div
            key={plan.documentId}
            className="border border-[#C1DADE] rounded-lg p-6"
          >
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-4">
                {/* Helper function to match plan types case-insensitively */}
                {(() => {
                  // Convert plan type to lowercase for case-insensitive comparison
                  const planTypeLower = plan.planType.toLowerCase();

                  if (planTypeLower.includes("free")) {
                    return (
                      <div className="bg-[#9CA3AF24] p-4 rounded-md">
                        <RiVipCrownFill className="text-[#9CA3AF] border-[4px] border-[#9CA3AF] p-2 rounded-full w-12 h-12" />
                      </div>
                    );
                  } else if (planTypeLower.includes("starter")) {
                    return (
                      <div className="bg-[#FFF8E7] p-4 rounded-md">
                        <RiVipCrownFill className="text-[#F59E0B] border-[4px] border-[#F59E0B] p-2 rounded-full w-12 h-12" />
                      </div>
                    );
                  } else if (planTypeLower.includes("pro")) {
                    return (
                      <div className="bg-[#3C82F624] p-4 rounded-md">
                        <RiVipCrownFill className="text-[#3C82F6] border-[4px] border-[#3C82F6] p-2 rounded-full w-12 h-12" />
                      </div>
                    );
                  } else if (planTypeLower.includes("business")) {
                    return (
                      <div className="bg-[#E4DEFE] p-4 rounded-md">
                        <RiVipCrownFill className="text-[#8B5CF6] border-[4px] border-[#8B5CF6] p-2 rounded-full w-12 h-12" />
                      </div>
                    );
                  }
                  // Default case if no match
                  return (
                    <div className="bg-[#9CA3AF24] p-4 rounded-md">
                      <RiVipCrownFill className="text-[#9CA3AF] border-[4px] border-[#9CA3AF] p-2 rounded-full w-12 h-12" />
                    </div>
                  );
                })()}
                <div>
                  <p className="text-[#8E8E8E] text-lg font-medium">
                    For individuals
                  </p>
                  <h3 className="text-[#002C69] font-bold text-2xl">
                    {plan.planType}
                  </h3>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-[#002C69] cursor-pointer"
                  onClick={() => handleEditPlan(plan)}
                >
                  <FiEdit2 className="h-5 w-5" />
                </button>
                <button
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeletePlan(plan)}
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-1">
              <h2 className="text-3xl font-bold text-[#002C69] mb-1">
                ${plan.price}
              </h2>
              <p className="text-[#8E8E8E] mt-3 font-medium">/{plan.period}</p>
            </div>

            <p className="text-[#8E8E8E] my-4 text-xl">
              Essential features for user.
            </p>

            <ul className="space-y-3">
              {plan.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-[#8E8E8E] text-xl">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {state.filteredPlans.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No subscription plans found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}
