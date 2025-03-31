"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { StarIcon, WeightIcon, AgeIcon, CutIcon, TypeIcon } from "@/components/Icons";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
const ProductPage = () => {
  const { id } = useParams();
  const { currency, addToCart, router } = useAppContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch main product
        const { data: productData } = await axios.get(`/api/products/${id}`);
        if (!productData.success) throw new Error(productData.message);
        console.log(productData);
        // Fetch related products
        const { data: relatedData } = await axios.get(
          `/api/products?category=${productData.product.category._id}&limit=4`
        );

        setProduct(productData.product);
        setRelatedProducts(relatedData.products);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <Navbar />
      {/* Product Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={product.image[mainImage]}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Fresh Cut Badge */}
              <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Fresh Cut
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {product.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(index)}
                  className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-all ${
                    index === mainImage
                      ? "border-red-600 scale-105"
                      : "border-gray-200 hover:border-red-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header */}
            <div className="border-b pb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-yellow-600">
                <StarIcon className="w-5 h-5" />
                <span className="font-medium">Premium Quality Cut</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-red-600">
                  {currency}
                  {(product.offerPrice || product.price).toFixed(2)}
                  <span className="text-lg text-gray-500 ml-2">
                    /{product.unit}
                  </span>
                </span>
                {product.offerPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {currency}
                    {product.price.toFixed(2)}
                  </span>
                )}
              </div>
              {product.offerPrice && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                  Save{" "}
                  {(
                    ((product.price - product.offerPrice) / product.price) *
                    100
                  ).toFixed(0)}
                  % -{currency}
                  {(product.price - product.offerPrice).toFixed(2)} per{" "}
                  {product.unit}
                </div>
              )}
            </div>

            {/* Butcher's Specifications */}
            <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <CutIcon className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Cut Type</p>
                  <p className="font-medium">
                    {product.category?.name} {/* Display category name */}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TypeIcon className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Category Type</p>
                  <p className="font-medium">
                    {product.category?.type} {/* Display category type */}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <WeightIcon className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Avg. Weight</p>
                  <p className="font-medium">1.2-1.5 kg</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AgeIcon className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Aging</p>
                  <p className="font-medium">28 Days Dry-Aged</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StarIcon className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Grade</p>
                  <p className="font-medium">USDA Prime</p>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Cut Details</h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => addToCart(product._id)}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold transition-colors"
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product._id);
                  router.push("/cart");
                }}
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-semibold transition-colors"
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Cuts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductPage;
