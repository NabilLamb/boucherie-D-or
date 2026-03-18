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
  const [navigating, setNavigating] = useState(false);

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
      prefetch={true}
      onClick={() => setNavigating(true)}
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full ${
        navigating ? "opacity-70 scale-[0.98]" : ""
      }`}
    >
      {/* Image — square */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
        <Image
          src={getImageSource(product.image)}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {navigating && (
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-30">
            <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm z-10">
            -{discount}%
          </div>
        )}

        <button
          onClick={handleWishlist}
          disabled={isProcessing}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all hover:scale-110 z-20"
        >
          <FiHeart
            className={`w-3.5 h-3.5 transition-colors ${
              liked ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      {/* Info — flex-1 added to grow and push price row down */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[7px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-700 truncate">
            {product.category?.name || "Premium"}
          </span>
          <span className="text-[6px] sm:text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ml-1">
            {product.unit}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>

        {/* Description — line-clamp-3 for better desktop alignment */}
        <p className="hidden sm:block text-xs text-gray-500 leading-relaxed line-clamp-3">
          {product.description}
        </p>

        {/* Price + Add to Cart — mt-auto pins this to the bottom */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-black text-gray-900 leading-tight">
              {currency}{(product.offerPrice || product.price).toFixed(2)}
            </span>
            {product.offerPrice && (
              <span className="text-[10px] text-gray-400 line-through leading-tight">
                {currency}{product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-lg text-[11px] sm:text-xs font-semibold transition-all shadow-sm flex-shrink-0 z-20"
          >
            <FiShoppingCart className="w-3 h-3 flex-shrink-0" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;