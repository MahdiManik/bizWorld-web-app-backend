import React from "react";
import { DataTable } from "@/components/Others/data-table";
import { Listing, Action } from "./types";

interface TableViewProps {
  listings: Listing[];
  // These props are passed from parent but not used in this component
  selectedRows: string[];
  selectAll: boolean;
  currentPage: number;
  totalPages: number;
  handleViewDetails: (listing: Listing) => void;
  dispatch: React.Dispatch<Action>;
}

const TableView: React.FC<TableViewProps> = ({
  listings,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedRows,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectAll,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentPage,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  totalPages,
  handleViewDetails,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatch,
}) => {
  return (
    <div className="overflow-x-auto">
      <DataTable
        data={listings}
        columns={[
          {
            key: "id",
            title: "ID",
            sortable: true,
            filterable: true,
          },
          {
            key: "title",
            title: "Name",
            sortable: true,
            filterable: true,
          },
          {
            key: "submitter",
            title: "Business Owner",
            sortable: true,
            filterable: true,
          },
          {
            key: "category",
            title: "Category",
            sortable: true,
            filterable: true,
          },
          {
            key: "country",
            title: "Location",
            sortable: true,
            filterable: true,
          },
          {
            key: "listingStatus",
            title: "Status",
            sortable: true,
            filterable: true,
            render: (value, item: Listing) => {
              const statusConfig = {
                pending: {
                  bgColor: "bg-yellow-50",
                  textColor: "text-yellow-500",
                  iconColor: "bg-yellow-500",
                  label: "Pending",
                },
                approved: {
                  bgColor: "bg-green-50",
                  textColor: "text-green-500",
                  iconColor: "bg-green-500",
                  label: "Approved",
                },
                rejected: {
                  bgColor: "bg-red-50",
                  textColor: "text-red-500",
                  iconColor: "bg-red-500",
                  label: "Rejected",
                },
              };

              const status = item.listingStatus?.toLowerCase() || "pending";
              const config =
                statusConfig[status as keyof typeof statusConfig] ||
                statusConfig.pending;

              return (
                <div
                  className={`inline-flex items-center px-4 py-1.5 rounded-md ${config.bgColor}`}
                >
                  <div className={`w-4 h-4 ${config.iconColor} mr-2`}></div>
                  <span className={`text-sm font-medium ${config.textColor}`}>
                    {config.label}
                  </span>
                </div>
              );
            },
          },
        ]}
        itemsPerPage={14}
        onView={handleViewDetails}
      />
    </div>
  );
};

export default TableView;
