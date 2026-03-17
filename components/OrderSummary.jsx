// components/OrderSummary.jsx

"use client";

import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import PaymentModal from "@/components/PaymentModal";

const OrderSummary = () => {
  const { currency, router, getToken, user } = useAppContext();
  const { cartItems, setCartItems, getCartCount, getCartAmount } = useCart();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        const addresses = data.data || [];
        setUserAddresses(addresses);
        if (addresses.length > 0) setSelectedAddress(addresses[0]);
      }
    } catch (error) {
      toast.error("Failed to fetch addresses");
    }
  };

  useEffect(() => {
    if (user) fetchUserAddresses();
  }, [user]);

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    const hasItems = Object.values(cartItems || {}).some((qty) => qty > 0);
    if (!hasItems) {
      toast.error("Your cart is empty");
      return;
    }
    // Open payment modal instead of placing order directly
    setIsPaymentOpen(true);
  };

  // Called by PaymentModal after successful "payment"
  const handlePaymentSuccess = async () => {
    try {
      const cartItemsArray = Object.keys(cartItems)
        .map((key) => ({ product: key, quantity: cartItems[key] }))
        .filter((item) => item.quantity > 0);

      const token = await getToken();
      const { data } = await axios.post(
        "/api/order/create",
        { address: selectedAddress.id, items: cartItemsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setCartItems({});
        setIsPaymentOpen(false);
        router.push("/order-placed");
      } else {
        toast.error(data.message);
        setIsPaymentOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setIsPaymentOpen(false);
    }
  };

  return (
    <>
      <div className="w-full md:w-96 bg-gray-500/5 p-5">
        <h2 className="text-xl md:text-2xl font-medium text-gray-700">
          Order Summary
        </h2>
        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-6">
          {/* Address selector */}
          <div>
            <label className="text-base font-medium uppercase text-gray-600 block mb-2">
              Select Address
            </label>
            <div className="relative inline-block w-full text-sm border">
              <button
                className="w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>
                  {selectedAddress
                    ? `${selectedAddress.fullName}, ${selectedAddress.city}, ${selectedAddress.postalCode}, ${selectedAddress.address}`
                    : "Select Address"}
                </span>
                <svg
                  className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-0" : "-rotate-90"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#6B7280"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                  {userAddresses.map((address, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                      onClick={() => {
                        setSelectedAddress(address);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {address.fullName}, {address.postalCode}, {address.city},{" "}
                      {address.address}
                    </li>
                  ))}
                  <li
                    onClick={() => router.push("/add-address")}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center text-amber-600 font-medium"
                  >
                    + Add New Address
                  </li>
                </ul>
              )}
            </div>
          </div>

          <hr className="border-gray-500/30" />

          {/* Price breakdown */}
          <div className="space-y-4">
            <div className="flex justify-between text-base font-medium">
              <p className="uppercase text-gray-600">Items {getCartCount()}</p>
              <p className="text-gray-800">
                {currency}{getCartAmount().toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Shipping</p>
              <p className="font-medium text-gray-800">Free</p>
            </div>
            <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
              <p>Total</p>
              <p>{currency}{getCartAmount().toFixed(2)}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 transition-colors font-medium"
        >
          Place Order
        </button>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={getCartAmount()}
        currency={currency}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default OrderSummary;
