import React from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();
  const [isLiked, setIsLiked] = React.useState(false);

  // Calculate star rating
  const fullStars = Math.floor(product.rating);
  const partialStar = product.rating - fullStars;

  // Handle image source correctly
  const getImageSource = () => {
    try {
      // Use default image from assets
      const defaultImage = assets.default_img;
      
      // If no image is provided, return default
      if (!product.image || product.image.length === 0) return defaultImage;
      
      // Handle both array and string formats
      const imgSources = Array.isArray(product.image) 
        ? product.image
        : [product.image];

      // Find first valid image source
      const validSource = imgSources.find(source => {
        if (typeof source === 'string') {
          return source.trim() !== '' && assets[source];
        }
        return source?.url?.trim() !== '';
      });

      // Return valid source or default
      return validSource ? assets[validSource] || validSource.url : defaultImage;
    } catch (error) {
      console.error("Error processing image:", error);
      return assets.default_img;
    }
  };

  const imageSrc = getImageSource();

  // Toggle heart color
  const handleHeartClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

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
          onClick={handleHeartClick}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-sm hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-6 h-6 transition-colors ${
              isLiked
                ? "fill-red-500 stroke-red-500"
                : "fill-white stroke-black"
            }`}
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="w-full space-y-1.5">
        {/* Category, SubCategory & Unit */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="truncate">
            {product.category} / {product.subCategory}
          </span>
          <span>{product.unit}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold truncate">{product.name}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 h-12">
          {product.description}
        </p>

        {/* Rating Section */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            {[...Array(5)].map((_, index) => {
              const isFull = index < fullStars;
              const isPartial = index === fullStars && partialStar > 0;
              const fillWidth = isFull
                ? 100
                : isPartial
                ? partialStar * 100
                : 0;

              return (
                <div
                  key={index}
                  className="relative w-4 h-4 overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  }}
                >
                  {/* Gray background for inactive star */}
                  <div className="absolute inset-0 bg-gray-200" />

                  {/* Yellow overlay for active portion */}
                  <div
                    className="absolute inset-y-0 left-0 bg-yellow-400 transition-all duration-200"
                    style={{ width: `${fillWidth}%` }}
                  />
                </div>
              );
            })}
          </div>
          <span className="text-xs text-gray-500">
            ({product.rating.toFixed(1)})
          </span>
        </div>

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

          {/* Buy Now Button */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add your buy now logic here
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
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;