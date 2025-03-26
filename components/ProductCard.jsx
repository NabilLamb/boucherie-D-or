"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import { getImageSource } from "@/utils/images";
import axios from "axios";
import toast from "react-hot-toast";
import { HeartIcon } from "@/assets/assets";

const ProductCard = ({ product }) => {
  const { currency, router, addToCart, user, wishlist, updateWishlist } =
    useAppContext();
  const [isLiked, setIsLiked] = React.useState(false);

  useEffect(() => {
    const isProductLiked = wishlist.some(item => item.product._id === product._id);
    setIsLiked(isProductLiked);
  }, [wishlist, product._id]);


  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error("Please login");

    const originalWishlist = [...wishlist];
    const newState = !isLiked;
    
    // Optimistic update logic
    const tempWishlist = newState
      ? [...wishlist.filter(item => item.product._id !== product._id), { product }] // Ensure no duplicates
      : wishlist.filter(item => item.product._id !== product._id);

    updateWishlist(tempWishlist);

    try {
      await axios.post(
        newState ? "/api/my-liked/create" : "/api/my-liked/delete",
        { userId: user.id, productId: product._id }
      );
    } catch (error) {
      updateWishlist(originalWishlist);
      toast.error(error.response?.data?.message || "Failed to update favorites");
    }
  };

  const imageSrc = getImageSource(product.image);

  return (
    <div
      onClick={() => {
        router.push("/product/" + product._id);
        scrollTo(0, 0);
      }}
      className="flex flex-col items-start gap-2 w-full max-w-[240px] cursor-pointer group bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image Section */}
      <div className="relative w-full h-52 rounded-lg overflow-hidden bg-gray-50">
        <Image
          src={imageSrc}
          alt={product.name}
          width={400}
          height={400}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform"
          onError={(e) => {
            e.target.src = assets.default_img;
          }}
        />

        {/* Custom Heart Button */}

        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
        >
          <HeartIcon filled={isLiked} className="w-6 h-6" />
        </button>
      </div>

      {/* Product Info */}
      <div className="w-full space-y-1.5">
        {/* Category, SubCategory & Unit */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="truncate">{product.category}</span>
          <span>{product.unit}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold truncate">{product.name}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 h-12">
          {product.description}
        </p>

        {/* Price Section */}
        <div className="flex flex-col gap-1 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {currency}
              {(product.offerPrice || product.price).toFixed(2)}
              <span className="text-sm font-normal">/{product.unit}</span>
            </span>
            {product.offerPrice && (
              <span className="text-sm text-gray-400 line-through">
                {currency}
                {product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add To Cart Button */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product._id); // Add this line
              }}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-full transition-colors flex items-center gap-1 whitespace-nowrap w-auto"
            >
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 transition-colors fill-white stroke-black`}
              >
                <circle cx="16.5" cy="18.5" r="1.5" />
                <circle cx="9.5" cy="18.5" r="1.5" />
                <path d="M18 16H8a1 1 0 0 1-.958-.713L4.256 6H3a1 1 0 0 1 0-2h2a1 1 0 0 1 .958.713L6.344 6H21a1 1 0 0 1 .937 1.352l-3 8A1 1 0 0 1 18 16zm-9.256-2h8.563l2.25-6H6.944z" />
              </svg>
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
