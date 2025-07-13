import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="mt-4">
      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 p-2 px-4 bg-white shadow-sm animate-pulse"
          >
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="bg-[#F3F4F6] p-2 rounded-md">
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="mt-2 h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="my-1 h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>

      {/* Dashboard Content Skeleton */}
      <div className="mt-3">
        <div className="flex items-stretch gap-5 mb-3 flex-col lg:flex-row">
          {/* New Users Chart Skeleton */}
          <div className="rounded-lg border border-gray-200 bg-white py-2 px-4 shadow-sm lg:w-4/6 md:h-[270px] lg:h-[380px] animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="mt-2 md:h-[200px] lg:h-[300px] bg-gray-200 rounded"></div>
          </div>

          {/* User Approval Status Skeleton */}
          <div className="rounded-lg border border-gray-200 bg-white py-2 px-4 shadow-sm lg:w-2/6 md:h-[270px] lg:h-[380px] animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="flex md:h-[190px] lg:h-[270px] items-center justify-center">
              <div className="h-32 w-32 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex space-x-8">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="ml-1 h-3 bg-gray-200 rounded w-6"></div>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="ml-1 h-3 bg-gray-200 rounded w-6"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-stretch gap-5 flex-col lg:flex-row">
          {/* Business Listings Skeleton */}
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm lg:w-7/12 md:h-[270px] lg:h-[380px] animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 md:h-[200px] lg:h-[300px] bg-gray-200 rounded"></div>
            <div className="flex justify-start space-x-8 -mt-4">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>

          {/* Recent Activity Skeleton */}
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm lg:w-5/12 md:h-[270px] lg:h-[380px] animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="mt-2 md:h-[200px] lg:h-[300px]">
              <div className="mb-4 h-4 bg-gray-200 rounded w-16"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                      <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
