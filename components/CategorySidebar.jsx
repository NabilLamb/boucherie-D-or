"use client";
import React from "react";

const CategorySidebar = ({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
  setSidebarOpen, // Pass down so we can close sidebar on mobile after a click
}) => {
  const handleSelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);

    // Close sidebar if we're on mobile
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div
      className="
        w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border border-gray-100
        md:sticky top-4 h-fit
      "
    >
      <h3 className="text-lg md:text-xl font-semibold mb-3">Cut Types</h3>
      <nav className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-1 gap-2">
        <button
          onClick={() => handleSelect(null)}
          className={`
            p-2 text-sm md:text-base rounded-md transition-colors
            ${
              !selectedCategory
                ? "bg-red-100 text-red-600 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }
          `}
        >
          All Cuts
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleSelect(cat._id)}
            className={`
              p-2 text-sm md:text-base rounded-md transition-colors
              ${
                selectedCategory === cat._id
                  ? "bg-red-100 text-red-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            {cat.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default CategorySidebar;
