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
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [categories, setCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Debounced search — wait 400ms after user stops typing before fetching
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories once on mount
  useEffect(() => {
    axios
      .get("/api/categories")
      .then(({ data }) => setCategories(data || []))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // Fetch products whenever page, category, or search changes
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
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when filters change
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
    <div id="products" className="min-h-screen bg-gray-50 pt-12 pb-16">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Products
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Discover our wide range of high-quality products, sourced from the
            finest suppliers.
          </p>
          <div className="w-32 h-1.5 bg-amber-600 mx-auto rounded-full mt-6" />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile filter button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-md transition-colors"
          >
            <FiFilter className="w-5 h-5" />
            <span>Filter Products</span>
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
          <div className="flex-1">
            {/* Search */}
            <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                  <FiSearch className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Results count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {loading
                  ? "Loading..."
                  : `Showing ${products.length} of ${pagination.total} products`}
              </p>
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Product grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm h-[360px] animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-2xl border border-gray-200">
                <div className="text-2xl text-gray-500 mb-4">
                  No products found
                </div>
                <button
                  onClick={() => {
                    handleSearchChange("");
                    handleCategoryChange(null);
                  }}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!currentPage > 1}
        className="p-2 rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
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

      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
        (page) => (
          <PageButton
            key={page}
            page={page}
            current={currentPage}
            onClick={handlePageChange}
          />
        )
      )}

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
        className="p-2 rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
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
    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${page === current
        ? "bg-amber-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
      }`}
  >
    {page}
  </button>
);

export default HomeProducts;