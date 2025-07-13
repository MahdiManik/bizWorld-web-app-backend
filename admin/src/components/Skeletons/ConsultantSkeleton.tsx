import React from 'react';

interface ConsultantSkeletonProps {
  viewMode: 'grid' | 'list';
}

export default function ConsultantSkeleton({ viewMode }: ConsultantSkeletonProps) {
  return (
    <div className="animate-pulse">
      {/* Tabs Skeleton */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {['Pending', 'Approved', 'Rejected'].map((tab, index) => (
            <div key={index} className="px-4 py-2">
              <div className={`h-6 w-24 rounded ${index === 0 ? 'bg-blue-100' : 'bg-gray-100'}`}></div>
              {index === 0 && <div className="h-0.5 w-full bg-blue-600 mt-2"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* View Toggle and Search Skeleton */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        {viewMode === 'grid' ? (
          <div className="flex items-center">
            <div className="relative w-full sm:max-w-md">
              <div className="h-10 w-64 bg-gray-200 rounded-md"></div>
            </div>
            <div className="ml-4 h-10 w-20 bg-gray-200 rounded-md"></div>
          </div>
        ) : (
          <div></div>
        )}
        
        <div className="flex items-center space-x-2 border border-gray-200 rounded-md p-1">
          <div className={`h-8 w-8 rounded ${viewMode === 'grid' ? 'bg-blue-100' : 'bg-gray-100'}`}></div>
          <div className={`h-8 w-8 rounded ${viewMode === 'list' ? 'bg-blue-100' : 'bg-gray-100'}`}></div>
        </div>
      </div>

      {/* Content Skeleton */}
      {viewMode === 'grid' ? (
        // Grid View Skeleton
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="w-3/4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
                <div className="h-5 w-16 bg-yellow-100 rounded"></div>
              </div>
              
              <div className="h-4 bg-gray-100 rounded w-full mt-4"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6 mt-2"></div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {Array.from({ length: 3 }).map((_, tagIndex) => (
                  <div key={tagIndex} className="h-5 w-16 bg-gray-100 rounded-full"></div>
                ))}
              </div>
              
              <div className="flex mt-4 justify-between">
                <div className="h-8 w-20 bg-gray-100 rounded"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-gray-100 rounded"></div>
                  <div className="h-8 w-16 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View Skeleton
        <div className="-mt-7">
          <div className="w-full rounded-md border border-gray-200">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-5 items-center">
                  <div className="h-9 w-80 bg-gray-200 rounded-md"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
                    <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-4 py-3.5">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    </th>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <th key={index} className="px-4 py-3.5 text-left">
                        <div className="h-5 w-24 bg-gray-200 rounded"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-4">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-5 w-24 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1">
                          {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="h-5 w-16 bg-gray-200 rounded-full"></div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-5 w-24 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-5 w-16 bg-gray-200 rounded"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="h-5 w-48 bg-gray-200 rounded"></div>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-8 w-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
