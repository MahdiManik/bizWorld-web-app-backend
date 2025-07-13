"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdSupportAgent,
} from "react-icons/md";
import { PiClockCounterClockwiseFill } from "react-icons/pi";
import { RiDashboardLine } from "react-icons/ri";
import { TbCurrencyDollar } from "react-icons/tb";

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: RiDashboardLine },
  {
    name: "User Management",
    href: "/user-management",
    icon: FiUser,
  },
  {
    name: "Business Listing",
    href: "/business-listings",
    icon: HiOutlineDocumentReport,
  },
  {
    name: "Submission Management",
    href: "/consultant-posts",
    icon: MdSupportAgent,
  },

  {
    name: "Subscriptions",
    href: "/subscriptions",
    icon: TbCurrencyDollar,
  },
  {
    name: "Admin Log",
    href: "/admin-logs",
    icon: PiClockCounterClockwiseFill,
  },
  {
    name: "Notification",
    href: "/notifications",
    icon: IoNotificationsOutline,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: IoSettingsOutline,
  },
];

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const SideBar = ({ isExpanded, toggleSidebar }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 bg-white shadow-md transition-all duration-300 ease-in-out h-screen
      ${isExpanded ? "w-60" : "w-16"}`}
    >
      <div className="flex flex-col h-full relative overflow-hidden">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center justify-center ps-1 gap-2 py-2">
            <h1 className="bg-[#E6F0F8] text-[#002C69] px-4 py-2 font-bold rounded-md text-2xl">
              B
            </h1>
            <h1 className="text-2xl font-bold text-center">
              <span className="text-[#002C69]">Biz</span>
              <span className="text-[#2563EB]">World</span>
            </h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-[#185B75] cursor-pointer absolute -right-1 top-[54.5px] z-50"
          >
            {isExpanded ? (
              <MdKeyboardDoubleArrowLeft className="w-6 h-6" />
            ) : (
              <MdKeyboardDoubleArrowRight className="w-6 h-6" />
            )}
          </button>
        </div>
        <hr className="border-[#D7E8EE] mt-[2px]" />

        <nav className="flex flex-col py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-4 py-3 text-[#64748B]hover:bg-gray-100 font-medium text-lg ${
                isExpanded ? "justify-start" : "justify-center"
              } ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "bg-[#002C69] text-white font-semibold"
                  : ""
              }`}
            >
              <link.icon className={`w-6 h-6 ${isExpanded ? "mr-3" : ""}`} />
              {isExpanded && <span className="text-sm">{link.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
