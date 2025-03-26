"use client";
import React from "react";
import SideBar from "@/components/seller/Sidebar";
import Navbar from "@/components/seller/Navbar";
import Footer from "@/components/seller/Footer";


export default function Layout({ children }) {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div className="md:w-64 w-16 shrink-0 border-r border-gray-300">
        <SideBar />
      </div>

      {/* RIGHT SIDE: NAV + CONTENT + FOOTER */}
      <div className="flex flex-col w-full">
        {/* NAVBAR (sticky at top) */}
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>

        {/* MAIN SCROLLABLE CONTENT */}
        <div className="flex-grow overflow-auto bg-gray-50">
          {children}
        </div>

        {/* FOOTER (sticky at bottom) */}
        
      </div>
    </div>
  );
}
