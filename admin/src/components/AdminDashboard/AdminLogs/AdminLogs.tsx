"use client";

import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { DataTable } from "@/components/Others/data-table";
import AdminLogsSkeleton from "@/components/Skeletons/AdminLogsSkeleton";

interface ActivityItem {
  id: number;
  timestamp: string;
  action: string;
  target: string;
}

// Define state interface
interface AdminLogsState {
  data: ActivityItem[];
  loading: boolean;
  error: string | null;
}

// Define action types
type AdminLogsAction =
  | { type: "SET_DATA"; payload: ActivityItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string };

// Define reducer function
const adminLogsReducer = (draft: AdminLogsState, action: AdminLogsAction) => {
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

export default function AdminLogs() {
  // Initialize state with useImmerReducer
  const [state, dispatch] = useImmerReducer(adminLogsReducer, {
    data: [],
    loading: true,
    error: null,
  });

  // Fetch activity logs data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the JSON file
        const response = await fetch("/data/admin-logs.json");
        if (!response.ok) {
          throw new Error("Failed to fetch activity logs");
        }
        const data = await response.json();
        dispatch({ type: "SET_DATA", payload: data });
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load activity logs",
        });
      } finally {
        // Add a small delay to show the skeleton for a moment
        setTimeout(() => {
          dispatch({ type: "SET_LOADING", payload: false });
        }, 500);
      }
    };

    fetchData();
  }, [dispatch]);

  // Define columns for the DataTable
  const columns = [
    {
      key: "timestamp" as keyof ActivityItem,
      title: "Timestamp",
      sortable: true,
      filterable: true,
    },
    {
      key: "action" as keyof ActivityItem,
      title: "Action",
      sortable: true,
      filterable: true,
    },
    {
      key: "target" as keyof ActivityItem,
      title: "Target",
      sortable: true,
      filterable: true,
    },
  ];

  // Define filter fields
  const filterFields = [
    {
      id: "timestamp",
      label: "Timestamp",
      type: "text" as const,
      placeholder: "Search by timestamp",
    },
    {
      id: "action",
      label: "Action",
      type: "text" as const,
      placeholder: "Search by action",
    },
    {
      id: "target",
      label: "Target",
      type: "text" as const,
      placeholder: "Search by target",
    },
  ];

  // Show loading skeleton while fetching data
  if (state.loading) {
    return <AdminLogsSkeleton />;
  }

  // Show error message if there's an error
  if (state.error) {
    return <div className="p-4 text-red-500">{state.error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <DataTable<ActivityItem>
        data={state.data}
        columns={columns}
        itemsPerPage={10}
        filterTitle="Filter Activity Logs"
        filterFields={filterFields}
      />
    </div>
  );
}
