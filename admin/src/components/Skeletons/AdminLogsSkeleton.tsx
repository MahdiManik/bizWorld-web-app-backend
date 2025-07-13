import React from "react";

const AdminLogsSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 animate-pulse">
      {/* DataTable Header Skeleton - Filter and Search */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-10 w-96 bg-gray-200 rounded-md"></div>
      </div>

      {/* Table Container */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-100 p-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, colIndex) => (
                <div key={colIndex} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}

        {/* Table Footer with Pagination */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-5 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogsSkeleton;
