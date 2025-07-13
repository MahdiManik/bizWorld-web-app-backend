import React from "react";

const NotificationSkeleton = () => {
  // Create an array of 5 items for the skeleton
  const skeletonItems = Array.from({ length: 10 }, (_, index) => index);

  return (
    <div className="bg-white">
      {/* Fixed Tab Navigation Skeleton */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 rounded-t-lg">
        <div className="flex">
          <div className="px-4 py-3 relative">
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003366] animate-pulse"></div>
          </div>
          <div className="px-6 py-3 relative">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Scrollable Notifications List Skeleton */}
      <div className="max-h-screen overflow-y-auto">
        <div className="space-y-3 p-4">
          {skeletonItems.map((item) => (
            <div
              key={item}
              className="flex items-start p-4 border-2 border-gray-200 rounded-2xl bg-[#f8faff] transition-colors"
            >
              {/* Icon Skeleton */}
              <div className="flex-shrink-0 mr-4 mt-1">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Content Skeleton */}
              <div className="flex-grow min-w-0">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-64 bg-[#5b6b7b]/30 rounded animate-pulse"></div>
              </div>

              {/* Time and Actions Skeleton */}
              <div className="flex items-center ml-4 flex-shrink-0">
                <div className="flex items-center mr-3">
                  <div className="h-3 w-16 bg-[#5b6b7b]/30 rounded animate-pulse"></div>
                </div>
                <div className="w-5 h-5 bg-[#5b6b7b]/30 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSkeleton;
