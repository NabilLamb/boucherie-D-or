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
  const { products, router, cartItems, updateCartQuantity, getCartCount } =
    useAppContext();

  const handleQuantityChange = (productId, newQuantity) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    let minQuantity = 1;
    let roundedQuantity = newQuantity;

    if (["kg", "liter"].includes(product.unit)) {
      minQuantity = 0.1;
      roundedQuantity = Math.round(newQuantity * 10) / 10; // Round to 1 decimal
    }

    updateCartQuantity(productId, Math.max(minQuantity, roundedQuantity));
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-4 md:px-8 lg:px-16 pt-8 mb-20 pt-24">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Shopping Cart
            </h1>
            <p className="text-lg text-gray-600">
              {getCartCount()} {getCartCount() === 1 ? "Item" : "Items"}
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left text-gray-600 font-medium">
                    Product
                  </th>
                  <th className="py-4 px-6 text-center text-gray-600 font-medium">
                    Price
                  </th>
                  <th className="py-4 px-6 text-center text-gray-600 font-medium">
                    Quantity
                  </th>
                  <th className="py-4 px-6 text-center text-gray-600 font-medium">
                    Unit
                  </th>
                  <th className="py-4 px-6 text-right text-gray-600 font-medium">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cartItems).map((itemId) => {
                  const product = products.find((p) => p._id === itemId);
                  if (!product || cartItems[itemId] <= 0) return null;

                  const isWeightVolume = ["kg", "liter"].includes(product.unit);
                  const minQty = isWeightVolume ? 0.1 : 1;
                  const step = isWeightVolume ? 0.1 : 1;
                  const finalPrice = product.offerPrice ?? product.price;

                  return (
                    <tr
                      key={itemId}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/product/${product._id}`}
                            className="shrink-0"
                          >
                            <div className="w-20 h-20 bg-gray-100 rounded-lg p-2">
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
                              className="font-medium text-gray-800 hover:text-orange-600 transition-colors"
                            >
                              {product.name}
                            </Link>
                            <button
                              onClick={() => updateCartQuantity(product._id, 0)}
                              className="mt-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="py-6 px-6 text-center text-gray-700">
                        €{finalPrice.toFixed(2)}
                      </td>

                      <td className="py-6 px-6 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              const newValue = Math.max(
                                min,
                                Number((cartItems[itemId] - step).toFixed(1))
                              );
                              updateCartQuantity(product._id, newValue);
                            }}
                            disabled={cartItems[itemId] <= minQty}
                            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={cartItems[itemId]}
                            min={minQty}
                            step={step}
                            onChange={(e) =>
                              handleQuantityChange(
                                product._id,
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-20 h-8 border border-gray-300 rounded-lg text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product._id,
                                cartItems[itemId] + step
                              )
                            }
                            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-6 px-6 text-center text-gray-700 uppercase">
                        {product.unit}
                      </td>

                      <td className="py-6 px-6 text-right text-gray-700 font-medium">
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

              const isWeightVolume = ["kg", "liter"].includes(product.unit);
              const minQty = isWeightVolume ? 0.1 : 1;
              const step = isWeightVolume ? 0.1 : 1;
              const finalPrice = product.offerPrice ?? product.price;

              return (
                <div
                  key={itemId}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex gap-4">
                    <Link href={`/product/${product._id}`} className="shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg p-2">
                        <Image
                          src={getImageSource(product.image[0])}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/product/${product._id}`}
                        className="font-medium text-gray-800 hover:text-orange-600 transition-colors"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        {product.unit}
                      </p>
                      <p className="text-lg font-medium text-gray-800 mt-2">
                        €{(finalPrice * cartItems[itemId]).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            cartItems[itemId] - step
                          )
                        }
                        disabled={cartItems[itemId] <= minQty}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={cartItems[itemId]}
                        min={minQty}
                        step={step}
                        onChange={(e) =>
                          handleQuantityChange(
                            product._id,
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-16 h-8 border border-gray-300 rounded-lg text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            cartItems[itemId] + step
                          )
                        }
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => updateCartQuantity(product._id, 0)}
                      className="text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/#products"
            className="inline-flex items-center mt-8 gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Continue Shopping
          </Link>
        </div>

        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
