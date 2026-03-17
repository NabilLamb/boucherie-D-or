// components/HomeProducts.jsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "./ProductCard";
import CategorySidebar from "./CategorySidebar";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiFilter,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

const ITEMS_PER_PAGE = 12;

const HomeProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });
  const [categories, setCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories once
  useEffect(() => {
    axios
      .get("/api/categories")
      .then(({ data }) => setCategories(data || []))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // Fetch products on filter/page/search change
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
      });
      if (selectedCategory) params.set("category", selectedCategory);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const { data } = await axios.get(`/api/products?${params.toString()}`);
      setProducts(data.products || []);
      setPagination(data.pagination || { total: 0, totalPages: 1 });
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const section = document.getElementById("products");
    if (section) {
      const offset = section.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <div id="products" className="min-h-screen pt-12 pb-16" style={{ backgroundColor: "#FAFAF8" }}>
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Our Products
          </h2>
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mt-4 mb-3">
            <div className="h-px w-16 bg-gray-300" />
            <p className="text-gray-500 text-sm font-medium">
              Sourced from local ethical farms
            </p>
            <div className="h-px w-16 bg-gray-300" />
          </div>
          <div className="w-12 h-1 bg-amber-600 mx-auto rounded-full" />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile filter button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm transition-colors font-medium"
          >
            <FiFilter className="w-4 h-4" />
            Filter Products
          </button>

          {/* Sidebar */}
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            setCurrentPage={setCurrentPage}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="mb-6 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products (e.g. ribeye, merguez, tagine...)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-400 text-sm"
              />
              {/* Clear search button */}
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results info */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {loading ? (
                  <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {products.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">
                      {pagination.total}
                    </span>{" "}
                    products
                  </>
                )}
              </p>
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-800 font-medium"
                >
                  <FiX className="w-3.5 h-3.5" />
                  Clear filter
                </button>
              )}
            </div>

            {/* Product grid — 3 cols on desktop for breathing room */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse"
                  >
                    <div className="aspect-square bg-gray-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                      <div className="h-8 bg-gray-100 rounded mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Try a different search or clear your filters
                </p>
                <button
                  onClick={() => {
                    handleSearchChange("");
                    handleCategoryChange(null);
                  }}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      handlePageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PaginationControls = ({ currentPage, totalPages, handlePageChange }) => {
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      {/* Fixed bug: was `!currentPage > 1` which is always false */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl disabled:opacity-30 hover:bg-amber-100 transition-colors"
        aria-label="Previous page"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      {start > 1 && (
        <>
          <PageButton page={1} current={currentPage} onClick={handlePageChange} />
          {start > 2 && <span className="px-1 text-gray-400">...</span>}
        </>
      )}

      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
        <PageButton
          key={page}
          page={page}
          current={currentPage}
          onClick={handlePageChange}
        />
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-gray-400">...</span>}
          <PageButton
            page={totalPages}
            current={currentPage}
            onClick={handlePageChange}
          />
        </>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl disabled:opacity-30 hover:bg-amber-100 transition-colors"
        aria-label="Next page"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

const PageButton = ({ page, current, onClick }) => (
  <button
    onClick={() => onClick(page)}
    aria-current={page === current ? "page" : undefined}
    className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
      page === current
        ? "bg-amber-600 text-white"
        : "text-gray-600 hover:bg-amber-100"
    }`}
  >
    {page}
  </button>
);

export default HomeProducts;
