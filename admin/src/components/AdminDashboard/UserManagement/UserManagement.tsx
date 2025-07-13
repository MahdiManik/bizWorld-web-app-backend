/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { DataTable } from "@/components/Others/data-table";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DeleteUserModal from "@/components/Others/useDeleted-modal";
import { useImmerReducer } from "use-immer";
import UserManagementSkeleton from "@/components/Skeletons/UserManagementSkeleton";
import UserDetailsModal from "@/components/Others/UserDetailsModal";
import {
  UserManagementService,
  User as UserType,
} from "@/services/usermanagement.services";

// Using the User type from our service

// Define a compatible User type that ensures required fields
type CompatibleUser = {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  joinDate: string;
  userStatus: string;
};

type State = {
  users: CompatibleUser[];
  isLoading: boolean;
  isDeleteModalOpen: boolean;
  isViewModalOpen: boolean;
  selectedUser: CompatibleUser | null;
};

type Action =
  | { type: "SET_USERS"; payload: CompatibleUser[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "OPEN_DELETE_MODAL"; payload: CompatibleUser }
  | { type: "CLOSE_DELETE_MODAL" }
  | { type: "OPEN_VIEW_MODAL"; payload: CompatibleUser }
  | { type: "CLOSE_VIEW_MODAL" };

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case "SET_USERS":
      draft.users = action.payload;
      return;
    case "SET_LOADING":
      draft.isLoading = action.payload;
      return;
    case "OPEN_DELETE_MODAL":
      draft.selectedUser = action.payload;
      draft.isDeleteModalOpen = true;
      return;
    case "CLOSE_DELETE_MODAL":
      draft.selectedUser = null;
      draft.isDeleteModalOpen = false;
      return;
    case "OPEN_VIEW_MODAL":
      draft.selectedUser = action.payload;
      draft.isViewModalOpen = true;
      return;
    case "CLOSE_VIEW_MODAL":
      draft.isViewModalOpen = false;
      return;
  }
}

export default function UserManagement() {
  const [state, dispatch] = useImmerReducer<State, Action>(reducer, {
    users: [],
    isLoading: true,
    isDeleteModalOpen: false,
    isViewModalOpen: false,
    selectedUser: null,
  });

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const users = await UserManagementService.getUsers();

      // Ensure all required fields are present
      const compatibleData = users.map((user: any) => ({
        ...user,
        id: user.id || user._id || "", // Handle both id formats
        phone: user.phone || user.phoneNumber || "", // Handle both phone field names
        joinDate: user.createdAt
          ? new Date(user.createdAt).toISOString().split("T")[0]
          : "",
        status: user.userStatus || "Active",
      }));

      dispatch({ type: "SET_USERS", payload: compatibleData });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      key: "fullName" as keyof CompatibleUser,
      title: "Name",
      sortable: true,
      filterable: true,
    },
    {
      key: "email" as keyof CompatibleUser,
      title: "Email",
      sortable: true,
      filterable: true,
    },
    {
      key: "phone" as keyof CompatibleUser,
      title: "Phone",
      sortable: true,
    },
    {
      key: "joinDate" as keyof CompatibleUser,
      title: "Created Date",
      sortable: true,
      filterable: true,
    },
    {
      key: "userStatus" as keyof CompatibleUser,
      title: "Status",
      sortable: true,
      filterable: true,
      render: (value: unknown) => (
        <span
          className={`px-2 py-2 rounded-md text-xs font-medium flex items-center gap-2 ${
            value === "ACTIVE"
              ? "bg-green-100 text-green-600"
              : value === "PENDING"
              ? "bg-yellow-100 text-yellow-600"
              : value === "INACTIVE"
              ? "bg-gray-100 text-gray-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          <div
            className={`w-4 h-4 rounded ${
              value === "ACTIVE"
                ? "bg-green-500"
                : value === "PENDING"
                ? "bg-yellow-500"
                : value === "INACTIVE"
                ? "bg-gray-500"
                : "bg-red-500"
            }`}
          ></div>
          {value as string}
        </span>
      ),
    },
  ];

  const handleView = (user: CompatibleUser): void => {
    dispatch({ type: "OPEN_VIEW_MODAL", payload: user });
  };

  const closeViewModal = () => {
    dispatch({ type: "CLOSE_VIEW_MODAL" });
  };

  const handleEdit = (user: CompatibleUser) => {
    router.push(
      `/user-management/edit-user?id=${encodeURIComponent(
        user.id || user.email
      )}`
    );
  };

  const handleDelete = (user: CompatibleUser) => {
    dispatch({ type: "OPEN_DELETE_MODAL", payload: user });
  };

  const confirmDelete = async () => {
    if (!state.selectedUser?.id && !state.selectedUser?.email) {
      return;
    }

    const userId = state.selectedUser?.id || state.selectedUser?.email;

    try {
      // Use the UserManagementService to delete the user
      await UserManagementService.deleteUser(userId);

      dispatch({ type: "CLOSE_DELETE_MODAL" });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddNew = () => {
    router.push("/user-management/create-user");
  };

  // Helper function to get unique countries for the filter dropdown
  const getUniqueCountries = (users: CompatibleUser[]) => {
    // Get all unique countries
    const countries = users.map((user) => user.country).filter(Boolean);
    const uniqueCountries = [...new Set(countries)];

    // Sort countries alphabetically for better usability
    const sortedCountries = uniqueCountries.sort((a, b) => a.localeCompare(b));

    // Create simple options for the dropdown
    return sortedCountries.map((country) => ({
      label: country,
      value: country,
    }));
  };

  return (
    <div className="mt-4">
      {state.isLoading ? (
        <UserManagementSkeleton />
      ) : (
        <DataTable
          data={state.users}
          columns={columns}
          onAddNew={handleAddNew}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          filterTitle="Filter User"
          filterModalType="user"
          filterFields={[
            {
              id: "name",
              label: "Name",
              type: "text",
              placeholder: "Search By Name",
            },
            {
              id: "userStatus",
              label: "Status",
              type: "select",
              placeholder: "Select Status",
              options: [
                { label: "Pending", value: "Pending" },
                { label: "Active", value: "Active" },
                { label: "Rejected", value: "Rejected" },
              ],
            },
            {
              id: "joinDate",
              label: "Created Date",
              type: "date",
              placeholder: "Select Date",
            },
          ]}
        />
      )}
      {state.selectedUser && (
        <DeleteUserModal
          isOpen={state.isDeleteModalOpen}
          onClose={() => dispatch({ type: "CLOSE_DELETE_MODAL" })}
          onDelete={confirmDelete}
          userName={state.selectedUser.fullName}
        />
      )}

      {state.selectedUser && (
        <UserDetailsModal
          isOpen={state.isViewModalOpen}
          onClose={closeViewModal}
          user={state.selectedUser}
        />
      )}
    </div>
  );
}
