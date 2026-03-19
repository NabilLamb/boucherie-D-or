// components/seller/Navbar.jsx

"use client";
import React from "react";
import { assets } from "../../assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { UserButton } from "@clerk/clerk-react";

const Navbar = ({ onMobileMenuToggle }) => {
  const { router } = useAppContext();

  return (
    <div className="flex items-center px-4 md:px-6 py-3 justify-between border-b border-gray-200 bg-white h-[64px] shadow-sm">
      {/* Left: hamburger (mobile) + logo */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Image
          onClick={() => router.push("/")}
          className="w-24 lg:w-28 cursor-pointer"
          src={assets.logo}
          alt="Logo"
        />
      </div>

      {/* Right: user */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-gray-500 font-medium">Seller Dashboard</span>
        <div className="w-px h-5 bg-gray-200 hidden sm:block" />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;