// context/CartContext.jsx

"use client";


import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
};

export const CartProvider = ({ children, products }) => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [cartItems, setCartItems] = useState({});

    // Load cart from user data when user is available
    const loadCart = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/cart/get", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                setCartItems(data.cartItems || {});
            }
        } catch (error) {
            console.error("[CART_LOAD_ERROR]", error.message);
        }
    };

    useEffect(() => {
        if (user) {
            loadCart();
        } else {
            setCartItems({});
        }
    }, [user]);

    const syncCart = async (cartData) => {
        try {
            const token = await getToken();
            await axios.post(
                "/api/cart/update",
                { cartData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("[CART_SYNC_ERROR]", error.message);
        }
    };

    const addToCart = async (itemId) => {
        const cartData = { ...cartItems };
        cartData[itemId] = (cartData[itemId] || 0) + 1;
        setCartItems(cartData);
        if (user) await syncCart(cartData);
    };

    const updateCartQuantity = async (itemId, quantity) => {
        const cartData = { ...cartItems };
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData);
        if (user) await syncCart(cartData);
    };

    const clearCart = () => setCartItems({});

    const getCartCount = () =>
        Object.keys(cartItems).filter((id) => cartItems[id] > 0).length;

    const getCartAmount = () => {
        let total = 0;
        for (const itemId in cartItems) {
            const product = products?.find((p) => p._id === itemId);
            if (product && cartItems[itemId] > 0) {
                total += (product.offerPrice || product.price) * cartItems[itemId];
            }
        }
        return total;
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                setCartItems,
                addToCart,
                updateCartQuantity,
                clearCart,
                getCartCount,
                getCartAmount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
