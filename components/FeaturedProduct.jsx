import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Banner from "./Banner";
const FeaturedProduct = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Changed to fetch 'featured' category type
        const { data } = await axios.get("/api/products?categoryType=featured");
        setFeaturedProducts(data.products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Specialty Cuts
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Expertly prepared premium meats selected by our master butchers
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <div 
              key={product._id}
              className="flex flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white"
            >
              {/* Product Image with Meat Badge */}
              <div className="relative aspect-square">
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured Cut
                </span>
              </div>

              {/* Product Details */}
              <div className="flex-1 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>
                
                {/* Pricing Information */}
                <div className="mb-4">
                  {product.offerPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-red-600">
                        ${product.offerPrice}
                      </span>
                      <span className="text-gray-400 line-through">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        /{product.unit}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        /{product.unit}
                      </span>
                    </div>
                  )}
                </div>

                {/* Butcher's Notes */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-5 h-5 mr-2 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Dry-aged for 28 days</span> {/* Customize this based on your actual data */}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6">
                <Link
                  href={`/product/${product._id}`}
                  className="block w-full text-center bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Select Cut
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Banner />
    </div>
  );
};

export default FeaturedProduct;