"use client";
import { useEffect, useState, useRef } from "react";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import SuggestedProductsSection from "@/components/SuggestedProductsSection";
import {getImageSource} from "@/utils/images"

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart } = useAppContext();
  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  const imageRef = useRef(null);

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

  // Fetch product data
  const fetchProductData = async () => {
    const product = products.find((p) => p._id === id);
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
        {/* Main product info */}
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
            {/* Product Title & Rating */}
            <div className="border-b pb-6">
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                {productData.name}
              </h1>
              {/* Star Rating */}
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
                        {/* Gray background */}
                        <div className="absolute inset-0 bg-gray-200" />
                        {/* Yellow overlay */}
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

            {/* Pricing */}
            <div className="py-6 border-b">
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-gray-900">
                  €
                  {productData.offerPrice
                    ? productData.offerPrice.toFixed(2)
                    : productData.price.toFixed(2)}
                </p>
                {/* Original price & discount */}
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

        <SuggestedProductsSection
          products={products}
          currentProductId={productData._id}
          category={productData.category}
        />
      </div>

      <Footer />
    </>
  );
};

export default Product;
