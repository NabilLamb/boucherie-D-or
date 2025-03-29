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
        const { data } = await axios.get("/api/products?categoryType=offer");
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
    }, 5000);
    return () => clearInterval(interval);
  }, [offers.length]);

  if (!offers.length) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gray-50 shadow-lg">
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {offers.map((product) => (
          <div 
            key={product._id}
            className="flex min-w-full flex-col items-center justify-between gap-6 p-8 md:flex-row md:px-16 md:py-12"
          >
            {/* Text Content */}
            <div className="flex flex-1 flex-col items-start space-y-6 md:max-w-xl">
              <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-600">
                Limited Offer
              </span>
              
              <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                {product.name}
              </h1>
              
              <p className="text-lg text-gray-600 md:text-xl">
                {product.description}
              </p>

              <div className="flex items-baseline gap-4">
                {product.offerPrice ? (
                  <>
                    <span className="text-3xl font-bold text-red-600 md:text-4xl">
                      ${product.offerPrice}
                    </span>
                    <span className="text-xl text-gray-400 line-through md:text-2xl">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900 md:text-4xl">
                    ${product.price}
                  </span>
                )}
              </div>

              <Link
                href={`/product/${product._id}`}
                className="rounded-full bg-red-600 px-8 py-3 text-lg font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg"
              >
                Shop Now →
              </Link>
            </div>

            {/* Image Container */}
            <div className="relative flex flex-1 justify-center md:justify-end">
              <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {offers.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform gap-2">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-red-600 w-6' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderSlider;