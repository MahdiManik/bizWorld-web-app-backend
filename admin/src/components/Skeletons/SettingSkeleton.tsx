import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white">
      {/* Profile Section Skeleton */}
      <div className="flex items-center mb-8 rounded-lg">
        <div className="w-20 h-20 rounded-full bg-gray-200 mr-4 flex-shrink-0"></div>
        <div>
          <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="space-y-6">
        {/* First Name and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Email Address and Phone Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Location and Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-18 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Website */}
        <div>
          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Bio */}
        <div>
          <div className="h-4 w-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-24 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const SettingsSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Tab Navigation Skeleton */}
      <div className="flex border-b border-gray-200 mb-8">
        <div className="px-4 py-3 text-sm font-medium border-b-2 border-[#1E3C72] transition-colors">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="px-4 py-3 text-sm font-medium border-b-2 border-transparent transition-colors">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Default to showing Profile skeleton */}
      <ProfileSkeleton />
    </div>
  );
};

export default SettingsSkeleton;
