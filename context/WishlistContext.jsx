// context/WishlistContext.jsx

"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get("/api/my-liked/list");
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error("[WISHLIST_FETCH_ERROR]", error.message);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setIsWishlistLoading(false);
    }
  }, [user]);

  const addToWishlist = async (product) => {
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }

    // Optimistic update
    setWishlist((prev) => [...prev, { product }]);

    try {
      const token = await getToken();
      await axios.post(
        "/api/my-liked/create",
        { userId: user.id, productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchWishlist();
      toast.success("Added to favorites");
    } catch (error) {
      // Rollback on failure
      setWishlist((prev) =>
        prev.filter((item) => item.product._id !== product._id)
      );
      toast.error(error.response?.data?.message || "Failed to add to favorites");
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;

    // Optimistic update
    const previous = [...wishlist];
    setWishlist((prev) =>
      prev.filter((item) => item.product._id !== productId)
    );

    try {
      const token = await getToken();
      await axios.post(
        "/api/my-liked/delete",
        { userId: user.id, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Removed from favorites");
    } catch (error) {
      // Rollback on failure
      setWishlist(previous);
      toast.error("Failed to remove from favorites");
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.product?._id === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlistLoading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        // Keep updateWishlist for direct state override (used in ProductCard)
        updateWishlist: setWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
