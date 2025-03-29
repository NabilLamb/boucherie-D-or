"use client";
import React, { useState } from "react";
import SideBar from "@/components/seller/Sidebar";
import Navbar from "@/components/seller/Navbar";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function Layout({ children, modal }) {
  const pathname = usePathname();

  // Centralize isCollapsed state here so the layout and sidebar widths stay in sync
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* LEFT SIDEBAR - Dynamic width */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } border-r border-gray-300`}
      >
        <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* RIGHT SIDE: NAV + CONTENT */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar */}
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-grow overflow-auto bg-gray-50"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}