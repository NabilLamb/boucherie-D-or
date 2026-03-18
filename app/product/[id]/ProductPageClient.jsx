// app/product/[id]/ProductPageClient.jsx

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "react-hot-toast";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  StarIcon,
  WeightIcon,
  AgeIcon,
  CutIcon,
  HeartIcon,
} from "@/components/Icons";

// ----------------------------------------------------------------------
// Subcomponents
// ----------------------------------------------------------------------

const ImageGallery = ({ product }) => {
  const [mainImage, setMainImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => setImageError(true);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-amber-100 bg-white shadow-lg">
        <Image
          src={imageError ? "/images/fallback-product.jpg" : product.image[mainImage]}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          onError={handleImageError}
        />
        {product.attributes?.halal && (
          <div className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
            Halal ✓
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {product.image.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(index)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${index === mainImage
                ? "border-amber-600 shadow-md scale-105"
                : "border-gray-200 hover:border-amber-400"
              }`}
            aria-pressed={index === mainImage}
            aria-label={`View ${product.name} image ${index + 1}`}
          >
            <Image
              src={img}
              alt={`${product.name} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 10vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const ProductInfo = ({ product, onAddToCart, onBuyNow }) => {
  const { currency, user } = useAppContext();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Determine step and min based on unit (decimal for kg/liter)
  const isWeightUnit = ["kg", "liter"].includes(product.unit);
  const step = isWeightUnit ? 0.1 : 1;
  const minQty = isWeightUnit ? 0.1 : 1;

  const [quantity, setQuantity] = useState(minQty);
  const [isProcessing, setIsProcessing] = useState(false);

  const liked = isInWishlist(product._id);
  const discount = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }
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

  const increment = () => setQuantity((q) => Math.round((q + step) * 10) / 10);
  const decrement = () => setQuantity((q) => Math.max(minQty, Math.round((q - step) * 10) / 10));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900 lg:text-4xl">
          {product.name}
        </h1>
        <div className="mt-2 flex items-center gap-2 text-amber-600">
          <StarIcon className="h-5 w-5 fill-current" />
          <span className="font-medium">Premium Quality</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-bold text-amber-700">
            {currency}
            {(product.offerPrice || product.price).toFixed(2)}
            <span className="ml-2 text-lg text-gray-500">/{product.unit}</span>
          </span>
          {product.offerPrice && (
            <span className="text-xl text-gray-400 line-through">
              {currency}
              {product.price.toFixed(2)}
            </span>
          )}
        </div>
        {discount > 0 && (
          <div className="inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
            Save {discount}% – Limited Time
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-amber-100 bg-white p-6">
        <div className="flex items-center gap-3">
          <CutIcon className="h-8 w-8 text-amber-600" />
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{product.category?.name || "Meat"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <WeightIcon className="h-8 w-8 text-amber-600" />
          <div>
            <p className="text-sm text-gray-500">Avg. Weight</p>
            <p className="font-medium">
              {product.weightRange || "1.0–1.5"} {product.unit}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="mt-2 leading-relaxed text-gray-600">{product.description}</p>
      </div>

      {/* Quantity Selector with Unit Label */}
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-lg border border-gray-300">
          <button
            onClick={decrement}
            className="px-3 py-2 text-xl text-gray-600 hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              let val = parseFloat(e.target.value);
              if (isNaN(val)) val = minQty;
              val = Math.max(minQty, val);
              setQuantity(val);
            }}
            onBlur={(e) => {
              let val = parseFloat(e.target.value);
              if (isNaN(val)) val = minQty;
              // Snap to nearest step
              val = Math.round(val / step) * step;
              val = Math.max(minQty, val);
              setQuantity(val);
            }}
            min={minQty}
            step={step}
            className="w-16 border-0 text-center focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={increment}
            className="px-3 py-2 text-xl text-gray-600 hover:bg-gray-100"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <span className="text-sm font-medium text-gray-600 w-12">
          {product.unit}
        </span>
        <button
          onClick={handleWishlist}
          disabled={isProcessing}
          className="rounded-full p-3 text-gray-600 hover:bg-amber-50"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => onAddToCart(quantity)}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 py-4 font-semibold text-white transition-colors hover:bg-amber-700 shadow-md"
        >
          Add to Cart • {currency}
          {((product.offerPrice || product.price) * quantity).toFixed(2)}
        </button>
        <button
          onClick={() => onBuyNow(quantity)}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-700 py-4 font-semibold text-white transition-colors hover:bg-red-800"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

const RelatedProductsCarousel = ({ products }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, products]);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const amount = carouselRef.current.clientWidth * 0.8;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!products.length) return null;

  return (
    <div className="mt-16">
      <h2 className="mb-6 font-serif text-2xl font-bold text-gray-900">
        You Might Also Like
      </h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`absolute -left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl transition-all ${canScrollLeft
              ? "text-gray-800 hover:bg-gray-100"
              : "cursor-not-allowed text-gray-300 opacity-50"
            }`}
          aria-label="Previous products"
        >
          ←
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`absolute -right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl transition-all ${canScrollRight
              ? "text-gray-800 hover:bg-gray-100"
              : "cursor-not-allowed text-gray-300 opacity-50"
            }`}
          aria-label="Next products"
        >
          →
        </button>
        <div
          ref={carouselRef}
          className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div key={product._id} className="w-72 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Component (exported as ProductPageClient)
// ----------------------------------------------------------------------
export default function ProductPageClient({ product, relatedProducts }) {
  const { user, router } = useAppContext();
  const { addToCart } = useCart();

  const handleAddToCart = (quantity = 1) => {
    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }
    addToCart(product._id, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = (quantity = 1) => {
    if (!user) {
      toast.error("Please login to checkout");
      return;
    }
    addToCart(product._id, quantity);
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 pt-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ImageGallery product={product} />
          <ProductInfo
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>
        <RelatedProductsCarousel products={relatedProducts} />
      </main>
      <Footer />
    </div>
  );
}