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

  const handleAddToCart = (product) => {
    addToCart(product._id);
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/products?categoryType=featured");
        setFeaturedProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div id="featuredProducts" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Butcher's Selection
          </h2>
          <div className="w-32 h-1.5 bg-amber-600 mx-auto rounded-full mt-4" />
          <p className="mt-6 max-w-2xl text-lg text-gray-600 mx-auto">
            Our master butcher's premium cuts, hand-selected for exceptional
            quality and flavor
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm h-[420px] animate-pulse"
              />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-xl text-gray-500 mb-4">
              Currently no featured cuts available
            </div>
            <Link
              href="/products"
              className="inline-block px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="flex flex-col overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-gray-100 hover:border-amber-100"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={product.image[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Featured Badge */}
                  <div className="absolute top-3 left-3 bg-amber-600 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center">
                    <FiStar className="mr-1" />
                    <span>FEATURED</span>
                  </div>
                  {/* Discount Badge */}
                  {product.offerPrice && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                      SAVE{" "}
                      {Math.round(
                        ((product.price - product.offerPrice) / product.price) *
                          100
                      )}
                      %
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {product.name}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.unit}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-4">
                    {product.offerPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-amber-700">
                          ${product.offerPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Butcher's Notes */}
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <FiInfo className="w-4 h-4 mr-2 text-amber-600" />
                      <span>Aged for 28 days</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-5 pb-5">
                  <div className="flex gap-2">
                    <Link
                      href={`/product/${product._id}`}
                      className="flex-1 text-center bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-2 px-4 rounded-lg font-medium transition-colors text-sm flex items-center justify-center"
                    >
                      <FiInfo className="mr-2" />
                      Details
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm flex items-center justify-center"
                    >
                      <FiShoppingCart className="mr-2" />
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
    </div>
  );
};

export default FeaturedProduct;
