"use client";
import React from "react";

const CategorySidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const handleSelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // Sort categories by type with priority: regular -> banner -> offer -> others
  const sortedCategories = categories.slice().sort((a, b) => {
    const typeOrder = { regular: 0, banner: 1, offer: 2 };
    const aOrder = typeOrder[a.type] ?? 3;
    const bOrder = typeOrder[b.type] ?? 3;
    return aOrder - bOrder;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed md:sticky md:top-24 left-0 h-screen md:h-auto z-50 w-72 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="h-full md:h-auto bg-white p-6 rounded-r-xl md:rounded-xl shadow-xl border-r md:border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Filter Products</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => handleSelect(null)}
              className={`w-full px-4 py-2.5 text-left rounded-lg transition-colors ${
                !selectedCategory 
                  ? "bg-amber-100 text-amber-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Products
            </button>
            {sortedCategories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleSelect(cat._id)}
                className={`w-full px-4 py-2.5 text-left rounded-lg transition-colors flex items-center gap-3 ${
                  selectedCategory === cat._id
                    ? "bg-amber-100 text-amber-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex-1">{cat.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default CategorySidebar;