// components/seller/Sidebar.jsx

"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ProductsIcon,
  CategoriesIcon,
  HeartIcon,
  OrdersIcon,
  HeartSolidIcon,
  AddIcon,
} from "@/components/Icons";

const menuItems = [
  {
    name: "Add Product",
    path: "/seller/add-product",
    icon: AddIcon,
  },
  {
    name: "Products",
    path: "/seller/product-list",
    icon: ProductsIcon,
    activePaths: ["/seller/product-list", "/seller/edit-product"],
  },
  {
    name: "Categories",
    path: "/seller/categories",
    icon: CategoriesIcon,
  },
  {
    name: "Orders",
    path: "/seller/orders",
    icon: OrdersIcon,
  },
  {
    name: "Favorites",
    path: "/seller/liked-list",
    icon: HeartIcon,
    activeIcon: HeartSolidIcon,
  },
];

const SideBar = ({ isCollapsed, setIsCollapsed, onMobileClose }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header / Brand */}
      <div className={`flex items-center justify-between px-4 h-[64px] border-b border-gray-200 flex-shrink-0`}>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-gray-800 text-sm tracking-wide truncate"
          >
            🥩 Seller Panel
          </motion.span>
        )}

        <div className="flex items-center gap-1 ml-auto">
          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = item.activePaths
            ? item.activePaths.some((p) => pathname.startsWith(p))
            : pathname === item.path;

          const IconComponent =
            isActive && item.activeIcon ? item.activeIcon : item.icon;

          return (
            <Link href={item.path} key={item.name} passHref>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`
                  flex items-center gap-3 py-3 px-4 mx-2 mb-1 rounded-xl cursor-pointer
                  transition-colors duration-150
                  ${
                    isActive
                      ? "bg-orange-50 text-orange-700 border border-orange-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <IconComponent
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? "text-orange-600" : "text-gray-500"
                  }`}
                />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    className={`text-sm font-medium truncate ${
                      isActive ? "text-orange-700 font-semibold" : ""
                    }`}
                  >
                    {item.name}
                  </motion.span>
                )}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer hint */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 truncate">Boucherie D&apos;or © 2025</p>
        </div>
      )}
    </div>
  );
};

export default SideBar;