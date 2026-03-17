// components/ProductCard.jsx

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { assets } from "@/assets/assets";
import { getImageSource } from "@/utils/images";
import toast from "react-hot-toast";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const { currency, user } = useAppContext();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const liked = isInWishlist(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      if (liked) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCart = (e) => {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      toast.error("Please login to add to cart");
      return;
    }
    addToCart(product._id);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="group flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full border border-gray-100 hover:border-amber-100">
      <Link
        href={`/product/${product._id}`}
        className="flex flex-col flex-grow"
        onClick={(e) => {
          if (!user) e.preventDefault();
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <Image
            src={getImageSource(product.image)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onLoadingComplete={() => setImageLoaded(true)}
            onError={(e) => (e.target.src = assets.default_img)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
          />

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            disabled={isProcessing}
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
            className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm bg-white/80 hover:bg-white transition-colors shadow-sm z-10"
          >
            <FiHeart
              className={`w-5 h-5 transition-colors ${
                liked ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>

          {/* Discount badge */}
          {product.offerPrice && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-md text-[10px] font-bold">
              SAVE{" "}
              {Math.round(
                ((product.price - product.offerPrice) / product.price) * 100
              )}
              %
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
            <span className="truncate capitalize">{product.category?.name}</span>
            <span className="font-medium">{product.unit}</span>
          </div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
            {product.description}
          </p>
        </div>
      </Link>

      {/* Price + Add to cart */}
      <div className="p-4 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-bold text-amber-700 whitespace-nowrap">
            {currency}
            {(product.offerPrice || product.price).toFixed(2)}
          </span>
          {product.offerPrice && (
            <span className="text-xs text-gray-400 line-through">
              {currency}
              {product.price.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          className="flex items-center gap-1 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          <FiShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
