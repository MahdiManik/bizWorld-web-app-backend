/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { IoNotificationsOutline } from "react-icons/io5";
import { useImmerReducer } from "use-immer";
import Breadcrumbs from "./Breadcumbs";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import TimePeriodDropdown from "./time-period-dropdown";
import { useEffect, useState } from "react";
import { AuthService, User } from "@/services/authService";
import { LuUserRound } from "react-icons/lu";

type State = {
  openProfileModal: boolean;
  openNotificationModal: boolean;
};

type Action =
  | { type: "TOGGLE_PROFILE" }
  | { type: "TOGGLE_NOTIFICATION" }
  | { type: "CLOSE_ALL" };

const initialState: State = {
  openProfileModal: false,
  openNotificationModal: false,
};

const reducer = (draft: State, action: Action) => {
  switch (action.type) {
    case "TOGGLE_PROFILE":
      draft.openProfileModal = !draft.openProfileModal;
      draft.openNotificationModal = false;
      break;
    case "TOGGLE_NOTIFICATION":
      draft.openNotificationModal = !draft.openNotificationModal;
      draft.openProfileModal = false;
      break;
    case "CLOSE_ALL":
      draft.openProfileModal = false;
      draft.openNotificationModal = false;
      break;
  }
};

const DashboardHeader = () => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleWrapperClick = () => {
    dispatch({ type: "CLOSE_ALL" });
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const userData = await AuthService.getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div
      onClick={handleWrapperClick}
      className="px-5 py-2 flex justify-between items-center w-full relative bg-[#F8FAFC]"
    >
      <div>
        <Breadcrumbs />
      </div>

      <div
        className="flex items-center gap-4 text-[#1C6780] pr-5"
        onClick={(e) => e.stopPropagation()}
      >
        {pathname === "/dashboard" && <TimePeriodDropdown />}
        {/* Notification Icon */}
        <div className="relative">
          <IoNotificationsOutline
            onClick={() => dispatch({ type: "TOGGLE_NOTIFICATION" })}
            className="w-8 h-8 cursor-pointer border-[#1C6780]"
          />

          {state.openNotificationModal && (
            <div
              onClick={handleDropdownClick}
              className="absolute z-40 flex flex-col w-64 py-2 bg-white rounded-lg shadow-xl right-0 top-8 shadow-gray-400"
            >
              <div className="px-4 py-2 text-sm text-gray-700">
                🔔 No new notifications
              </div>
              {/* Add more notification items here */}
            </div>
          )}
        </div>

        {/* Profile Icon */}
        <div className="relative">
          {currentUser?.image ? (
            <Image
              src={currentUser.image}
              alt="Profile picture"
              width={40}
              height={40}
              onClick={() => dispatch({ type: "TOGGLE_PROFILE" })}
              className="cursor-pointer border-[#1C6780] border-[1px] rounded-full size-10"
            />
          ) : (
            <div 
              onClick={() => dispatch({ type: "TOGGLE_PROFILE" })}
              className="cursor-pointer border-[#1C6780] border-[1px] rounded-full size-10 flex items-center justify-center bg-gray-100"
            >
              <LuUserRound className="w-6 h-6 text-[#1C6780]" />
            </div>
          )}

          {state.openProfileModal && (
            <div className="absolute z-[9999] flex flex-col w-72 py-2 bg-white rounded-lg shadow-xl right-0 top-12 shadow-gray-400">
              {/* User Profile Section */}
              <div className="flex items-center gap-3 p-2 pb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  {currentUser?.image ? (
                    <Image
                      src={currentUser.image}
                      alt="Profile picture"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <LuUserRound className="w-8 h-8 text-[#1C6780]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {currentUser?.fullName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {currentUser?.email}
                  </p>
                </div>
              </div>
              <hr className="border-gray-200" />
              <div className="p-2">
                {/* Log Out Option */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
