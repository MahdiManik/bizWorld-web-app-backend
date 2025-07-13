import React from 'react';
import { VscThreeBars } from "react-icons/vsc";
import { FaTh } from "react-icons/fa";

interface BusinessListingSkeletonProps {
  viewMode?: "grid" | "table";
}

const BusinessListingSkeleton: React.FC<BusinessListingSkeletonProps> = ({ viewMode = "grid" }) => {
  return (
    <div className="mt-2">
      {/* Tabs */}
      <div className="border-b flex justify-between items-center mb-5">
        <div className="flex">
          <div className="px-6 py-2 cursor-pointer">
            <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse border-b-2 border-[#002C69]"></div>
          </div>
          <div className="px-6 py-2 cursor-pointer">
            <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="px-6 py-2 cursor-pointer">
            <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-xl ${viewMode === "table" ? "text-blue-700" : "text-gray-600"}`}>
            <VscThreeBars className="cursor-pointer" />
          </div>
          <div className={viewMode === "grid" ? "text-blue-700" : "text-gray-600"}>
            <FaTh className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="my-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 w-full">
          <div className="h-10 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-md w-24 animate-pulse"></div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden relative">
              <div className="absolute top-2 right-2 z-10">
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              
              <div className="h-80 bg-gray-200 flex items-center justify-center animate-pulse">
                <div className="text-gray-400">
                  <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full mb-4 animate-pulse"></div>
                
                <div className="space-y-2 mb-4">
                  <div className="h-4 flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded-md mr-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-2/3 animate-pulse"></div>
                  </div>
                  <div className="h-4 flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded-md mr-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
                  </div>
                  <div className="h-4 flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded-md mr-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                  </div>
                  <div className="h-4 flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded-md mr-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-2/3 animate-pulse"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center gap-5 w-full">
                  <div className="h-10 bg-gray-200 rounded-md w-full animate-pulse"></div>
                  <div className="h-10 bg-blue-100 rounded-md w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
              <div className="h-10 bg-blue-100 rounded-md w-32 animate-pulse"></div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    {[...Array(6)].map((_, i) => (
                      <th key={i} className="py-3 px-4">
                        <div className="h-5 bg-gray-200 rounded-md w-full animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b hover:bg-gray-50">
                      {[...Array(5)].map((_, colIndex) => (
                        <td key={colIndex} className="py-3 px-4">
                          <div className="h-5 bg-gray-200 rounded-md w-full animate-pulse"></div>
                        </td>
                      ))}
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <div className="h-8 w-8 bg-blue-100 rounded-md animate-pulse"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center">
              <div className="h-6 bg-gray-200 rounded-md w-24 animate-pulse"></div>
              <div className="ml-2 h-6 bg-gray-200 rounded-md w-12 animate-pulse"></div>
            </div>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-8 w-8 bg-gray-200 rounded-md animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessListingSkeleton;
