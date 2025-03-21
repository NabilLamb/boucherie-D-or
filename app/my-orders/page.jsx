"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import { Package } from "react-feather";
import Link from "next/link";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders – ensure your API returns the complete product details.
  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Function to render order status badge
  const getStatusBadge = (status) => {
    const statusStyles = {
      "Order Placed": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      processing: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
      shipped: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="mt-2 text-sm text-gray-500">
              Review your orders with detailed product information. All orders include free shipping.
            </p>
          </div>

          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <div className="text-center bg-white p-12 rounded-lg shadow-sm">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by placing a new order.
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  {/* Order Header */}
                  <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.toString().slice(-6).toUpperCase()}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="mt-4 md:mt-0 text-2xl font-semibold text-gray-900">
                      {currency}
                      {order.amount.toFixed(2)}
                    </p>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    {/* Order Items */}
                    <div className="md:border-r md:border-gray-200 pr-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">ITEMS</h4>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item._id} className="flex items-center space-x-4">
                            {/* Product Image */}
                            {item.product?.image?.length > 0 ? (
                              <img
                                src={item.product.image[0]}
                                alt={item.product.name}
                                className="h-12 w-12 rounded object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}

                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                              {item.product.offerPrice && Number(item.product.offerPrice) < Number(item.product.price) ? (
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm text-gray-500 line-through">
                                    {currency}{item.product.price.toFixed(2)}
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {currency}{item.product.offerPrice.toFixed(2)}
                                  </p>
                                  <p className="text-xs text-green-600">
                                    Save {(((item.product.price - item.product.offerPrice) / item.product.price) * 100).toFixed(0)}%
                                  </p>
                                </div>
                              ) : (
                                <p className="text-sm font-medium text-gray-900">
                                  {currency}{item.product.price.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="md:border-r md:border-gray-200 pr-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">SHIPPING ADDRESS</h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-900 font-medium">{order.address?.fullName}</p>
                        <p className="text-gray-500">{order.address?.area}</p>
                        <p className="text-gray-500">
                          {order.address?.city}, {order.address?.postalCode}
                        </p>
                        <p className="text-gray-500">{order.address?.address}</p>
                        <p className="text-gray-500">Phone: {order.address?.phone}</p>
                        {order.address?.additionalInfo && (
                          <p className="text-gray-500">
                            Note: {order.address?.additionalInfo}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment & General Order Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">PAYMENT</h4>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm text-gray-500">Method</dt>
                          <dd className="text-sm font-medium text-gray-900">COD</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Payment Status</dt>
                          <dd className="text-sm font-medium text-gray-900">Pending</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Shipping</dt>
                          <dd className="text-sm font-medium text-gray-900">FREE</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
