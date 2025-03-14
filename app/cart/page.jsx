"use client";
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { getImageSource } from "@/utils/images";
import Link from "next/link";

const Cart = () => {
  const {
    products,
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
  } = useAppContext();

  const getQuantityConfig = (product) => {
    const unit = product.unit?.toLowerCase() || 'piece';
    const isWeight = unit.includes('kg') || unit.includes('g');
    const isDecimalAllowed = isWeight;
    const step = isWeight ? 0.1 : 1;
    const min = isWeight ? 0.1 : 1;
    
    return { isDecimalAllowed, step, min };
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-8 lg:px-12 xl:px-20 pt-8 pb-16">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Shopping Cart ({getCartCount()})
            </h1>
            <button
              onClick={() => router.push("/#products")}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <span>Continue Shopping</span>
              <Image
                src={assets.arrow_right_icon_colored}
                alt="Continue shopping"
                className="w-4 h-4"
              />
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="pb-4 text-left text-gray-600 font-medium">Product</th>
                  <th className="pb-4 text-center text-gray-600 font-medium">Price</th>
                  <th className="pb-4 text-center text-gray-600 font-medium">Quantity</th>
                  <th className="pb-4 text-right text-gray-600 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cartItems).map((itemId) => {
                  const product = products.find((p) => p._id === itemId);
                  if (!product || cartItems[itemId] <= 0) return null;

                  const finalPrice = product.offerPrice ?? product.price;
                  const { isDecimalAllowed, step, min } = getQuantityConfig(product);

                  return (
                    <tr key={itemId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <Link 
                            href={`/product/${product._id}`}
                            className="shrink-0"
                          >
                            <div className="w-20 h-20 rounded-lg bg-gray-100 p-2 hover:shadow-md transition-shadow">
                              <Image
                                src={getImageSource(product.image[0])}
                                alt={product.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            </div>
                          </Link>
                          <div>
                            <Link
                              href={`/product/${product._id}`}
                              className="font-medium text-gray-900 hover:text-orange-600 transition-colors"
                            >
                              {product.name}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">{product.unit}</p>
                            <button
                              onClick={() => updateCartQuantity(product._id, 0)}
                              className="text-xs text-red-600 hover:text-red-700 mt-2 flex items-center gap-1"
                            >
                              <Image src={assets.remove_icon} alt="Remove" className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 text-center text-gray-900">
                        €{finalPrice.toFixed(2)}
                      </td>

                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              const newValue = Math.max(
                                min,
                                Number((cartItems[itemId] - step).toFixed(1)
                              );
                              updateCartQuantity(product._id, newValue);
                            }}
                            className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-100"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={cartItems[itemId]}
                            min={min}
                            step={step}
                            onChange={(e) => {
                              const newValue = Math.max(
                                min,
                                Number(e.target.value)
                              );
                              updateCartQuantity(product._id, newValue);
                            }}
                            className="w-20 px-2 py-1 border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => {
                              const newValue = Number((cartItems[itemId] + step).toFixed(1));
                              updateCartQuantity(product._id, newValue);
                            }}
                            className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-4 text-right text-gray-900 font-medium">
                        €{(finalPrice * cartItems[itemId]).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="md:hidden space-y-6">
            {Object.keys(cartItems).map((itemId) => {
              const product = products.find((p) => p._id === itemId);
              if (!product || cartItems[itemId] <= 0) return null;

              const finalPrice = product.offerPrice ?? product.price;
              const { isDecimalAllowed, step, min } = getQuantityConfig(product);

              return (
                <div key={itemId} className="border-b border-gray-100 pb-6">
                  <div className="flex gap-4">
                    <Link 
                      href={`/product/${product._id}`}
                      className="shrink-0"
                    >
                      <div className="w-20 h-20 rounded-lg bg-gray-100 p-2">
                        <Image
                          src={getImageSource(product.image[0])}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/product/${product._id}`}
                        className="font-medium text-gray-900 hover:text-orange-600"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{product.unit}</p>
                      <p className="text-lg font-medium mt-2">
                        €{(finalPrice * cartItems[itemId]).toFixed(2)}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const newValue = Math.max(
                                min,
                                Number((cartItems[itemId] - step).toFixed(1)
                              );
                              updateCartQuantity(product._id, newValue);
                            }}
                            className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-100"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={cartItems[itemId]}
                            min={min}
                            step={step}
                            onChange={(e) => {
                              const newValue = Math.max(
                                min,
                                Number(e.target.value)
                              );
                              updateCartQuantity(product._id, newValue);
                            }}
                            className="w-20 px-2 py-1 border rounded text-center [appearance:textfield]"
                          />
                          <button
                            onClick={() => {
                              const newValue = Number((cartItems[itemId] + step).toFixed(1));
                              updateCartQuantity(product._id, newValue);
                            }}
                            className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => updateCartQuantity(product._id, 0)}
                          className="text-red-600 hover:text-red-700 flex items-center gap-1 ml-auto"
                        >
                          <Image src={assets.remove_icon} alt="Remove" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:w-96">
          <OrderSummary />
        </div>
      </div>
    </>
  );
};

export default Cart;