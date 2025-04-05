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

const SideBar = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();

  const menuItems = [
    { 
      name: "Add Product", 
      path: "/seller", 
      icon: AddIcon 
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
      activePaths: ["/seller/categories"],
    },
    { 
      name: "Orders", 
      path: "/seller/orders", 
      icon: OrdersIcon 
    },
    { 
      name: "Favorites", 
      path: "/seller/liked-list", 
      icon: HeartIcon,
      // Optional: Use HeartSolidIcon when active
      activeIcon: HeartSolidIcon 
    },
  ];

  return (
    <div className="relative border-r min-h-screen text-base border-gray-300 py-2 flex flex-col">
      {/* Collapse Toggle Button (unchanged) */}

      {menuItems.map((item) => {
        const isActive = item.activePaths
          ? item.activePaths.some((p) => pathname.startsWith(p))
          : pathname === item.path;

        const IconComponent = isActive && item.activeIcon 
          ? item.activeIcon 
          : item.icon;

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
              <IconComponent
                className={`w-7 h-7 ${
                  isActive ? "text-orange-800" : "text-gray-600"
                }`}
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