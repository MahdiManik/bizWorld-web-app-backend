import React from "react";
import { FiFileText, FiTag } from "react-icons/fi";
import { HiDownload } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

interface Attachment {
  name: string;
  size: string;
}

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    fullName?: string;
    author: string;
    submissionFor?: string;
    date: string;
    postTitle?: string;
    title: string;
    email?: string;
    phone?: string;
    areaOfExpertise?: string[];
    tags: string[];
    yearsOfExperience?: string;
    attachments?: Attachment[];
    portfolioLink?: string;
    additionalInfo?: string;
    description: string;
  } | null;
}

export default function DetailsModal({
  isOpen,
  onClose,
  data,
}: DetailsModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
        <div className="relative px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 text-center mx-auto">
            Review Consultant Submission
          </h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <IoMdClose className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-900 mb-6">
              Professional Information
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <p className="text-sm font-medium text-gray-500 w-36 flex-shrink-0">
                  Name:
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {data.fullName || data.author}
                </p>
              </div>
              <div className="flex">
                <p className="text-sm font-medium text-gray-500 w-36 flex-shrink-0">
                  Submission For:
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {data.submissionFor || "Business Consultant"}
                </p>
              </div>
              <div className="flex">
                <p className="text-sm font-medium text-gray-500 w-36 flex-shrink-0">
                  Submitted:
                </p>
                <p className="text-sm text-gray-900 font-medium">{data.date}</p>
              </div>
              <div className="flex items-start">
                <p className="text-sm font-medium text-gray-500 w-36 flex-shrink-0">
                  Area of Expertise:
                </p>
                <div className="flex flex-wrap gap-2">
                  {(data.areaOfExpertise || data.tags).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
                    >
                      <FiTag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex">
                <p className="text-sm font-medium text-gray-500 w-36 flex-shrink-0">
                  Years of Experience:
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {data.yearsOfExperience || "3 years"}
                </p>
              </div>
              {data.email && (
                <div className="flex">
                  <p className="text-sm font-medium text-gray-500 w-36 flex-shrink-0">
                    Email:
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data.email}
                  </p>
                </div>
              )}
              {data.phone && (
                <div className="flex">
                  <p className="text-sm font-medium text-gray-500 w-36 flex-shrink-0">
                    Phone Number:
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data.phone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {data.attachments && data.attachments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Attachments (CV)
              </h3>
              <div className="max-w-[350px]">
                <div className="bg-white rounded-lg border border-[#002C69] overflow-hidden">
                  <div className="flex items-center">
                    {/* Blue icon section */}
                    <div className="bg-[#002C69] p-4 flex items-center justify-center">
                      <FiFileText className="w-6 h-6 text-white" />
                    </div>

                    {/* File info section */}
                    <div className="flex-1 px-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {data.attachments[0].name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {data.attachments[0].size}
                      </p>
                    </div>

                    {/* Download button section */}
                    <div className="px-4">
                      <button
                        className="p-2 text-[#002C69] hover:bg-blue-50 rounded-md transition-colors duration-200"
                        aria-label="Download file"
                      >
                        <HiDownload className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {data.portfolioLink && (
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Attachments (Portfolio link)
              </h3>
              <a
                href={data.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                {data.portfolioLink}
              </a>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Additional Information
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {data.additionalInfo || data.description}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-900 text-white text-sm font-medium rounded-md cursor-pointer"
            >
              Approve
            </button>
            <button
              onClick={onClose}
              className="px-8  py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 cursor-pointer"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
