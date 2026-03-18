// components/ProductCard.jsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getImageSource } from "@/utils/images";
import toast from "react-hot-toast";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

const ProductCard = React.memo(({ product }) => {
  const { currency, user } = useAppContext();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Loading state for navigation feedback
  const [navigating, setNavigating] = useState(false);

  // Reset navigating state if user returns to this page (via back button)
  useEffect(() => {
    setNavigating(false);
  }, []);

  const liked = isInWishlist(product._id);
  const discount = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Please login to save favorites"); return; }
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      liked ? await removeFromWishlist(product._id) : await addToWishlist(product);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Please login to add to cart"); return; }
    addToCart(product._id);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      href={`/product/${product._id}`}
      prefetch={true} // Force prefetching for faster page loads
      onClick={() => setNavigating(true)} //  1: Trigger loading state
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer 
        ${navigating ? "opacity-70 scale-[0.98] grayscale-[0.2]" : ""}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={getImageSource(product.image)}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-10">
            -{discount}%
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          disabled={isProcessing}
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all hover:scale-110 z-20"
        >
          <FiHeart
            className={`w-4 h-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
        </button>

        {/* Optional: Loading Spinner Overlay */}
        {navigating && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center z-30">
            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            {product.category?.name || "Premium Cut"}
          </span>
          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
            {product.unit}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-grow mb-4">
          {product.description}
        </p>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black text-gray-900">
              {currency}{(product.offerPrice || product.price).toFixed(2)}
            </span>
            {product.offerPrice && (
              <span className="text-xs text-gray-400 line-through leading-tight">
                {currency}{product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-amber-200 hover:shadow-md z-20"
          >
            <FiShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;