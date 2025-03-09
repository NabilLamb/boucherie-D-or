"use client";
import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";

export default function SuggestedProductsSection({
  products,
  currentProductId,
  category,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const PRODUCTS_PER_PAGE = 5;

  // Filter out the current product, then sort by category match
  const suggestedProducts = useMemo(() => {
    if (!products?.length) return [];
    return products
      .filter((p) => p._id !== currentProductId)
      .sort((a, b) => {
        const aMatch = a.category === category ? 1 : 0;
        const bMatch = b.category === category ? 1 : 0;
        return bMatch - aMatch;
      });
  }, [products, currentProductId, category]);

  const totalPages = Math.ceil(suggestedProducts.length / PRODUCTS_PER_PAGE);

  // Slice the array for the current page
  const paginatedProducts = suggestedProducts.slice(
    currentPage * PRODUCTS_PER_PAGE,
    (currentPage + 1) * PRODUCTS_PER_PAGE
  );

  // Pagination handlers
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-gray-900">
          Related Products
        </h2>
        <p className="text-gray-600 mt-2">
          You might also like these products
        </p>
      </div>

      {/* Centered Product Grid */}
      <div className="mx-auto w-fit max-w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
          {paginatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Show pagination controls only if multiple pages */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          {/* Text-based arrows & page numbers in a single row */}
          <div className="flex items-center gap-2">
            {/* Previous arrow */}
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className={`px-2 py-1 rounded font-bold ${
                currentPage === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {"<"}
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`px-3 py-1 rounded transition-colors ${
                  index === currentPage
                    ? "bg-gray-900 text-white"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                {index + 1}
              </button>
            ))}

            {/* Next arrow */}
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1}
              className={`px-2 py-1 rounded font-bold ${
                currentPage >= totalPages - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {">"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
