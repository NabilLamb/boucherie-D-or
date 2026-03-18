"use client";
// components/HeaderSlider.jsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

// ─── Slider hook ─────────────────────────────────────────────────────────────
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

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    timerRef.current = setInterval(next, interval);
    return () => clearInterval(timerRef.current);
  }, [totalSlides, isPaused, interval, next]);

  return { currentSlide, isPaused, setIsPaused, goToSlide, next, prev };
};

// ─── Slide component ──────────────────────────────────────────────────────────
const Slide = React.memo(({ product, isActive, currency, onAddToCart }) => {
  const discount = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <div
      className={`transition-opacity duration-700 ease-in-out ${
        isActive ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
      }`}
      aria-hidden={!isActive}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-red-900 to-red-800" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content — pb-14 added for mobile dots clearance */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between px-6 pt-8 pb-14 md:pb-6 md:px-12 lg:px-16 md:h-full gap-6 md:gap-8">

        {/* Text */}
        <div className="flex-1 text-white space-y-4 max-w-xl text-center md:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">
              Limited Time Offer
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
            {product.name}
          </h2>

          <p className="text-sm md:text-base text-red-100/80 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
            <span className="text-2xl md:text-3xl font-black text-amber-400">
              {currency}{(product.offerPrice || product.price).toFixed(2)}
            </span>
            {product.offerPrice && (
              <>
                <span className="text-base text-red-300/60 line-through">
                  {currency}{product.price.toFixed(2)}
                </span>
                <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
            <button
              onClick={() => onAddToCart(product)}
              className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-white font-bold px-6 py-2.5 rounded-2xl transition-all shadow-lg shadow-amber-900/30 text-sm"
            >
              Add to Cart
            </button>
            <Link
              href={`/product/${product._id}`}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold px-6 py-2.5 rounded-2xl transition-all text-sm"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative mx-auto flex-shrink-0 w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 group/img">
          <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full animate-pulse" />
          <div className="relative h-full w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl flex items-center justify-center">
            <Image
              src={product.image[0]}
              alt={product.name}
              fill
              className="object-contain p-3 transition-transform duration-500 group-hover/img:scale-105"
              priority={isActive}
              loading={isActive ? "eager" : "lazy"}
              sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
            />
          </div>
          <div className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow-lg border border-white/20">
            Halal ✓
          </div>
        </div>
      </div>
    </div>
  );
});

Slide.displayName = "Slide";

// ─── Main component ───────────────────────────────────────────────────────────
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
      if (!user) return toast.error("Please login to add to cart");
      addToCart(product._id);
      toast.success(`${product.name} added to cart`);
    },
    [user, addToCart]
  );

  if (loading) {
    return (
      <div className="w-full rounded-3xl bg-gradient-to-r from-red-950 to-red-800 animate-pulse h-[500px] mb-8" />
    );
  }

  if (!offers.length) return null; // Simplified fallback for brevity

  return (
    <div className="w-full mb-8">
      <div
        ref={sliderRef}
        className="relative w-full overflow-hidden rounded-3xl shadow-2xl group focus:outline-none md:h-[520px] lg:h-[560px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        tabIndex={0}
        role="region"
        aria-label="Promotional offers"
      >
        {offers.map((product, index) => (
          <Slide
            key={product._id}
            product={product}
            isActive={index === currentSlide}
            currency={currency}
            onAddToCart={handleAddToCart}
          />
        ))}

        {/* Arrows — visible on hover */}
        {offers.length > 1 && (
          <>
            <button
              onClick={prev}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-white text-white hover:text-red-900 backdrop-blur-md border border-white/10 items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-white text-white hover:text-red-900 backdrop-blur-md border border-white/10 items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots — Now correctly moved INSIDE the slider with absolute positioning */}
        {offers.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide ? "true" : "false"}
                className={`transition-all duration-500 rounded-full ${
                  index === currentSlide
                    ? "w-8 h-2.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderSlider;