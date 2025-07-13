/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense, useRef } from "react";
import { UserManagementService } from "@/services/usermanagement.services";
import { LuPlus } from "react-icons/lu";
import { useImmerReducer } from "use-immer";
import { toast } from "react-toastify";
import { BiChevronDown } from "react-icons/bi";

// Define Status type
type Status = {
  id: string;
  label: string;
  color: string;
};

// Define available statuses
const statuses: Status[] = [
  { id: "PENDING", label: "Pending", color: "bg-orange-400" },
  { id: "ACTIVE", label: "Approve", color: "bg-green-500" },
  { id: "REJECTED", label: "Reject", color: "bg-red-500" },
];

type State = {
  selectedImage: string | null;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  selectedCountry: string;
  isLoading: boolean;
  showCustomField: boolean;
  userStatus: string;
  isStatusDropdownOpen: boolean;
  isUpdatingStatus: boolean;
};

type Action =
  | { type: "SET_SELECTED_IMAGE"; payload: string }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_COUNTRY"; payload: string }
  | { type: "SET_SELECTED_COUNTRY"; payload: string }
  | { type: "TOGGLE_CUSTOM_FIELD" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_STATUS"; payload: string }
  | { type: "TOGGLE_STATUS_DROPDOWN" }
  | { type: "CLOSE_STATUS_DROPDOWN" }
  | { type: "SET_UPDATING_STATUS"; payload: boolean };

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case "SET_SELECTED_IMAGE":
      draft.selectedImage = action.payload;
      break;
    case "SET_NAME":
      draft.fullName = action.payload;
      break;
    case "SET_EMAIL":
      draft.email = action.payload;
      break;
    case "SET_PHONE":
      draft.phone = action.payload;
      break;
    case "SET_COUNTRY":
      draft.country = action.payload;
      break;
    case "SET_SELECTED_COUNTRY":
      draft.selectedCountry = action.payload;
      break;
    case "TOGGLE_CUSTOM_FIELD":
      draft.showCustomField = !draft.showCustomField;
      break;
    case "SET_LOADING":
      draft.isLoading = action.payload;
      break;
    case "SET_STATUS":
      draft.userStatus = action.payload;
      break;
    case "TOGGLE_STATUS_DROPDOWN":
      draft.isStatusDropdownOpen = !draft.isStatusDropdownOpen;
      break;
    case "CLOSE_STATUS_DROPDOWN":
      draft.isStatusDropdownOpen = false;
      break;
    case "SET_UPDATING_STATUS":
      draft.isUpdatingStatus = action.payload;
      break;
  }
}

function ProfileFormContent() {
  const [state, dispatch] = useImmerReducer(reducer, {
    selectedImage: null,
    fullName: "",
    email: "",
    phone: "",
    country: "+65",
    selectedCountry: "SG",
    isLoading: true,
    showCustomField: false,
    userStatus: "PENDING",
    isStatusDropdownOpen: false,
    isUpdatingStatus: false,
  });

  // Reference for dropdown click outside detection
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the user ID from the URL
  const userId = searchParams.get("id");

  // Effect for handling clicks outside the status dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        dispatch({ type: "CLOSE_STATUS_DROPDOWN" });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Use the service to fetch user data
        const user = await UserManagementService.getUserById(userId);

        if (user) {
          dispatch({ type: "SET_NAME", payload: user.fullName });
          dispatch({ type: "SET_EMAIL", payload: user.email });
          dispatch({ type: "SET_PHONE", payload: user.phone });
          dispatch({ type: "SET_COUNTRY", payload: user.country });
          // If user has a selected country code, set it
          if (user.country && user.country.length === 2) {
            dispatch({ type: "SET_SELECTED_COUNTRY", payload: user.country });
          }
          // If user has an image, set it
          if (user.image) {
            dispatch({ type: "SET_SELECTED_IMAGE", payload: user.image });
          }
          // Set user status if available
          if (user.userStatus) {
            dispatch({ type: "SET_STATUS", payload: user.userStatus });
          }
        } else {
          toast.error("User not found");
          router.push("/user-management");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchUserData();
  }, [userId, router, dispatch]);

  return (
    <div className="">
      <div className="w-full bg-white rounded-lg p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <div className="mb-6 w-2/3">
              <label className="block text-gray-500 text-sm mb-2">
                Upload Picture
              </label>
              <div
                className="border border-dashed border-blue-300 rounded-md bg-blue-50 h-32 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {state.selectedImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={state.selectedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-[#002C69] text-white flex items-center justify-center mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <span className="text-[#002C69] text-sm font-medium">
                      Add Photos
                    </span>
                  </>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        if (e.target?.result) {
                          dispatch({
                            type: "SET_SELECTED_IMAGE",
                            payload: e.target.result as string,
                          });
                        }
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="mb-6">
              <label className="block text-gray-500 text-sm mb-2">Status</label>
              <div
                className="relative inline-block w-full"
                ref={statusDropdownRef}
              >
                {/* Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => dispatch({ type: "TOGGLE_STATUS_DROPDOWN" })}
                  disabled={state.isUpdatingStatus}
                  className="flex items-center justify-between gap-2 px-4 py-2 w-full bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded ${
                        statuses.find((s) => s.id === state.userStatus)
                          ?.color || "bg-gray-400"
                      }`}
                    />
                    <span className="font-medium">
                      {statuses.find((s) => s.id === state.userStatus)?.label ||
                        "Unknown"}
                    </span>
                  </div>
                  <BiChevronDown
                    className={`w-4 h-4 transition-transform ${
                      state.isStatusDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {state.isStatusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {statuses.map((status) => (
                      <button
                        key={status.id}
                        type="button"
                        onClick={async () => {
                          if (!userId || state.isUpdatingStatus) return;

                          try {
                            dispatch({
                              type: "SET_UPDATING_STATUS",
                              payload: true,
                            });
                            await UserManagementService.updateUser(userId, {
                              userStatus: status.id
                            });
                            dispatch({
                              type: "SET_STATUS",
                              payload: status.id,
                            });
                            toast.success(
                              `User status updated to ${status.label}`
                            );
                          } catch (error) {
                            toast.error("Failed to update user status");
                          } finally {
                            dispatch({
                              type: "SET_UPDATING_STATUS",
                              payload: false,
                            });
                            dispatch({ type: "CLOSE_STATUS_DROPDOWN" });
                          }
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-left cursor-pointer hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          state.userStatus === status.id ? "bg-gray-50" : ""
                        }`}
                      >
                        <div className={`w-4 h-4 rounded ${status.color}`} />
                        <span className="font-medium">{status.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
              <label className="block text-gray-500 text-sm mb-2">Email</label>
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

            <div className="mb-6">
              <label className="block text-gray-500 text-sm mb-2">Phone</label>
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
            className="flex items-center text-[#002C69] mt-4"
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_CUSTOM_FIELD" })}
          >
            <div className="w-5 h-5 rounded-full bg-[#002C69] text-white flex items-center justify-center mr-2">
              <LuPlus />
            </div>
            <span className="text-sm font-medium cursor-pointer">Add More</span>
          </button>
        </div>
      </div>
      {/* Bottom Buttons */}
      <div className="flex mt-8 space-x-3">
        <button
          className="px-6 py-2 bg-[#002C69] text-white font-medium rounded-md hover:bg-[#002C69]/80 transition-colors cursor-pointer"
          onClick={async () => {
            if (!userId) {
              return;
            }

            try {
              // Prepare user data for update
              const userData: {
                fullName: string;
                email: string;
                phone: string;
                country: string;
                image?: string;
              } = {
                fullName: state.fullName,
                email: state.email,
                phone: state.phone,
                country: state.selectedCountry,
              };

              // If there's an image, handle it separately
              if (state.selectedImage !== null) {
                const imageStr = String(state.selectedImage || "");
                if (imageStr && imageStr.indexOf("data:") === 0) {
                  // This is a new image that needs to be uploaded
                  // In a real implementation, you would convert the base64 to a file and upload it
                  // For now, we'll just include it in the update
                  userData.image = imageStr;
                }
              }

              // Update the user
              await UserManagementService.updateUser(userId, userData);
              router.push("/user-management");
            } catch (error) {
              console.error("Error updating user:", error);
            }
          }}
        >
          Save
        </button>
        <button
          className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-md border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
          onClick={() => router.push("/user-management")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ProfileForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileFormContent />
    </Suspense>
  );
}
