"use client";

import Image from "next/image";
import { useImmerReducer } from "use-immer";
import { LuPlus } from "react-icons/lu";
import { useRouter } from "next/navigation";
import {
  UserManagementService,
  User,
} from "@/services/usermanagement.services";
import { toast } from "react-toastify";

type State = {
  images: Array<string | null>;
  selectedCountry: string;
  showCustomField: boolean;
  fullName: string;
  email: string;
  phone: string;
  isSubmitting: boolean;
  error: string | null;
};

type Action =
  | { type: "SET_IMAGE"; payload: { index: number; value: string } }
  | { type: "CLEAR_IMAGE"; payload: number }
  | { type: "ADD_IMAGE" }
  | { type: "TOGGLE_CUSTOM_FIELD" }
  | { type: "SET_COUNTRY"; payload: string }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case "SET_IMAGE":
      draft.images[action.payload.index] = action.payload.value;
      return;
    case "CLEAR_IMAGE":
      draft.images[action.payload] = null;
      return;
    case "ADD_IMAGE":
      draft.images.push(null);
      return;
    case "TOGGLE_CUSTOM_FIELD":
      draft.showCustomField = !draft.showCustomField;
      return;
    case "SET_COUNTRY":
      draft.selectedCountry = action.payload;
      return;
    case "SET_NAME":
      draft.fullName = action.payload;
      return;
    case "SET_EMAIL":
      draft.email = action.payload;
      return;
    case "SET_PHONE":
      draft.phone = action.payload;
      return;
    case "SET_SUBMITTING":
      draft.isSubmitting = action.payload;
      return;
    case "SET_ERROR":
      draft.error = action.payload;
      return;
  }
}

export default function CreateUserForm() {
  const router = useRouter();
  const [state, dispatch] = useImmerReducer(reducer, {
    images: [null],
    selectedCountry: "SG",
    showCustomField: false,
    fullName: "",
    email: "",
    phone: "",
    isSubmitting: false,
    error: null,
  });

  const handleSubmit = async () => {
    // Validate form
    if (!state.fullName.trim()) {
      return;
    }

    if (!state.email.trim()) {
      return;
    }

    if (!state.phone.trim()) {
      return;
    }

    try {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // Extract username from email (part before @)
      const username = state.email.split("@")[0];

      // Prepare user data with all required fields for Strapi
      const userData: Omit<User, "id" | "joinDate" | "createdAt"> & {
        username: string;
        password: string;
        role: string;
      } = {
        fullName: state.fullName,
        email: state.email,
        phone: state.phone,
        country: state.selectedCountry,
        userStatus: "PENDING", // Default status for new users
        username: username,
        password: state.email, // Using email as initial password (should be changed by user)
        role: "Public", // Default role
      };

      // Add image if it exists
      if (state.images[0]) {
        userData.image = state.images[0];
      }

      // Create user
      await UserManagementService.createUser(userData);
      toast.success("User created successfully");

      router.push("/user-management");
    } catch (error) {
      console.error("Error creating user:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to create user. Please try again.",
      });
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  return (
    <div className="">
      <div className="w-full bg-white rounded-lg p-3">
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left Column */}
            <div>
              {state.images.map((image, index) => (
                <div className="mb-6 w-2/3" key={index}>
                  <label className="block text-gray-500 text-sm mb-2">
                    {index === 0
                      ? "Upload Picture"
                      : `Upload Picture ${index + 1}`}
                  </label>
                  <div
                    className="border border-dashed border-blue-300 rounded-md bg-blue-50 h-52 flex flex-col items-center justify-center cursor-pointer"
                    onClick={() =>
                      document.getElementById(`file-upload-${index}`)?.click()
                    }
                  >
                    {image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt="Uploaded"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="w-6 h-6 rounded-full bg-[#002C69] text-white flex items-center justify-center mb-1">
                          <LuPlus />
                        </div>
                        <span className="text-[#002C69] text-sm font-medium">
                          Add Photos
                        </span>
                      </>
                    )}
                    <input
                      id={`file-upload-${index}`}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            if (e.target?.result) {
                              dispatch({
                                type: "SET_IMAGE",
                                payload: {
                                  index,
                                  value: e.target.result as string,
                                },
                              });
                            }
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-5">
                <label className="block text-gray-500 text-sm mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={state.fullName}
                  onChange={(e) =>
                    dispatch({ type: "SET_NAME", payload: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
                />
              </div>

              <div className="mb-5">
                <label className="block text-gray-500 text-sm mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={state.email}
                    onChange={(e) =>
                      dispatch({ type: "SET_EMAIL", payload: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-gray-500 text-sm mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="Enter Phone"
                  value={state.phone}
                  onChange={(e) =>
                    dispatch({ type: "SET_PHONE", payload: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
                />
              </div>
            </div>
          </div>
          {state.showCustomField && (
            <div className="w-full mt-4 bg-white rounded-lg border border-gray-200 p-3">
              <h1 className="text-lg font-medium">Add Custom Field</h1>
              <div className="md:flex items-center justify-between w-full gap-4">
                <div className="mb-5 w-full">
                  <label className="block text-gray-500 text-sm mb-2">
                    Field Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Field Name"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
                  />
                </div>
                <div className="mb-5 w-full">
                  <label className="block text-gray-500 text-sm mb-2">
                    Placeholder (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Placeholder Text"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-2">
                <button className="px-6 py-1.5 bg-[#002C69] text-white text-sm font-medium rounded-md hover:bg-[#002C69]/80 transition-colors cursor-pointer">
                  Add
                </button>
                <button className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="">
            <button
              className="flex items-center text-[#002C69] mt-4 "
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_CUSTOM_FIELD" })}
            >
              <div className="w-5 h-5 rounded-full bg-[#002C69] text-white flex items-center justify-center mr-2">
                <LuPlus />
              </div>
              <span className="text-sm font-medium cursor-pointer">
                Add More
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex mt-8 space-x-3">
          <button
            className="px-6 py-2 bg-[#002C69] text-white font-medium rounded-md hover:bg-[#002C69]/80 transition-colors cursor-pointer"
            onClick={handleSubmit}
            disabled={state.isSubmitting}
          >
            {state.isSubmitting ? "Creating..." : "Create"}
          </button>
          <button
            className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-md border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={() => router.push("/user-management")}
            disabled={state.isSubmitting}
          >
            Cancel
          </button>
        </div>

        {state.error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {state.error}
          </div>
        )}
      </div>
    </div>
  );
}
