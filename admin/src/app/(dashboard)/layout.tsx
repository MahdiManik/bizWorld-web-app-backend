"use client";

import DashboardHeader from "@/common/Header";
import SideBar from "@/common/Sidebar";
import { useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1">
        <div
          className={`fixed top-0 right-0 z-10 bg-white transition-all duration-300 ${
            isExpanded ? "left-60" : "left-16"
          }`}
        >
          <DashboardHeader />
        </div>
        <main
          className={`flex-1 overflow-auto transition-all duration-300 bg-[#F8FAFC] ${
            isExpanded ? "ml-60" : "ml-16"
          } mt-[30px] p-5`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
