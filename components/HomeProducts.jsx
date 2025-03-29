"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import CategorySidebar from "./CategorySidebar";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";

const ITEMS_PER_PAGE = 12;

const HomeProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [regularProducts, setRegularProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // State for controlling the mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/categories"),
        ]);

        if (productsRes.data.products) {
          setRegularProducts(productsRes.data.products);
        }

        if (categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products by search + category
  const filteredProducts = regularProducts.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = [product.name, product.description, product.category?.name].some((field) =>
      field?.toLowerCase().includes(searchLower)
    );
    const matchesCategory = !selectedCategory || product.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <div id="products" className="min-h-screen bg-gray-50 pt-8 pb-12">
      {/* Section Title */}
      <div className="text-center px-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Our Premium Meats
        </h2>
        <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Toggle Button for Sidebar on Mobile */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            {sidebarOpen ? "Close" : "Filter By Category"}
          </button>
        </div>

        {/* Sidebar (Visible on desktop, toggle on mobile) */}
        <div
          className={`${
            sidebarOpen ? "block" : "hidden md:block"
          } md:w-64 flex-shrink-0`}
        >
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setCurrentPage={setCurrentPage}
            setSidebarOpen={setSidebarOpen} // Allows closing sidebar after selecting
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search cuts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Loading, No Results, or Products */}
          {loading ? (
            <div className="text-center p-8 text-gray-500 bg-white rounded-lg border border-gray-100">
              <Loading />
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center p-8 text-gray-500 bg-white rounded-lg border border-gray-100">
              {searchQuery
                ? "No cuts found matching your search"
                : "No products available in this category"}
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-1.5">
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
  );
};

const PaginationControls = ({ currentPage, totalPages, handlePageChange }) => (
  <>
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="p-2 rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => handlePageChange(i + 1)}
          className={`px-3 py-1.5 rounded-md text-sm ${
            currentPage === i + 1
              ? "bg-red-500 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>

    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="p-2 rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </>
);

export default HomeProducts;
