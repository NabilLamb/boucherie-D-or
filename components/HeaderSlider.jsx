// components/HeaderSlider.jsx

"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

// ─── Custom hook: isolates all slider logic ──────────────────────────────────
const useSlider = (totalSlides, interval = 8000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const goToSlide = useCallback(
    (index) => {
      if (isAnimating || index === currentSlide) return;
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating, currentSlide]
  );

  const next = useCallback(
    () => goToSlide((currentSlide + 1) % totalSlides),
    [currentSlide, totalSlides, goToSlide]
  );

  const prev = useCallback(
    () => goToSlide((currentSlide - 1 + totalSlides) % totalSlides),
    [currentSlide, totalSlides, goToSlide]
  );

  // Auto-play — resets timer on manual navigation
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    timerRef.current = setInterval(next, interval);
    return () => clearInterval(timerRef.current);
  }, [totalSlides, isPaused, interval, next]);

  return { currentSlide, isPaused, setIsPaused, goToSlide, next, prev };
};

// ─── Memoized slide — only re-renders when it becomes active/inactive ────────
const Slide = React.memo(({ product, isActive, currency, onAddToCart }) => {
  const discount = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
      }`}
      aria-hidden={!isActive}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950 via-red-900 to-red-800" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-10 lg:px-16 gap-2 md:gap-6">
        {/* Text */}
        <div className="flex-1 text-white space-y-3 md:space-y-4 pt-6 md:pt-0 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 text-xs font-semibold tracking-wide uppercase">
              Limited Time Offer
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            {product.name}
          </h2>

          {/* Truncated to 2 lines — buttons never shift position */}
          <p className="text-sm md:text-base text-red-100/80 leading-relaxed line-clamp-2 max-w-md">
            {product.description}
          </p>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl md:text-3xl font-bold text-amber-400">
              {currency}{(product.offerPrice || product.price).toFixed(2)}
            </span>
            {product.offerPrice && (
              <>
                <span className="text-lg text-red-300/70 line-through">
                  {currency}{product.price.toFixed(2)}
                </span>
                <span className="bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => onAddToCart(product)}
              className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25 text-sm"
            >
              Add to Cart
            </button>
            <Link
              href={`/product/${product._id}`}
              className="border border-white/30 hover:border-white/60 text-white/80 hover:text-white font-medium px-6 py-2.5 rounded-full transition-all duration-200 text-sm"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex-shrink-0 w-[180px] h-[180px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] group/img mb-6 md:mb-0">
          <div className="absolute inset-4 rounded-full bg-amber-500/10 blur-3xl animate-pulse" />
          <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <Image
              src={product.image[0]}
              alt={product.name}
              fill
              className="object-contain p-4 drop-shadow-2xl transition-transform duration-500 group-hover/img:scale-110"
              sizes="(max-width: 768px) 220px, 320px"
              priority={isActive}
              loading={isActive ? "eager" : "lazy"}
            />
          </div>
          <div className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20">
            Halal ✓
          </div>
        </div>
      </div>
    </div>
  );
});

Slide.displayName = "Slide";

// ─── Main component ──────────────────────────────────────────────────────────
const HeaderSlider = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppContext();
  const { addToCart } = useCart();
  const sliderRef = useRef(null);
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "€";

  useEffect(() => {
    axios
      .get("/api/products/offer")
      .then(({ data }) => setOffers(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const { currentSlide, isPaused, setIsPaused, goToSlide, next, prev } =
    useSlider(offers.length);

  // Keyboard navigation
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") { prev(); e.preventDefault(); }
      if (e.key === "ArrowRight") { next(); e.preventDefault(); }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const handleAddToCart = useCallback(
    (product) => {
      if (!user) {
        toast.error("Please login to add to cart");
        return;
      }
      addToCart(product._id);
      toast.success(`${product.name} added to cart`);
    },
    [user, addToCart]
  );

  // Loading skeleton
  if (loading) {
    return (
      <div
        className="w-full rounded-2xl bg-gradient-to-r from-red-950 to-red-800 animate-pulse"
        style={{ height: "clamp(520px, 70vh, 620px)" }}
      />
    );
  }

  // Fallback when no offers exist
  if (!offers.length) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
        style={{ height: "clamp(520px, 70vh, 620px)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-950 to-red-800" />
        <div className="relative h-full flex flex-col items-center justify-center text-white px-6 text-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold">Premium Halal Butcher</h2>
          <p className="text-lg text-red-100/80 max-w-md">
            Fresh cuts, expertly prepared. Free delivery on orders over {currency}50.
          </p>
          <Link
            href="/#products"
            className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-3 rounded-full transition-all hover:scale-105"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sliderRef}
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl group focus:outline-none"
      style={{ height: "clamp(520px, 70vh, 620px)" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      tabIndex={0}
      role="region"
      aria-label="Promotional offers"
    >
      {/* Slides */}
      {offers.map((product, index) => (
        <Slide
          key={product._id}
          product={product}
          isActive={index === currentSlide}
          currency={currency}
          onAddToCart={handleAddToCart}
        />
      ))}

      {/* Arrows — hidden until hover */}
      {offers.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-white text-white hover:text-red-900 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-white text-white hover:text-red-900 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {offers.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : "false"}
              className={`transition-all duration-500 rounded-full ${
                index === currentSlide
                  ? "w-8 h-2 bg-amber-400"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderSlider;
