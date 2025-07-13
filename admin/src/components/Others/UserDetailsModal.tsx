import React from "react";
import { FaTimes } from "react-icons/fa";

type User = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  joinDate: string;
  userStatus: string;
};

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const UserDetailsModal = ({ isOpen, onClose, user }: UserDetailsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white border-l border-gray-200 shadow-lg z-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
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
            <p className="text-gray-900">{user.fullName}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <p className="text-gray-900">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Phone
            </label>
            <p className="text-gray-900">{user.phone}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Join Date
            </label>
            <p className="text-gray-900">{user.joinDate}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Status
            </label>
            <span
              className={`px-2 py-2 rounded-md text-xs font-medium flex items-center gap-2 ${
                user.userStatus === "ACTIVE"
                  ? "bg-green-100 text-green-600"
                  : user.userStatus === "PENDING"
                  ? "bg-yellow-100 text-yellow-600"
                  : user.userStatus === "INACTIVE"
                  ? "bg-gray-100 text-gray-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              <div
                className={`w-4 h-4 rounded ${
                  user.userStatus === "ACTIVE"
                    ? "bg-green-500"
                    : user.userStatus === "PENDING"
                    ? "bg-yellow-500"
                    : user.userStatus === "INACTIVE"
                    ? "bg-gray-500"
                    : "bg-red-500"
                }`}
              ></div>
              {user.userStatus || "Unknown"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
