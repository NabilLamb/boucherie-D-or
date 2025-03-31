// ProductCard.jsx
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
    addToCart,
    user,
    wishlist,
    updateWishlist,
    fetchWishlist,
    getToken,
  } = useAppContext();
  const [isLiked, setIsLiked] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  useEffect(() => {
    setIsLiked(wishlist.some((item) => item.product._id === product._id));
  }, [wishlist, product._id]);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error("Please login to save favorites");
    if (isProcessing) return;

    setIsProcessing(true);
    const originalWishlist = [...wishlist];
    const newState = !isLiked;

    try {
      const tempWishlist = newState
        ? [
            ...wishlist.filter((item) => item.product._id !== product._id),
            { product },
          ]
        : wishlist.filter((item) => item.product._id !== product._id);
      updateWishlist(tempWishlist);

      await axios.post(
        newState ? "/api/my-liked/create" : "/api/my-liked/delete",
        { userId: user.id, productId: product._id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      await fetchWishlist();
      toast.success(newState ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      updateWishlist(originalWishlist);
      toast.error(
        error.response?.data?.message || "Failed to update favorites"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full">
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-100">
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
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm bg-white/80 hover:bg-white transition-colors shadow-sm"
          disabled={isProcessing}
        >
          <HeartIcon
            filled={isLiked}
            className={`w-6 h-6 transition-colors ${
              isLiked ? "text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* Discount Badge */}
        {product.offerPrice && (
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-amber-600 text-white text-sm font-medium rounded-full shadow-sm">
            Save{" "}
            {Math.round(
              ((product.price - product.offerPrice) / product.price) * 100
            )}
            %
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">{product.category?.name}</span>
          <span className="text-gray-500">{product.unit}</span>
        </div>

        <h3 className="font-semibold text-gray-900 break-words line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-amber-700">
              {currency}
              {(product.offerPrice || product.price).toFixed(2)}
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
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
