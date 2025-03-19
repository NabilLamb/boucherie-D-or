"use client";
import { productsDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
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

   const fetchProductData = async () => {
    try {
      const {data} = await axios.get('/api/product/list');
      if(data.success){
        setProducts(data.products);
      }else{
        toast.error(data.message);
      }
    }catch (error){
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      console.log("fetchUserData called");
      if (user.publicMetadata.role === "seller") {
        setIsSeller(true);
      }
      const token = await getToken();
      console.log("Token:", token);
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API response:", data);
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
  };

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    if(user){
      try {
        const token = await getToken();
        await axios.post('/api/cart/update', {cartData}, {headers:{Authorization: `Bearer ${token}`}});
        toast.success('Item added to cart')
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
    if(user){
      try {
        const token = await getToken();
        await axios.post('/api/cart/update', {cartData}, {headers:{Authorization: `Bearer ${token}`}});
        // toast.success('Cart Updated')
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    return Object.keys(cartItems).filter(itemId => cartItems[itemId] > 0).length;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const product = products.find(p => p._id === itemId);
      if (product && cartItems[itemId] > 0) {
        const price = product.offerPrice || product.price;
        totalAmount += price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

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
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
