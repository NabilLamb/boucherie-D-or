import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
const Banner = () => {
  const [bannerProducts, setBannerProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart, router } = useAppContext();

  useEffect(() => {
    const fetchBannerProducts = async () => {
      try {
        const { data } = await axios.get("/api/products/banner");
        setBannerProducts(data.products);
      } catch (error) {
        console.error("Error fetching banner products:", error);
      }
    };
    fetchBannerProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product._id);
  };

  useEffect(() => {
    if (bannerProducts.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerProducts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [bannerProducts.length]);

  if (!bannerProducts.length) return null;

  return (
    <div className="relative mx-auto my-12 max-w-7xl overflow-hidden rounded-2xl shadow-xl">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerProducts.map((product, index) => (
          <div
            key={product._id}
            className="relative flex min-w-full flex-col md:flex-row"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-800/60" />

            {/* Content */}
            <div className="relative z-10 flex flex-1 flex-col justify-center p-8 text-white md:p-12 lg:p-16">
              <span className="mb-2 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
                Special Selection
              </span>
              <h2 className="text-4xl font-bold leading-tight md:text-5xl">
                {product.name}
              </h2>
              <p className="mt-4 max-w-md text-lg opacity-90">
                {product.description}
              </p>
              <div className="mt-6 flex items-baseline gap-4">
                {product.offerPrice ? (
                  <>
                    <span className="text-3xl font-bold md:text-4xl">
                      ${product.offerPrice}
                    </span>
                    <span className="text-xl text-red-200 line-through">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold md:text-4xl">
                    ${product.price}
                  </span>
                )}
                <span className="text-lg text-red-200">/{product.unit}</span>
              </div>

              <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
                router.push("/cart");
              }}
              
              className="mt-8 inline-block w-fit rounded-full bg-white px-8 py-3 text-lg font-semibold text-red-600 transition-all hover:bg-opacity-90">
                Shop Now →
              </button>
            </div>

            {/* Images */}
            <div className="relative flex flex-1 items-center justify-center p-8">
              <div className="relative aspect-square w-full max-w-xl">
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {bannerProducts.length > 1 && (
        <div className=" absolute bottom-3 left-1/2 flex -translate-x-1/2 transform gap-2">
          {bannerProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-8 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
