"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { FiShoppingCart, FiInfo, FiStar } from "react-icons/fi";
import Banner from "./Banner";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";

const FeaturedProduct = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useAppContext();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const handleAddToCart = (product) => {
    addToCart(product._id);
    toast.success(`${product.name} added to cart`);
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/products/featured?categoryType=featured&limit=4");
        
        const filteredProducts = data.products.filter(product => 
          product.category?.type === 'featured'
        );
        
        setFeaturedProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section id="featuredProducts" className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Butcher's Selection
          </h2>
          <div className="w-28 h-1.5 bg-amber-600 mx-auto rounded-full mt-4 mb-6" />
          <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            Our master butcher's premium products, hand-selected for exceptional quality and flavor
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg overflow-hidden h-[320px] sm:h-[380px] animate-pulse"
              />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xl text-gray-500 mb-4">
              Currently no featured products available
            </div>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="group flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-gray-200 hover:border-amber-200 h-full"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={product.image[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    priority={true}
                  />
                  {/* Badges Container - Adjusted for mobile */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between">
                    {/* Featured Badge - Smaller on mobile */}
                    <div className="bg-amber-600 text-white px-2 py-1 rounded-md text-[7px] sm:text-xs font-bold flex items-center shadow-sm">
                      <FiStar className="mr-1" size={10} />
                      <span>FEATURED</span>
                    </div>
                    
                    {/* Discount Badge - Smaller on mobile */}
                    {product.offerPrice && (
                      <div className="bg-red-600 text-white px-2 py-1 rounded-md text-[7px] sm:text-xs font-bold shadow-sm">
                        SAVE{" "}
                        {Math.round(
                          ((product.price - product.offerPrice) / product.price) *
                            100
                        )}
                        %
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 p-4 flex flex-col">
                  <div className="mb-2">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-amber-600 capitalize mt-1">
                      {product.category?.name}
                    </p>
                  </div>

                  <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Pricing */}
                  <div className="mt-auto mb-3">
                    {product.offerPrice ? (
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-amber-700">
                          {currency}
                          {product.offerPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {currency}
                          {product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {currency}
                        {product.price.toFixed(2)}
                      </span>
                    )}
                    <span className="block text-xs text-gray-500 mt-1">
                      {product.unit}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/product/${product._id}`}
                      className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-2 px-2 rounded-md font-medium transition-colors text-xs sm:text-sm"
                    >
                      <FiInfo className="mr-1.5" size={14} />
                      Details
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white py-2 px-2 rounded-md font-medium transition-colors text-xs sm:text-sm"
                    >
                      <FiShoppingCart className="mr-0.5" size={14} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Banner />
    </section>
  );
};

export default FeaturedProduct;