import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

const HeaderSlider = () => {
  const [offers, setOffers] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await axios.get("/api/products/offer");
        setOffers(data.products);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % (offers.length || 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [offers.length]);

  if (!offers.length) return (
    <div className="w-full aspect-square max-h-[800px] bg-gray-100 animate-pulse rounded-xl" />
  );

  return (
    <div className="relative w-full overflow-hidden rounded-2xl xl:rounded-3xl shadow-xl">
      <div 
        className="flex transition-transform duration-1000 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {offers.map((product) => (
          <div 
            key={product._id}
            className="relative flex min-w-full flex-col-reverse md:flex-row items-center justify-between gap-4 md:gap-8 p-4 md:p-8 lg:p-12 xl:p-16 bg-gradient-to-r from-red-900 via-red-800 to-red-900"
          >
            {/* Text Content */}
            <div className="relative z-10 flex-1 flex flex-col items-start space-y-4 md:space-y-6 text-white pb-4 md:pb-0">
              <span className="rounded-full bg-amber-500/20 px-4 py-2 text-sm font-bold text-amber-400">
                🎯 Limited Time Offer
              </span>
              
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-2xl">
                {product.name}
              </h1>
              
              <p className="text-base md:text-xl lg:text-2xl text-red-100/90 max-w-xl">
                {product.description}
              </p>

              <div className="flex items-baseline gap-3 md:gap-4 mt-2 md:mt-4">
                {product.offerPrice ? (
                  <>
                    <span className="text-xl md:text-3xl lg:text-4xl font-bold text-amber-400">
                      ${product.offerPrice}
                    </span>
                    <span className="text-lg md:text-xl text-red-200/80 line-through">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl md:text-3xl font-bold text-white">
                    ${product.price}
                  </span>
                )}
              </div>

              <Link
                href={`/product/${product._id}`}
                className="mt-4 md:mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-2 md:px-8 md:py-3 text-base md:text-lg font-bold text-white transition-all hover:bg-amber-600 hover:scale-105 hover:shadow-lg"
              >
                Order Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Image Container */}
            <div className="relative w-full md:w-1/2 aspect-square max-h-[400px] md:max-h-[600px]">
              <div className="relative w-full h-full overflow-hidden rounded-xl md:rounded-2xl shadow-2xl border-4 border-white/20">
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  fill
                  className="object-contain p-4 md:p-8 bg-white/5"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {offers.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 flex -translate-x-1/2 transform gap-2">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? 'bg-amber-500 scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {offers.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + offers.length) % offers.length)}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % offers.length)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default HeaderSlider;