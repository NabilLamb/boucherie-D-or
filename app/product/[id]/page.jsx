"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart } = useAppContext();
  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  const imageRef = useRef(null);


  const [currentPage, setCurrentPage] = useState(0);
  const PRODUCTS_PER_PAGE = 5;

  const suggestedProducts = useMemo(() => {
    if (!productData || !products.length) return [];

    // Filter out current product and sort by category match
    return products
      .filter((p) => p._id !== productData._id)
      .sort((a, b) => {
        const aMatch = a.category === productData.category ? 1 : 0;
        const bMatch = b.category === productData.category ? 1 : 0;
        return bMatch - aMatch;
      });
  }, [products, productData]);

  const totalPages = Math.ceil(suggestedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = suggestedProducts.slice(
    currentPage * PRODUCTS_PER_PAGE,
    (currentPage + 1) * PRODUCTS_PER_PAGE
  );

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  // Image handling utility function
  const getImageSource = (image) => {
    try {
      if (!image) return assets.default_img;

      if (typeof image === "object" && image.url) {
        return image.url.startsWith("http") ? image.url : assets.default_img;
      }

      if (typeof image === "string") {
        return assets[image] || assets.default_img;
      }

      return assets.default_img;
    } catch (error) {
      return assets.default_img;
    }
  };

  // Zoom effect handlers
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  const fetchProductData = async () => {
    const product = products.find((product) => product._id === id);
    if (product) {
      const normalizedImages = Array.isArray(product.image)
        ? product.image
        : [product.image];

      setProductData({ ...product, image: normalizedImages });
      setMainImage(normalizedImages[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id, products]);

  if (!productData) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Image Gallery Section */}
          <div className="px-5 lg:px-16 xl:px-20">
            <div
              className="relative rounded-lg overflow-hidden bg-gray-100 mb-4 h-[500px] cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              ref={imageRef}
            >
              <Image
                src={getImageSource(mainImage || productData.image[0])}
                alt={productData.name}
                fill
                style={zoomStyle}
                className="object-contain transition-transform duration-200"
                onError={(e) => {
                  e.target.src = assets.default_img;
                }}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productData.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`cursor-pointer rounded-lg overflow-hidden bg-gray-100 border-2 ${
                    image === mainImage
                      ? "border-orange-500"
                      : "border-transparent"
                  } h-24`}
                >
                  <Image
                    src={getImageSource(image)}
                    alt={`${productData.name} thumbnail ${index}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = assets.default_img;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col">
            {/* Product Title and Rating */}
            <div className="border-b pb-6">
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                {productData.name}
              </h1>

              {/* Rating Section */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, index) => {
                    const fullStars = Math.floor(productData.rating);
                    const partialStar = productData.rating - fullStars;
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
                        className="relative w-5 h-5 overflow-hidden"
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
                <p className="text-sm text-gray-600">
                  ({productData.rating?.toFixed(1) || "0.0"})
                </p>
                <span className="text-gray-400 mx-2">|</span>
                <p className="text-sm text-gray-600">123 Reviews</p>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="py-6 border-b">
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-gray-900">
                  €
                  {productData.offerPrice
                    ? productData.offerPrice.toFixed(2)
                    : productData.price.toFixed(2)}
                </p>

                {/* Display original price and discount only if offerPrice exists */}
                {productData.offerPrice && (
                  <>
                    <p className="text-xl text-gray-400 line-through">
                      €{productData.price.toFixed(2)}
                    </p>
                    <span className="bg-green-100 text-green-700 text-sm font-medium px-2 py-1 rounded">
                      {Math.round(
                        ((productData.price - productData.offerPrice) /
                          productData.price) *
                          100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Inclusive of all taxes
              </p>
            </div>

            {/* Product Description */}
            <div className="py-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Product Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {productData.description}
              </p>
            </div>

            {/* Product Specifications */}
            <div className="py-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Specifications
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {productData.category}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Unit</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {productData.unit || "piece"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="py-6 space-y-4">
              <button
                onClick={() => addToCart(productData._id)}
                className="w-full py-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(productData._id);
                  router.push("/cart");
                }}
                className="w-full py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900">
              Related Products
            </h2>
            <p className="text-gray-600 mt-2">
              You might also like these products
            </p>
          </div>

          <div className="relative">
            {/* Navigation Arrows */}
            {suggestedProducts.length > PRODUCTS_PER_PAGE && (
              <div className="absolute inset-y-0 w-full flex items-center justify-between pointer-events-none">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className={`bg-white shadow-lg rounded-full p-3 pointer-events-auto ${
                    currentPage === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-xl"
                  } transition-all`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage >= totalPages - 1}
                  className={`bg-white shadow-lg rounded-full p-3 pointer-events-auto ${
                    currentPage >= totalPages - 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-xl"
                  } transition-all`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentPage ? "bg-gray-900" : "bg-gray-300"
                    } transition-colors`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
