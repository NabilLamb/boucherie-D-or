import React from "react";
import Link from "next/link";
import { assets } from "../../assets/assets";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

// Accept isCollapsed & setIsCollapsed from parent
const SideBar = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    {
      name: "Products",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
      activePaths: ["/seller/product-list", "/seller/edit-product"],
    },
    {
      name: "Categories",
      path: "/seller/categories",
      icon: assets.product_list_icon,
      activePaths: ["/seller/categories"],
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    { name: "Favorites", path: "/seller/liked-list", icon: assets.heart_icon },
  ];

  return (
    <div className="relative border-r min-h-screen text-base border-gray-300 py-2 flex flex-col">
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 bg-white rounded-full p-1.5 shadow-md border hover:bg-gray-50 z-10"
      >
        <svg
          className={`w-4 h-4 transform transition-transform ${
            isCollapsed ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {menuItems.map((item) => {
        const isActive = item.activePaths
          ? item.activePaths.some((p) => pathname.startsWith(p))
          : pathname === item.path;

        return (
          <Link href={item.path} key={item.name} passHref>
            <motion.div
              className={`flex items-center py-3 px-4 gap-3 ${
                isActive
                  ? "border-r-4 md:border-r-[6px] bg-orange-600/20 border-orange-500/90"
                  : "hover:bg-gray-100/90 border-white"
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={item.icon}
                alt={`${item.name.toLowerCase()}_icon`}
                className={`w-7 h-7 ${isActive ? "filter-orange" : ""}`}
              />
              {!isCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`${isActive ? "font-bold text-orange-800" : ""}`}
                >
                  {item.name}
                </motion.p>
              )}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
