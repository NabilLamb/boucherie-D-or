// HomeProducts.jsx
"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import CategorySidebar from "./CategorySidebar";
import axios from "axios";
import toast from "react-hot-toast";
import { FiFilter, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ITEMS_PER_PAGE = 12;

const HomeProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [regularProducts, setRegularProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("/api/products?limit=1000"),
          axios.get("/api/categories"),
        ]);
        

        setRegularProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = regularProducts.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = [
      product.name,
      product.description,
      product.category?.name,
    ].some((field) => field?.toLowerCase().includes(searchLower));
    const matchesCategory =
      !selectedCategory || product.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="products" className="min-h-screen bg-gray-50 pt-12 pb-16">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Premium Meat Selection
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Hand-cut, locally sourced meats from our family to yours
          </p>
          <div className="w-32 h-1.5 bg-amber-600 mx-auto rounded-full mt-6" />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-md transition-colors"
          >
            <FiFilter className="w-5 h-5" />
            <span>Filter Products</span>
          </button>

          {/* Category Sidebar */}
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setCurrentPage={setCurrentPage}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                  <FiSearch className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search our Products (e.g., ribeye, tenderloin, sausage)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {paginatedProducts.length} of {filteredProducts.length} Products
              </p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Content */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm h-[360px] animate-pulse"
                  />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-2xl border border-gray-200">
                <div className="text-2xl text-gray-500 mb-4">
                  🍖 No Products Found
                </div>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? "Try different search terms"
                    : "Please check back later"}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
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
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  return (
    <nav className="flex items-center gap-1">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
        aria-label="Previous page"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              1 === currentPage
                ? "bg-amber-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            1
          </button>
          {startPage > 2 && <span className="px-1">...</span>}
        </>
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
        <button
          key={startPage + i}
          onClick={() => handlePageChange(startPage + i)}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            startPage + i === currentPage
              ? "bg-amber-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {startPage + i}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-1">...</span>}
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              totalPages === currentPage
                ? "bg-amber-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {totalPages}
          </button>
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

export default HomeProducts;