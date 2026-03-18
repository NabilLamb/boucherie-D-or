// components/FeaturedProduct.jsx

"use client";

import React, { useEffect, useState, memo } from "react";
import Link from "next/link";
import axios from "axios";
import { FiArrowRight } from "react-icons/fi";
import ProductCard from "./ProductCard";
import Banner from "./Banner";
import toast from "react-hot-toast";

const FeaturedProduct = memo(() => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        // API already filters by categoryType=featured — no need to filter again client-side
        const { data } = await axios.get(
          "/api/products/featured?categoryType=featured&limit=4"
        );
        setFeaturedProducts(data.products || []);
      } catch (err) {
        console.error("[FEATURED_FETCH_ERROR]", err.message);
        setError("Failed to load featured products.");
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section id="featuredProducts" className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: "#FAFAF8" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header — centered, matches HomeProducts style */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Featured Products
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4 mb-3">
            <div className="h-px w-12 bg-gray-300" />
            <p className="text-gray-500 text-sm font-medium">
              Hand-selected by our master butcher
            </p>
            <div className="h-px w-12 bg-gray-300" />
          </div>
          <div className="w-12 h-1 bg-amber-600 rounded-full mx-auto" />
          
          {/* View all link below the divider */}
          <div className="mt-4">
            <Link
              href="/#products"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-amber-700 transition-colors"
            >
              View All Products
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Loading skeletons — match ProductCard proportions exactly */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
                    <div className="h-2.5 w-10 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-4 w-3/4 bg-gray-100 rounded" />
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded" />
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <div className="h-5 w-16 bg-gray-100 rounded" />
                    <div className="h-8 w-14 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && featuredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 mb-4">
              No featured products available at the moment.
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Browse All Products
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Product grid — reuses ProductCard for full consistency */}
        {!loading && !error && featuredProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Banner />
    </section>
  );
});

FeaturedProduct.displayName = "FeaturedProduct";

export default FeaturedProduct;