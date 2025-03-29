"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);
  

  // Memoize fetchProducts
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/products");
      if (data.products) {
        setProducts((prev) => {
          const prevIds = prev.map(p => p._id).sort();
          const newIds = data.products.map(p => p._id).sort();
          if (JSON.stringify(prevIds) === JSON.stringify(newIds)) {
            return prev; // Avoid re-render if products are the same
          }
          return data.products;
        });
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    }
  }, []);

    // Memoize fetchUserData
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
          setCartItems(data.user.cartItems);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("fetchUserData error:", error);
        toast.error(error.message);
      }
    }, [user, getToken]);
  
    useEffect(() => {
      if (isLoaded) {
        fetchProducts();
        if (user) {
          fetchUserData();
        }
      }
    }, [isLoaded, user, fetchProducts, fetchUserData]);

  

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          "/api/cart/update",
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Item added to cart");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          "/api/cart/update",
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // toast.success('Cart Updated')
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    return Object.keys(cartItems).filter((itemId) => cartItems[itemId] > 0)
      .length;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product && cartItems[itemId] > 0) {
        const price = product.offerPrice || product.price;
        totalAmount += price * cartItems[itemId];
      }
    }
    return totalAmount;
  };


  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const initializeWishlist = async () => {
      if (user) {
        await fetchWishlist();
      }
    };
    initializeWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      if (user) {
        const { data } = await axios.get("/api/my-liked/list");
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
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

  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProducts,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    wishlist,
    isWishlistLoading,
    updateWishlist: setWishlist,
    fetchWishlist,

  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
