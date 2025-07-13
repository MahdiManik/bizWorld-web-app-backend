"use client";

import { useEffect, Suspense } from "react";
import { useImmerReducer } from "use-immer";
import { useRouter, useSearchParams } from "next/navigation";
import {
  subscriptionService,
  SubscriptionPlan,
} from "@/services/subscriptionService";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";

// Define local interface that matches our service's SubscriptionPlan
type SubscriptionPlanItem = SubscriptionPlan;

// Define state interface
interface PlanFormState {
  plan: SubscriptionPlanItem | null;
  loading: boolean;
  formData: {
    type: string;
    forType: string;
    price: string;
    period: string;
    features: string[];
  };
}

// Define form field keys type for type safety
type FormFieldKey = keyof Omit<PlanFormState["formData"], "features">;

// Define action types
type PlanFormAction =
  | { type: "SET_PLAN"; payload: SubscriptionPlanItem }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_FORM_FIELD"; field: FormFieldKey; value: string }
  | { type: "UPDATE_FEATURE"; index: number; value: string }
  | { type: "ADD_FEATURE" }
  | { type: "REMOVE_FEATURE"; index: number };

// Define reducer function
const planFormReducer = (draft: PlanFormState, action: PlanFormAction) => {
  switch (action.type) {
    case "SET_PLAN":
      draft.plan = action.payload;
      console.log("Setting form data from plan:", action.payload);
      draft.formData = {
        type: action.payload.planType || "",
        forType: action.payload.forType || "",
        price: action.payload.price || "",
        period: action.payload.period || "",
        features: Array.isArray(action.payload.features)
          ? action.payload.features
          : [],
      };
      console.log("Form data set to:", draft.formData);
      break;
    case "SET_LOADING":
      draft.loading = action.payload;
      break;
    case "UPDATE_FORM_FIELD":
      draft.formData[action.field] = action.value;
      break;
    case "UPDATE_FEATURE":
      draft.formData.features[action.index] = action.value;
      break;
    case "ADD_FEATURE":
      draft.formData.features.push("");
      break;
    case "REMOVE_FEATURE":
      draft.formData.features = draft.formData.features.filter(
        (_, i) => i !== action.index
      );
      break;
  }
};

function PlanFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("id");

  // Initialize state with useImmerReducer
  const [state, dispatch] = useImmerReducer(planFormReducer, {
    plan: null,
    loading: true,
    formData: {
      type: "",
      forType: "",
      price: "",
      period: "",
      features: [""],
    },
  });

  // Fetch plan data based on ID
  useEffect(() => {
    const fetchPlanData = async () => {
      if (!planId) {
        console.error("No plan ID provided in URL");
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      try {
        const planData = await subscriptionService.getPlanById(planId);
        if (!planData) {
          throw new Error("No plan data returned from API");
        }

        const apiResponse = planData as SubscriptionPlan & {
          data?: SubscriptionPlan;
        };
        const plan = apiResponse.data || apiResponse;

        if (!plan) {
          throw new Error("Invalid plan data structure");
        }

        dispatch({ type: "SET_PLAN", payload: plan });
      } catch (error) {
        console.error("Error fetching plan data:", error);
        toast.error("Failed to load plan data. Please try again.");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchPlanData();
  }, [planId, dispatch, router]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const field = name as FormFieldKey;
    dispatch({ type: "UPDATE_FORM_FIELD", field, value });
  };

  // Handle feature changes
  const handleFeatureChange = (index: number, value: string) => {
    dispatch({ type: "UPDATE_FEATURE", index, value });
  };

  // Add new feature field
  const addFeature = () => {
    dispatch({ type: "ADD_FEATURE" });
  };

  // Remove feature field
  const removeFeature = (index: number) => {
    dispatch({ type: "REMOVE_FEATURE", index });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planId) return;

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const payload = {
        planType: state.formData.type,
        price: state.formData.price,
        period: state.formData.period,
        features: state.formData.features.filter(
          (feature) => feature.trim() !== ""
        ), // Remove empty features
      };

      console.log("Updating plan with:", payload);
      const updatedPlan = await subscriptionService.updatePlan(planId, payload);
      console.log("Plan updated:", updatedPlan);
      toast.success("Plan updated successfully");
      router.push("/subscriptions");
    } catch (error) {
      console.error("Error updating plan:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/subscriptions");
  };

  if (state.loading) {
    return <div className="p-4">Loading...</div>;
  }

  if ((!state.plan || !planId) && !state.loading) {
    return <div className="p-4">Plan not found or invalid plan ID</div>;
  }

  return (
    <div className="mt-2">
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-md shadow-sm border border-[#C1DADE]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-sm text-gray-700 mb-1">Plan Type</div>
              <input
                type="text"
                name="type"
                placeholder="Enter Plan Type"
                className="w-full p-2.5 border border-gray-200 rounded bg-gray-50 focus:outline-none"
                value={state.formData.type}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <div className="text-sm text-gray-700 mb-1">Price</div>
              <input
                type="text"
                name="price"
                placeholder="Enter Price"
                className="w-full p-2.5 border border-gray-200 rounded bg-gray-50 focus:outline-none"
                value={state.formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="">
              <div className="text-sm text-gray-700 mb-1">Billing Period</div>
              <div className="relative">
                <select
                  name="period"
                  className="w-full p-2.5 border border-gray-200 rounded bg-gray-50 focus:outline-none appearance-none"
                  value={state.formData.period}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select Billing Period
                  </option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <IoIosArrowDown />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-700">Features</div>
              <button
                type="button"
                onClick={addFeature}
                className="text-sm text-[#002C69] hover:underline"
              >
                + Add Feature
              </button>
            </div>

            {state.formData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Feature ${index + 1}`}
                  className="w-full p-2.5 border border-gray-200 rounded bg-gray-50 focus:outline-none"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  required
                />
                {state.formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-[#002C69] cursor-pointer text-white font-medium rounded hover:bg-[#002C69]/90 focus:outline-none"
          >
            Update Plan
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 cursor-pointer bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none text-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditSubscriptionPlan() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <PlanFormContent />
    </Suspense>
  );
}
