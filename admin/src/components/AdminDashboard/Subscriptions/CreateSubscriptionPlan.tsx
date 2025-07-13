"use client";

import { subscriptionService } from "@/services/subscriptionService";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { toast } from "react-toastify";
import { useImmerReducer } from "use-immer";

// Define state interface
interface PlanFormState {
  loading: boolean;
  formData: {
    type: string;
    price: string;
    period: string;
    features: string[];
  };
}

// Define form field keys type for type safety
type FormFieldKey = keyof Omit<PlanFormState["formData"], "features">;

// Define action types
type PlanFormAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_FORM_FIELD"; field: FormFieldKey; value: string }
  | { type: "UPDATE_FEATURE"; index: number; value: string }
  | { type: "ADD_FEATURE" }
  | { type: "REMOVE_FEATURE"; index: number };

// Define reducer function
const planFormReducer = (draft: PlanFormState, action: PlanFormAction) => {
  switch (action.type) {
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

  // Initialize state with useImmerReducer
  const [state, dispatch] = useImmerReducer(planFormReducer, {
    loading: false,
    formData: {
      type: "",
      price: "",
      period: "",
      features: [""],
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const field = name as FormFieldKey;
    dispatch({ type: "UPDATE_FORM_FIELD", field, value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    dispatch({ type: "UPDATE_FEATURE", index, value });
  };
  const addFeature = () => {
    dispatch({ type: "ADD_FEATURE" });
  };

  const removeFeature = (index: number) => {
    dispatch({ type: "REMOVE_FEATURE", index });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const payload = {
        planType: state.formData.type,
        price: state.formData.price,
        period: state.formData.period,
        features: state.formData.features.filter(
          (feature) => feature.trim() !== ""
        ),
      };
      await subscriptionService.createPlan(payload);
      toast.success("Plan created successfully");
      router.push("/subscriptions");
    } catch (error) {
      console.error("Error creating plan:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleCancel = () => {
    router.push("/subscriptions");
  };

  return (
    <div className="mt-2">
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-md shadow-sm border border-[#C1DADE]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-sm text-gray-700 mb-1 font-medium">
                Plan Type
              </div>
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
              <div className="text-sm text-gray-700 mb-1 font-medium">
                Price
              </div>
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

            <div className="mb-6">
              <div className="text-sm text-gray-700 mb-1 font-medium">
                Billing Period
              </div>
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
                  <MdOutlineKeyboardArrowDown />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-700 font-medium">Features</div>
              <button
                type="button"
                onClick={addFeature}
                className="text-sm text-[#002C69] cursor-pointer"
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
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <IoCloseOutline />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-[#002C69] text-white font-medium rounded hover:bg-[#002C69]/90 focus:outline-none cursor-pointer"
          >
            Create Plan
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none text-gray-700 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreateSubscriptionPlan() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <PlanFormContent />
    </Suspense>
  );
}
