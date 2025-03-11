import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import CategorySidebar from "./CategorySidebar";
import { useAppContext } from "@/context/AppContext";

const ITEMS_PER_PAGE = 12;

const HomeProducts = () => {
  const { products } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (searchQuery && selectedCategory) {
      const hasOtherCategoryMatches = products.some(product => 
        product.category !== selectedCategory &&
        [product.name, product.description, product.category]
          .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      if (hasOtherCategoryMatches) {
        setSelectedCategory(null);
        setCurrentPage(1);
      }
    }
  }, [searchQuery, selectedCategory, products]);

  // Simplified filter function
  const filteredProducts = products.filter((product) => {
    const matchesSearch = [product.name, product.description, product.category]
      .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || 
      selectedCategory === 'All' || 
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
    
  

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <div id="products" className="min-h-screen bg-gray-50">
      {/* Title Section */}
      <div className="text-center py-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Our Products</h2>
        <div className="w-24 h-1.5 bg-orange-600 mx-auto rounded-full" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-4 md:px-8 max-w-7xl mx-auto">
        <CategorySidebar 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setCurrentPage={setCurrentPage}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-8 bg-white p-4 rounded-xl shadow-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Products Grid */}
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
              {searchQuery
                ? "No products found matching your search"
                : "No products available in this category"}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                  >
                    <svg
                      className="w-6 h-6"
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

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === i + 1
                          ? "bg-orange-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeProducts;