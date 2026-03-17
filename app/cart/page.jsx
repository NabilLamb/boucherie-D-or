// app/cart/page.jsx

"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import OrderSummary from "@/components/OrderSummary";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import { getImageSource } from "@/utils/images";
import { TruckIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

const Cart = () => {
  const { cartItems, updateCartQuantity } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Local quantity state — decoupled from context to prevent flicker
  const [localQuantities, setLocalQuantities] = useState({});
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const itemIds = useMemo(
    () => Object.keys(cartItems || {}).filter((id) => cartItems[id] > 0),
    [cartItems]
  );

  // Sync local quantities when cart loads or items change
  useEffect(() => {
    setLocalQuantities((prev) => {
      const next = { ...prev };
      itemIds.forEach((id) => {
        // Only set if not already being edited locally
        if (next[id] === undefined) {
          next[id] = cartItems[id];
        }
      });
      return next;
    });
  }, [itemIds]);

  // Fetch product details for items in cart
  useEffect(() => {
    if (itemIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/products/cart?ids=${itemIds.join(",")}`
        );
        const { products: cartProducts } = await response.json();

        const missingIds = itemIds.filter(
          (id) => !cartProducts.find((p) => p._id === id)
        );
        if (missingIds.length > 0) {
          missingIds.forEach((id) => updateCartQuantity(id, 0));
          toast.error("Some items are unavailable and were removed.");
        }

        setProducts(cartProducts);
      } catch (err) {
        setError(err.message || "Failed to load cart data");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Only re-fetch when the list of item IDs changes, not on every quantity update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(itemIds)]);

  const handleQuantityChange = useCallback(
    (productId, newQuantity) => {
      const product = products.find((p) => p._id === productId);
      if (!product) return;

      const isWeight = ["kg", "liter"].includes(product.unit);
      const minQty = isWeight ? 0.1 : 1;
      const rounded = Math.round(newQuantity * 10) / 10;
      const final = Math.max(minQty, rounded);

      // Update local state immediately — no flicker
      setLocalQuantities((prev) => ({ ...prev, [productId]: final }));
      // Update context (debounced API sync happens inside CartContext)
      updateCartQuantity(productId, final);
    },
    [products, updateCartQuantity]
  );

  const handleRemove = useCallback(
    (itemId) => {
      setLocalQuantities((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
      updateCartQuantity(itemId, 0);
    },
    [updateCartQuantity]
  );

  const validCartItems = itemIds.filter((id) => products.find((p) => p._id === id));

  if (loading) return <Loading />;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="mt-10 flex flex-col md:flex-row gap-8 px-4 md:px-8 lg:px-16 mb-20 pt-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Your <span className="text-red-600">Cart</span>
            </h1>
            <p className="text-lg text-gray-600">
              {validCartItems.length}{" "}
              {validCartItems.length === 1 ? "Product" : "Products"}
            </p>
          </div>

          {validCartItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <TruckIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your Cart is Empty
                </h2>
                <Link
                  href="/#products"
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Browse Products
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
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
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {validCartItems.map((itemId) => {
                      const product = products.find((p) => p._id === itemId);
                      if (!product) return null;

                      const isWeight = ["kg", "liter"].includes(product.unit);
                      const minQty = isWeight ? 0.1 : 1;
                      const step = isWeight ? 0.1 : 1;
                      const price = product.offerPrice || product.price;
                      const qty = localQuantities[itemId] ?? cartItems[itemId];

                      return (
                        <tr
                          key={itemId}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-6 px-6">
                            <div className="flex items-center gap-4">
                              <Link href={`/product/${product._id}`} className="shrink-0">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg p-2">
                                  <Image
                                    src={getImageSource(product.image[0])}
                                    alt={product.name}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </Link>
                              <div>
                                <Link
                                  href={`/product/${product._id}`}
                                  className="font-medium text-gray-900 hover:text-red-600"
                                >
                                  {product.name}
                                </Link>
                                <button
                                  onClick={() => handleRemove(itemId)}
                                  className="block mt-1 text-sm text-red-600 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-6 text-center text-gray-700">
                            {currency}{price.toFixed(2)}
                          </td>
                          <td className="py-6 px-6 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() =>
                                  handleQuantityChange(itemId, qty - step)
                                }
                                disabled={qty <= minQty}
                                className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                value={qty}
                                min={minQty}
                                step={step}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    itemId,
                                    parseFloat(e.target.value) || minQty
                                  )
                                }
                                className="w-20 h-8 border border-gray-300 rounded-lg text-center"
                              />
                              <button
                                onClick={() =>
                                  handleQuantityChange(itemId, qty + step)
                                }
                                className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-6 px-6 text-center text-gray-700 uppercase">
                            {product.unit}
                          </td>
                          <td className="py-6 px-6 text-right text-gray-700 font-medium">
                            {currency}{(price * qty).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {validCartItems.map((itemId) => {
                  const product = products.find((p) => p._id === itemId);
                  if (!product) return null;

                  const isWeight = ["kg", "liter"].includes(product.unit);
                  const minQty = isWeight ? 0.1 : 1;
                  const step = isWeight ? 0.1 : 1;
                  const price = product.offerPrice || product.price;
                  const qty = localQuantities[itemId] ?? cartItems[itemId];

                  return (
                    <div
                      key={itemId}
                      className="bg-white p-4 rounded-lg border border-gray-100"
                    >
                      <div className="flex gap-4">
                        <Link href={`/product/${product._id}`} className="shrink-0">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg p-2">
                            <Image
                              src={getImageSource(product.image[0])}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </Link>
                        <div className="flex-1">
                          <Link
                            href={`/product/${product._id}`}
                            className="font-medium text-gray-900 hover:text-red-600"
                          >
                            {product.name}
                          </Link>
                          <div className="mt-1 text-sm text-gray-600">
                            {currency}{price.toFixed(2)} / {product.unit}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  handleQuantityChange(itemId, qty - step)
                                }
                                disabled={qty <= minQty}
                                className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                value={qty}
                                min={minQty}
                                step={step}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    itemId,
                                    parseFloat(e.target.value) || minQty
                                  )
                                }
                                className="w-16 h-8 border border-gray-300 rounded text-center"
                              />
                              <button
                                onClick={() =>
                                  handleQuantityChange(itemId, qty + step)
                                }
                                className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemove(itemId)}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/#products"
                className="inline-flex items-center mt-8 gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Continue Shopping
              </Link>
            </>
          )}
        </div>

        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
