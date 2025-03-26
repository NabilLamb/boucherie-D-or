"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import { HeartIcon } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import { toast } from "react-hot-toast";

const page = () => {
  const { user, wishlist, updateWishlist } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get("/api/my-liked/list");
        const uniqueProducts = data.wishlist.reduce((acc, current) => {
          if (!acc.find((item) => item.product._id === current.product._id)) {
            acc.push(current);
          }
          return acc;
        }, []);
        updateWishlist(uniqueProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Your Favorites ({wishlist.length})
            </h1>
            <p className="mt-2 text-gray-600">
              All products you've saved for later
            </p>
          </div>
          {loading ? (
            <Loading />
          ) : wishlist.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <HeartIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-500">
                Click the heart icon on products to save them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <ProductCard key={item.product._id} product={item.product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default page;
