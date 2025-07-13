import React from 'react';

interface SubscriptionSkeletonProps {
  activeTab: string;
}

const SubscriptionSkeleton: React.FC<SubscriptionSkeletonProps> = ({ activeTab }) => {
  return (
    <div className="animate-pulse">
      {/* Tabs Skeleton */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <div 
            className={`py-4 px-6 ${
              activeTab === "subscription-plan" 
                ? "border-b-2 border-gray-300" 
                : ""
            }`}
          >
            <div className="h-7 bg-gray-200 rounded w-40"></div>
          </div>
          <div 
            className={`py-4 px-6 ${
              activeTab === "user-subscriptions" 
                ? "border-b-2 border-gray-300" 
                : ""
            }`}
          >
            <div className="h-7 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton based on active tab */}
      {activeTab === "subscription-plan" ? (
        <SubscriptionPlanContent />
      ) : (
        <UserSubscriptionsContent />
      )}
    </div>
  );
};

// Subscription Plan Skeleton Content
const SubscriptionPlanContent = () => {
  return (
    <div className="py-4 animate-pulse">
      {/* Search and Add Plan Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-96">
            <div className="h-10 bg-gray-200 rounded-md w-full"></div>
          </div>
          <div className="">
            <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Subscription Plan Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 h-[500px] flex flex-col">
            <div className="flex justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-gray-200 p-4 rounded-md">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                </div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-7 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="flex gap-1 mb-6">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-5 bg-gray-200 rounded w-12 mt-3"></div>
            </div>

            <div className="h-6 bg-gray-200 rounded w-full mb-6"></div>

            <div className="space-y-6 flex-grow flex flex-col justify-between">
              {Array.from({ length: 6 }).map((_, featureIndex) => (
                <div key={featureIndex} className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// User Subscriptions Skeleton Content
const UserSubscriptionsContent = () => {
  return (
    <div className="py-4 animate-pulse">
      {/* DataTable Header Skeleton */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-48 bg-gray-200 rounded-md"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* DataTable Skeleton */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-100 p-4">
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, colIndex) => (
                <div key={colIndex} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-4">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-8 w-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSkeleton;
