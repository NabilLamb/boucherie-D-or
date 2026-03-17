// context/AppContext.jsx

"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";

export const AppContext = createContext(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppContextProvider");
  return ctx;
};

/**
 * AppContextProvider
 * This is the main provider that handles global state:
 * - Products fetching (with single-fetch logic)
 * - User metadata/role sync
 * - Cart and Wishlist provider nesting
 */
export const AppContextProvider = ({ children }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);

  // Optimized Fetch Products: Only fetches if the products array is empty
  const fetchProducts = useCallback(async () => {
    if (products.length > 0) return; // FIX: Prevent re-fetching if data exists

    try {
      const { data } = await axios.get("/api/products");
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("[PRODUCTS_FETCH_ERROR]", error.message);
      
      // Retry once after 2 seconds handles occasional cold-start issues
      setTimeout(async () => {
        try {
          const { data } = await axios.get("/api/products");
          if (data.products) setProducts(data.products);
        } catch (retryError) {
          console.error("[PRODUCTS_FETCH_RETRY_FAILED]", retryError.message);
        }
      }, 2000);
    }
  }, [products.length]); // Dependency on length ensures we can check if empty

  const fetchUserData = useCallback(async () => {
    try {
      if (user?.publicMetadata?.role === "seller") {
        setIsSeller(true);
      }

      const token = await getToken();
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("[USER_DATA_ERROR]", error.message);
    }
  }, [user, getToken]);

  // Sync state on load and when user changes
  useEffect(() => {
    if (isLoaded) {
      fetchProducts();
      if (user) {
        fetchUserData();
      }
    }
  }, [isLoaded, user, fetchProducts, fetchUserData]);

  const value = {
    // Auth
    user,
    getToken,
    userData,
    fetchUserData,
    // Seller
    isSeller,
    setIsSeller,
    // Products
    products,
    fetchProducts,
    // Utils
    currency,
    router,
  };

  return (
    <AppContext.Provider value={value}>
      <CartProvider products={products}>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    </AppContext.Provider>
  );
};