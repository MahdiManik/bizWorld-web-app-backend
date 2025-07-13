"use client";

import { useImmerReducer } from "use-immer";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";
import user from "../../../../public/user.jpg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useEffect, useState } from "react";
import SettingsSkeleton from "../../Skeletons/SettingSkeleton";
import {
  AuthService,
  UserUpdatePayload,
  PasswordChangePayload,
} from "@/services/authService";
import { toast } from "react-toastify";
import { LuUserRound } from "react-icons/lu";

interface State {
  activeTab: "Profile" | "Security";
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
  loading: boolean;
  updating: boolean;
}

type Action =
  | { type: "SET_TAB"; payload: "Profile" | "Security" }
  | { type: "TOGGLE_SHOW_CURRENT" }
  | { type: "TOGGLE_SHOW_NEW" }
  | { type: "TOGGLE_SHOW_CONFIRM" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_UPDATING"; payload: boolean };

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case "SET_TAB":
      draft.activeTab = action.payload;
      break;
    case "TOGGLE_SHOW_CURRENT":
      draft.showCurrent = !draft.showCurrent;
      break;
    case "TOGGLE_SHOW_NEW":
      draft.showNew = !draft.showNew;
      break;
    case "TOGGLE_SHOW_CONFIRM":
      draft.showConfirm = !draft.showConfirm;
      break;
    case "SET_LOADING":
      draft.loading = action.payload;
      break;
    case "SET_UPDATING":
      draft.updating = action.payload;
      break;
  }
}

export default function ProfileSettings() {
  const [state, dispatch] = useImmerReducer<State, Action>(reducer, {
    activeTab: "Profile",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
    loading: true,
    updating: false,
  });

  // Form state for profile data
  const [profileData, setProfileData] = useState<{
    fullName: string;
    address: string;
    phone: string;
    location: string;
    company: string | null;
    website: string;
    bio: string;
    email: string;
    name: string;
    role: string;
    image: string;
  }>({
    fullName: "",
    address: "",
    phone: "",
    location: "",
    company: null,
    website: "",
    bio: "",
    email: "",
    name: "",
    role: "",
    image: "",
  });

  // Password change form state
  const [passwordData, setPasswordData] = useState<PasswordChangePayload>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle input change for profile form
  const handleProfileInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle phone input change
  const handlePhoneChange = (value: string) => {
    setProfileData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  // Handle password input change
  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const userData = await AuthService.getCurrentUser();

        if (userData) {
          const userInfo = { ...userData };
          setProfileData({
            fullName: userInfo.fullName ?? "",
            address: userInfo.address ?? "",
            phone: userInfo.phone ?? "",
            location: userInfo.location ?? "",
            company: userInfo.company ?? null,
            website: userInfo.website ?? "",
            bio: userInfo.bio ?? "",
            email: userInfo.email ?? "",
            role: userInfo.role ?? "",
            image: userInfo.image ?? "",
            name: userInfo.fullName ?? "",
          });
        } else {
          toast.warning("Could not retrieve user profile");
        }
      } catch (error) {
        toast.error("Failed to load user profile");
        console.error("Error loading user profile:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchUserData();
  }, [dispatch]);

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch({ type: "SET_UPDATING", payload: true });

      const updateData: UserUpdatePayload & { name?: string } = {
        fullName: profileData.fullName,
        address: profileData.address,
        phone: profileData.phone,
        location: profileData.location,
        company: profileData.company ? profileData.company.trim() : undefined,
        website: profileData.website,
        bio: profileData.bio,
      };

      const updatedUser = await AuthService.updateProfile(updateData);

      // Update local state with the returned data
      setProfileData((prev) => ({
        ...prev,
        fullName: updatedUser.fullName ?? prev.fullName,
        address: updatedUser.address ?? prev.address,
        phone: updatedUser.phone ?? prev.phone,
        location: updatedUser.location ?? prev.location,
        company: updatedUser.company ?? prev.company,
        website: updatedUser.website ?? prev.website,
        bio: updatedUser.bio || prev.bio,
      }));

      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      dispatch({ type: "SET_UPDATING", payload: false });
    }
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch({ type: "SET_UPDATING", payload: true });

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      const result = await AuthService.changePassword(passwordData);
      toast.success(result.message || "Password changed successfully");

      // Reset password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      AuthService.logout();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to change password"
      );
    } finally {
      dispatch({ type: "SET_UPDATING", payload: false });
    }
  };

  if (state.loading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-5">
        <button
          onClick={() => dispatch({ type: "SET_TAB", payload: "Profile" })}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            state.activeTab === "Profile"
              ? "text-[#1E3C72] border-[#1E3C72]"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => dispatch({ type: "SET_TAB", payload: "Security" })}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            state.activeTab === "Security"
              ? "text-[#1E3C72] border-[#1E3C72]"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          Security
        </button>
      </div>

      {/* Profile Tab Content */}
      {state.activeTab === "Profile" && (
        <div className="p-6 border border-[#1E3C72] rounded-lg bg-white">
          {/* Profile Section */}
          <div className="flex items-center mb-8 rounded-lg">
            <div className="w-20 h-20 rounded-full overflow-hidden mr-4 flex-shrink-0">
              {/* user image not here then show default avatar */}
              {profileData.image ? (
                <Image
                  src={profileData.image || user}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="cursor-pointer border-[#1C6780] border-[1px] rounded-full size-20 flex items-center justify-center bg-gray-100">
                  <LuUserRound className="w-12 h-12 text-[#1C6780]" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1E3C72] mb-1">
                {profileData.fullName}
              </h2>
              <p className="text-sm text-[#1E3C72] mb-1">{profileData.role}</p>
              <p className="text-sm text-[#1E3C72]">{profileData.email}</p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleUpdateProfile}>
            {/* Full Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleProfileInputChange}
                  placeholder="Enter Full Name"
                  className="w-full px-3 py-2 border bg-[#F8FAFC] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3C72] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <PhoneInput
                  country="sg"
                  value={profileData.phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter Phone"
                  enableSearch={true}
                  disableDropdown={false}
                  containerStyle={{ width: "100%" }}
                  inputStyle={{
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                    paddingLeft: "58px",
                    height: "40px",
                  }}
                  buttonStyle={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    border: "1px solid #ccc",
                    borderRight: "none",
                    borderRadius: "4px 0 0 4px",
                    backgroundColor: "#F8FAFC",
                    padding: "8px",
                  }}
                  dropdownStyle={{
                    width: "300px",
                  }}
                  buttonClass="custom-phone-button"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileInputChange}
                  placeholder="Enter Address"
                  className="w-full px-3 py-2 border bg-[#F8FAFC] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3C72] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleProfileInputChange}
                  placeholder="Enter Location"
                  className="w-full px-3 py-2 border bg-[#F8FAFC] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3C72] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={profileData.company ?? ""}
                  onChange={handleProfileInputChange}
                  placeholder="Enter Company"
                  className="w-full px-3 py-2 border bg-[#F8FAFC] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3C72] focus:border-transparent"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={profileData.website}
                  onChange={handleProfileInputChange}
                  placeholder="Enter Website"
                  className="w-full px-3 py-2 border bg-[#F8FAFC] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3C72] focus:border-transparent"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                rows={4}
                name="bio"
                value={profileData.bio}
                onChange={handleProfileInputChange}
                placeholder="Enter Bio"
                className="w-full px-3 py-2 border bg-[#F8FAFC] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3C72] focus:border-transparent resize-vertical"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 ">
              <button
                type="submit"
                disabled={state.updating}
                className="px-6 py-2 bg-[#002C69] text-white text-sm font-medium rounded-md hover:bg-[#002C69]/80 focus:outline-none focus:ring-2 focus:ring-[#1E3C72] focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {state.updating ? "Updating..." : "Update Profile"}
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-white text-[#002C69] text-sm font-medium border border-[#002C69] rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1E3C72] focus:ring-offset-2 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Tab Content */}
      {state.activeTab === "Security" && (
        <div className="p-6 border border-[#1E3C72] rounded-lg bg-white w-full">
          {/* Change Password Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Change Password
            </h2>
            <p className="font-medium text-gray-600 mb-6">
              Update Your Password To Keep Your Account Secure.
            </p>

            <form className="space-y-4" onSubmit={handleChangePassword}>
              {/* Current Password */}
              <div className="relative max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type={state.showCurrent ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter Current Password"
                  className="w-full px-3 py-2 pr-10 border bg-[#F8FAFC] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3C72] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => dispatch({ type: "TOGGLE_SHOW_CURRENT" })}
                  className="absolute top-10 right-3 text-gray-400"
                >
                  {state.showCurrent ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type={state.showNew ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter New Password"
                  className="w-full px-3 py-2 pr-10 border bg-[#F8FAFC] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3C72] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => dispatch({ type: "TOGGLE_SHOW_NEW" })}
                  className="absolute top-10 right-3 text-gray-400"
                >
                  {state.showNew ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type={state.showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Confirm New Password"
                  className="w-full px-3 py-2 pr-10 border bg-[#F8FAFC] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3C72] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: "TOGGLE_SHOW_CONFIRM" });
                  }}
                  className="absolute top-10 right-3 text-gray-400"
                >
                  {state.showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Update Password Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={state.updating}
                  className="px-6 py-2 bg-[#002C69] text-white text-sm font-medium rounded-md hover:bg-[#002C69]/80 focus:outline-none focus:ring-2 focus:ring-[#1E3C72] focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {state.updating ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
