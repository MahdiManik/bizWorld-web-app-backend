import { RiCloseFill } from "react-icons/ri";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  userName: string;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  onDelete,
  userName,
}: DeleteUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-[450px] p-6 relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-lg cursor-pointer"
        >
          <RiCloseFill className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
          Delete User
        </h2>

        {/* Confirmation Message */}
        <p className="text-center text-sm text-gray-700">
          Are you sure you want to delete this{" "}
          <span className="text-blue-600 font-medium">{userName}</span>?
          <br />
          <span className="text-xs text-gray-500">
            This action is permanent and cannot be undone.
          </span>
        </p>

        {/* Buttons */}
        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
