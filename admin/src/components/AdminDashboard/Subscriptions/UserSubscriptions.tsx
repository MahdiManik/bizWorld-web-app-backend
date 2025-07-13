"use client";

import { useEffect, useState } from "react";
import { useImmerReducer } from "use-immer";
import { DataTable } from "@/components/Others/data-table";
import SubscriptionSkeleton from "@/components/Skeletons/SubscriptionSkeleton";
import { SubscriptionItem } from "@/components/AdminDashboard/Subscriptions/subscription";
import UserSubscriptionDetailsModal from "./UserSubscriptionDetailsModal";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

// Define action types for the UserSubscriptions component
type UserSubscriptionsAction =
  | { type: "SET_DATA"; payload: SubscriptionItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Define state type for the UserSubscriptions component
interface UserSubscriptionsState {
  data: SubscriptionItem[];
  loading: boolean;
  error: string | null;
}

// Define reducer for the UserSubscriptions component
const userSubscriptionsReducer = (
  draft: UserSubscriptionsState,
  action: UserSubscriptionsAction
) => {
  switch (action.type) {
    case "SET_DATA":
      draft.data = action.payload;
      break;
    case "SET_LOADING":
      draft.loading = action.payload;
      break;
    case "SET_ERROR":
      draft.error = action.payload;
      break;
  }
};

export default function UserSubscriptions() {
  // Initialize state with useImmerReducer
  const [state, dispatch] = useImmerReducer(userSubscriptionsReducer, {
    data: [],
    loading: true,
    error: null,
  });

  // State for subscription details modal
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] =
    useState<SubscriptionItem | null>(null);
  const router = useRouter();

  // Fetch subscription data
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const response = await fetch("/data/subscriptionData.json");
        if (!response.ok) {
          throw new Error("Failed to fetch subscription data");
        }
        const data = await response.json();
        dispatch({ type: "SET_DATA", payload: data });
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load subscription data",
        });
      } finally {
        // Add a small delay to show the skeleton for a moment
        setTimeout(() => {
          dispatch({ type: "SET_LOADING", payload: false });
        });
      }
    };

    fetchData();
  }, [dispatch]);

  // Define columns for the DataTable
  const columns = [
    {
      key: "name" as keyof SubscriptionItem,
      title: "Name",
      sortable: true,
      filterable: true,
    },
    {
      key: "email" as keyof SubscriptionItem,
      title: "Email",
      sortable: true,
      filterable: true,
    },
    {
      key: "planName" as keyof SubscriptionItem,
      title: "Plan Name",
      sortable: true,
      filterable: true,
    },
    {
      key: "status" as keyof SubscriptionItem,
      title: "Status",
      sortable: true,
      filterable: true,
      render: (value: unknown, item: SubscriptionItem) => {
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

        const config =
          statusConfig[item.status as keyof typeof statusConfig] ||
          statusConfig.Active;

        return (
          <div
            className={`inline-flex items-center px-4 py-1.5 rounded-md ${config.bgColor}`}
          >
            <div className={`w-4 h-4 ${config.iconColor} mr-2`}></div>
            <span className={`text-sm font-medium ${config.textColor}`}>
              {item.status}
            </span>
          </div>
        );
      },
    },
    {
      key: "startDate" as keyof SubscriptionItem,
      title: "Start Date",
      sortable: true,
      filterable: true,
    },
    {
      key: "endDate" as keyof SubscriptionItem,
      title: "End Date",
      sortable: true,
      filterable: true,
    },
    {
      key: "amount" as keyof SubscriptionItem,
      title: "Amount",
      sortable: true,
      filterable: true,
    },
  ];

  // Define filter fields
  const filterFields = [
    {
      id: "name",
      label: "Search By Name",
      type: "text" as const,
      placeholder: "Search by name",
    },
    {
      id: "planName",
      label: "Search By Plan Name",
      type: "text" as const,
      placeholder: "Search by plan name",
    },
    {
      id: "status",
      label: "Status",
      type: "select" as const,
      placeholder: "Select status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Expired", value: "Expired" },
      ],
    },
    {
      id: "amount",
      label: "Amount Range",
      type: "amount_range" as const,
      placeholder: "Enter amount range",
    },
  ];

  // Handle actions
  const handleEdit = (item: SubscriptionItem) => {
    router.push(`/subscriptions/edit-user-subscription?id=${item.id}`);
  };

  const handleDelete = (item: SubscriptionItem) => {
    setSubscriptionToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (subscriptionToDelete) {
      console.log("Deleting subscription:", subscriptionToDelete);
      // Here you would make an API call to delete the subscription
      // For now, we'll just close the modal
      setIsDeleteModalOpen(false);
      setSubscriptionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSubscriptionToDelete(null);
  };

  const handleView = (item: SubscriptionItem) => {
    setSelectedSubscription(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
  };

  // Show loading skeleton while fetching data
  if (state.loading) {
    return <SubscriptionSkeleton activeTab="user-subscriptions" />;
  }

  // Show error message if there's an error
  if (state.error) {
    return <div className="p-4 text-red-500">{state.error}</div>;
  }

  return (
    <div className="py-4">
      <DataTable<SubscriptionItem>
        data={state.data}
        columns={columns}
        itemsPerPage={10}
        filterTitle="Filter Subscriptions"
        filterFields={filterFields}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* User Subscription Details Modal */}
      <UserSubscriptionDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        subscription={selectedSubscription}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full text-center">
            <div className="flex justify-end">
              <button
                onClick={cancelDelete}
                className="text-gray-500 hover:text-gray-700 cursor-pointer right-0"
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-[#002C69] text-center">
              Delete Subscription
            </h2>
            <div className="mb-8">
              <p className="text-gray-700 text-lg mb-1">
                Are you sure you want to delete this{" "}
                <span className="font-semibold">Subscription</span>?
              </p>
              <p className="text-gray-700">
                This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={cancelDelete}
                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
