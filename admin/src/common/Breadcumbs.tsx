"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdArrowBackIosNew } from "react-icons/md";

type BreadcrumbsProps = {
  title?: string;
  description?: string;
};

const descriptionMap: Record<string, string> = {
  dashboard:
    "Welcome to the admin Portal dashboard. Here's an overview of activity.",
  "user-management": "Manage and review all registered users on the platform.",
  "business-listings": "Review and approve pending business listings.",
  "consultant-posts": "Review and manage consultant expertise posts",
  subscriptions: "Manage user subscriptions and payment plans.",
  "admin-logs": "Monitor and audit all admin activities across the platform.",
  notifications: "Monitor and audit all admin activities across the platform.",
  settings: "Manage your account settings and preferences.",
};

const titleMap: Record<string, string> = {
  dashboard: "Admin Dashboard",
  "user-management": "User Management",
  "business-listings": "Business Listings",
  "consultant-posts": "Consultant Submission Management",
  subscriptions: "Subscriptions",
  "admin-logs": "Admin Logs",
  notifications: "Notifications Center",
  settings: "Settings",
};

const Breadcrumbs = ({ title, description }: BreadcrumbsProps) => {
  const url = usePathname();
  const pathArray = url
    .split("/")
    .filter((path) => path && isNaN(Number(path)));

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const currentPath = pathArray[pathArray.length - 1];
  const finalTitle = title || titleMap[currentPath] || toTitleCase(currentPath);
  const finalDescription = description || descriptionMap[currentPath] || "";

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex space-x-1 text-gray-500">
        {pathArray.map((path, index) => {
          const href = "/" + pathArray.slice(0, index + 1).join("/");
          const isLast = index === pathArray.length - 1;

          return (
            <li key={href} className="flex items-center text-xl">
              {index > 0 && (
                <span className="mx-2">
                  <MdArrowBackIosNew />
                </span>
              )}
              {isLast ? (
                <div>
                  <span className="text-[#1E293B] font-bold text-xl">
                    {finalTitle}
                  </span>
                  <p className="text-[#64748B] font-medium text-sm">
                    {finalDescription}
                  </p>
                </div>
              ) : (
                <Link
                  href={href}
                  className="text-[#789FAD] font-medium hover:underline"
                >
                  {toTitleCase(decodeURIComponent(path))}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
