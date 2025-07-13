import React from 'react';

const UserManagementSkeleton = () => {
  return (
    <div className="mt-4">
      {/* Table Header with Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-9 bg-gray-200 rounded-md w-40 animate-pulse"></div>
          <div className="h-9 bg-gray-200 rounded-md w-32 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
      
      {/* Main Table Container */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 bg-gray-50">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center">
              <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
              {index < 5 && (
                <div className="ml-2 h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Table Rows */}
        {[...Array(10)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50">
            {/* First column with checkbox */}
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-28 animate-pulse"></div>
            </div>
            
            {/* Other columns */}
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            
            {/* Status column */}
            <div className="flex justify-between items-center">
              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex space-x-1">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Table Footer with Pagination */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementSkeleton;
