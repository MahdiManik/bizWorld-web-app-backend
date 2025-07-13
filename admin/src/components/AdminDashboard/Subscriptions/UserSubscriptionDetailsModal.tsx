import React from "react";
import { FaTimes } from "react-icons/fa";
import { SubscriptionItem } from "./subscription";

interface UserSubscriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionItem | null;
}

const UserSubscriptionDetailsModal = ({
  isOpen,
  onClose,
  subscription,
}: UserSubscriptionDetailsModalProps) => {
  if (!isOpen || !subscription) return null;

  const statusConfig = {
    Active: {
      bgColor: "bg-green-50",
      textColor: "text-green-500",
      iconColor: "bg-green-500",
    },
    Expired: {
      bgColor: "bg-red-50",
      textColor: "text-red-500",
      iconColor: "bg-red-500",
    },
  };

  const config = statusConfig[subscription.status as keyof typeof statusConfig] || statusConfig.Active;

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white border-l border-gray-200 shadow-lg z-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              User Subscriptions Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 p-0 bg-transparent hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Name
            </label>
            <p className="text-gray-900">{subscription.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <p className="text-gray-900">{subscription.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Plan Name
            </label>
            <p className="text-gray-900">{subscription.planName}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Amount
            </label>
            <p className="text-gray-900">{subscription.amount}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Start Date
            </label>
            <p className="text-gray-900">{subscription.startDate}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              End Date
            </label>
            <p className="text-gray-900">{subscription.endDate}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Status
            </label>
            <div className={`inline-flex items-center px-4 py-1.5 rounded-md ${config.bgColor}`}>
              <div className={`w-4 h-4 ${config.iconColor} mr-2`}></div>
              <span className={`text-sm font-medium ${config.textColor}`}>
                {subscription.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSubscriptionDetailsModal;
