"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import { getImageSource } from "@/utils/images";
import axios from "axios";
import toast from "react-hot-toast";
import { HeartIcon } from "@/assets/assets";

const ProductCard = ({ product }) => {
  const {
    currency,
    router,
    addToCart,
    user,
    wishlist,
    isWishlistLoading,
    updateWishlist,
    fetchWishlist,
    getToken,
  } = useAppContext();

  const [isLiked, setIsLiked] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    setIsLiked(wishlist.some((item) => item.product._id === product._id));
  }, [wishlist, product._id]);

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isWishlistLoading && isMounted.current) {
      const liked = wishlist.some((item) => item.product._id === product._id);
      setIsLiked(liked);
    }
  }, [wishlist, product._id, isWishlistLoading]);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error("Please login to save favorites");
    if (isProcessing) return;

    setIsProcessing(true);
    const originalWishlist = [...wishlist];
    const newState = !isLiked;

    try {
      // Optimistic update
      const tempWishlist = newState
        ? [
            ...wishlist.filter((item) => item.product._id !== product._id),
            { product },
          ]
        : wishlist.filter((item) => item.product._id !== product._id);

      updateWishlist(tempWishlist);

      const response = await axios.post(
        newState ? "/api/my-liked/create" : "/api/my-liked/delete",
        {
          userId: user.id,
          productId: product._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "API request failed");
      }

      // Refresh from server
      await fetchWishlist();
      toast.success(newState ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      console.error("Wishlist error:", {
        error: error.response?.data || error.message,
        user: user?.id,
        product: product._id,
      });

      // Revert changes if request fails
      updateWishlist(originalWishlist);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update favorites"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const imageSrc = getImageSource(product.image);

  return (
    <div
      onClick={() => router.push(`/product/${product._id}`)}
      className="
        w-72 h-96 group flex flex-col gap-3
        cursor-pointer bg-white p-4 rounded-xl shadow-sm
        hover:shadow-lg transition-all duration-300 ease-out
      "
    >
      {/* Image Section */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-50">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => (e.target.src = assets.default_img)}
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={isProcessing}
          className="
            absolute top-3 right-3 p-2 rounded-full bg-white/90 
            backdrop-blur-sm shadow-md hover:shadow-lg 
            transition-all duration-200
          "
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <HeartIcon
            filled={isLiked}
            className={`w-6 h-6 transition-colors duration-200 ${
              isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
          />
        </button>

        {/* Discount Badge */}
        {product.offerPrice && (
          <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
            {Math.round(
              ((product.price - product.offerPrice) / product.price) * 100
            )}
            % OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow gap-2">
        {/* Category & Unit */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="text-xs text-gray-500 truncate">
            {product.category?.name}
          </div>
          <span className="shrink-0">{product.unit}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 truncate">
          {product.name}
        </h3>

        {/* Description (line clamp to 3 lines) */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {product.description}
        </p>

        {/* Pricing & Add to Cart */}
        <div className="flex flex-col gap-2 pt-2 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-green-700">
              {currency}
              {(product.offerPrice || product.price).toFixed(2)}
              <span className="text-sm font-medium text-gray-500 ml-1">
                /{product.unit}
              </span>
            </span>
            {product.offerPrice && (
              <span className="text-sm text-gray-400 line-through">
                {currency}
                {product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product._id);
            }}
            className="
              w-full py-2.5 bg-green-600 hover:bg-green-700
              text-white text-sm font-medium rounded-lg
              transition-colors duration-200 flex items-center 
              justify-center gap-2
            "
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293
                  c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0
                  000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
