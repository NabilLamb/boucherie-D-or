// app/product/[id]/ProductPageClient.jsx

"use client";

import { useEffect, useState, useRef, use } from "react";
import Image from "next/image";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { StarIcon, WeightIcon, AgeIcon, CutIcon } from "@/components/Icons";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { toast } from "react-hot-toast";

const ProductPageClient = ({ params }) => {
  const { id } = use(params);
  const { currency, router, user } = useAppContext();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const handleCarousel = (direction) => {
    if (!carouselRef.current) return;
    const amount = carouselRef.current.clientWidth * 0.8;
    carouselRef.current.scrollBy({
      left: direction === "prev" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }
    addToCart(product._id);
    toast.success(`${product.name} added to cart`);
  };

  const handleShopNow = () => {
    if (!user) {
      toast.error("Please login to checkout");
      return;
    }
    addToCart(product._id);
    router.push("/cart");
  };

  // Optimized FetchData using Parallel Promises
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch main product first to get the category ID
        const { data: productData } = await axios.get(`/api/products/${id}`);
        if (!productData.success) throw new Error(productData.message);

        const fetchedProduct = productData.product;
        const categoryId = fetchedProduct.category?._id || fetchedProduct.category;

        // 2. Fetch related products in parallel with any other secondary data
        // This prevents the "waterfall" delay
        const [relatedRes] = await Promise.all([
          axios.get(`/api/products?category=${categoryId}&exclude=${id}&limit=12`)
        ]);

        setProduct(fetchedProduct);
        setRelatedProducts(relatedRes.data.products || []);
      } catch (err) {
        console.error("[FETCH_ERROR]", err);
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [relatedProducts]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image gallery */}
          <div className="space-y-6">
            <div className="aspect-square relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={product.image[mainImage]}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Premium Selection
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(index)}
                  className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-all ${
                    index === mainImage
                      ? "border-red-600 scale-105"
                      : "border-gray-200 hover:border-red-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product details */}
          <div className="space-y-8">
            <div className="border-b pb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-yellow-600">
                <StarIcon className="w-5 h-5" />
                <span className="font-medium">Quality Guaranteed</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-red-600">
                  {currency}
                  {(product.offerPrice || product.price).toFixed(2)}
                  <span className="text-lg text-gray-500 ml-2">
                    /{product.unit}
                  </span>
                </span>
                {product.offerPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {currency}
                    {product.price.toFixed(2)}
                  </span>
                )}
              </div>
              {product.offerPrice && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                  Special Offer: Save{" "}
                  {(((product.price - product.offerPrice) / product.price) * 100).toFixed(0)}%
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <CutIcon className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{product.category?.name || "General"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <WeightIcon className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Standard Pack</p>
                  <p className="font-medium">1.0–1.5 {product.unit}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold transition-colors shadow-md"
              >
                Add to Cart
              </button>
              <button
                onClick={handleShopNow}
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-semibold transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related products carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 relative">
            <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
            <div className="relative">
              <button
                onClick={() => handleCarousel("prev")}
                disabled={!canScrollLeft}
                className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center transition-all ${
                  !canScrollLeft ? "opacity-0 invisible" : "hover:bg-gray-100"
                }`}
              >
                &larr;
              </button>
              <button
                onClick={() => handleCarousel("next")}
                disabled={!canScrollRight}
                className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center transition-all ${
                  !canScrollRight ? "opacity-0 invisible" : "hover:bg-gray-100"
                }`}
              >
                &rarr;
              </button>
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-6 px-2 no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {relatedProducts.map((p) => (
                  <div key={p._id} className="flex-shrink-0 w-72">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductPageClient;