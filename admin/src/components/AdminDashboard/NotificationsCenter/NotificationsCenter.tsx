"use client";

import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { FiUser, FiSettings, FiClock, FiCheck } from "react-icons/fi";
import NotificationSkeleton from "../../../components/Skeletons/NotificationSkeleton";

type Notification = {
  id: number;
  type: "consultant" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
};

type State = {
  notifications: Notification[];
  activeTab: "all" | "unread";
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: "FETCH_NOTIFICATIONS_START" }
  | { type: "FETCH_NOTIFICATIONS_SUCCESS"; payload: Notification[] }
  | { type: "FETCH_NOTIFICATIONS_ERROR"; payload: string }
  | { type: "SET_ACTIVE_TAB"; payload: "all" | "unread" }
  | { type: "MARK_AS_READ"; payload: number };

const initialState: State = {
  notifications: [],
  activeTab: "all",
  loading: true, // Start with loading true
  error: null,
};

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case "FETCH_NOTIFICATIONS_START":
      draft.loading = true;
      draft.error = null;
      return;
    case "FETCH_NOTIFICATIONS_SUCCESS":
      draft.notifications = action.payload;
      draft.loading = false;
      return;
    case "FETCH_NOTIFICATIONS_ERROR":
      draft.error = action.payload;
      draft.loading = false;
      return;
    case "SET_ACTIVE_TAB":
      draft.activeTab = action.payload;
      return;
    case "MARK_AS_READ":
      const notification = draft.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
      return;
    default:
      return;
  }
}

export default function NotificationPage() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const { notifications, activeTab, loading, error } = state;

  useEffect(() => {
    // Component is already in loading state from initialState
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/data/notifications.json");
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        // Short timeout to ensure the skeleton is visible
        setTimeout(() => {
          dispatch({ type: "FETCH_NOTIFICATIONS_SUCCESS", payload: data });
        }, 300);
      } catch (error) {
        dispatch({
          type: "FETCH_NOTIFICATIONS_ERROR",
          payload: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    fetchNotifications();
  }, [dispatch]);

  const handleTabChange = (tab: "all" | "unread") => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: tab });
  };

  const handleMarkAsRead = (id: number) => {
    dispatch({ type: "MARK_AS_READ", payload: id });
  };

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((notification) => !notification.read);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;
  const totalCount = notifications.length;

  if (loading) {
    return <NotificationSkeleton />;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white mt-6">
      {/* Fixed Tab Navigation */}
      <div className="sticky top-2 z-50 bg-white border-b border-gray-200 rounded-t-lg">
        <div className="flex">
          <button
            className={`px-4 py-3 text-sm font-medium relative cursor-pointer ${
              activeTab === "all"
                ? "text-[#003366]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("all")}
          >
            All ({totalCount})
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003366]"></div>
            )}
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium relative cursor-pointer ${
              activeTab === "unread"
                ? "text-[#003366]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("unread")}
          >
            Unread ({unreadCount})
            {activeTab === "unread" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003366]"></div>
            )}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="h-auto overflow-visible">
        <div className="space-y-3 p-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start p-4 border-2 border-[#003366] rounded-2xl bg-[#f8faff] hover:bg-[#f0f7ff] transition-colors cursor-pointer  border-l-[#003366] border-l-6"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mr-4 mt-1">
                {notification.type === "consultant" ? (
                  <FiUser className="w-5 h-5 text-[#003366]" />
                ) : (
                  <FiSettings className="w-5 h-5 text-[#003366]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-semibold text-[#003366] mb-0.5">
                  {notification.title}
                </h3>
                <p className="text-sm text-[#5b6b7b]">
                  {notification.description}
                </p>
              </div>

              {/* Time and Actions */}
              <div className="flex items-center ml-4 flex-shrink-0">
                <div className="flex items-center text-[#5b6b7b] text-xs mr-3">
                  <FiClock className="w-4 h-4 mr-1" />
                  <span className="whitespace-nowrap">{notification.time}</span>
                </div>
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-[#5b6b7b] hover:text-[#003366] transition-colors"
                >
                  <FiCheck className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {!loading && filteredNotifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {activeTab === "unread"
                ? "No unread notifications"
                : "No notifications"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
