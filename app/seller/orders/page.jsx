"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ChevronDown,
  Box,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Package,
  User,
  MapPin,
  Phone,
  Printer,
  X,
} from "react-feather"; // Added X icon
import Pagination from "@/components/seller/Pagination";
import Image from "next/image";
import { getImageSource } from "@/utils/images";
import Invoice from "@/components/Invoice/Invoice";

// Badge Component
const Badge = ({ children, className = "" }) => (
  <div
    className={`inline-flex items-center rounded-full py-1 px-3 text-sm ${className}`}
  >
    {children}
  </div>
);

const Orders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [invoiceOrderId, setInvoiceOrderId] = useState(null);

  // Fetch orders
  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/order/seller-orders", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage, limit, startDate, endDate },
      });

      if (data.success) {
        setOrders(data.orders);
        setTotalPages(Math.ceil(data.totalOrders / limit));
        if (currentPage > Math.ceil(data.totalOrders / limit)) {
          setCurrentPage(1);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user, currentPage, limit, startDate, endDate]);

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Format order date
  const formatOrderDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} • ${date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  };

  // Status Indicator Component
  const StatusIndicator = ({ status }) => {
    const statusConfig = {
      "Order Placed": {
        color: "bg-blue-100 text-blue-800",
        icon: <Package size={16} />,
      },
      Processing: {
        color: "bg-purple-100 text-purple-800",
        icon: <Clock size={16} />,
      },
      Shipped: {
        color: "bg-amber-100 text-amber-800",
        icon: <Truck size={16} />,
      },
      Completed: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle size={16} />,
      },
      Cancelled: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle size={16} />,
      },
    };

    return (
      <Badge className={statusConfig[status]?.color}>
        {statusConfig[status]?.icon}
        <span className="ml-2">{status}</span>
      </Badge>
    );
  };

  // Render order items using productSnapshot
  const renderOrderItems = (items) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, index) => {
        const snapshot = item?.productSnapshot || {};
        return (
          <div
            key={item?._id || `item-${index}`}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                {snapshot?.image?.[0] ? (
                  <Image
                    src={getImageSource(snapshot.image[0])}
                    alt={snapshot?.name || "Product image"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Box className="w-full h-full text-gray-400 p-3" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">
                  {snapshot?.name || "Unnamed Product"}
                </h4>
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                  <p>
                    Quantity: {item?.quantity || 0} {snapshot?.unit || "unit"}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {currency}
                      {snapshot?.offerPrice || snapshot?.price || "0.00"}
                    </span>
                    {snapshot?.offerPrice && (
                      <span className="line-through text-gray-400">
                        {currency}
                        {snapshot?.price || "0.00"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 capitalize">
                    Category: {snapshot?.category || "Uncategorized"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Order Management Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor and manage customer orders
          </p>
        </header>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loading />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleOrderDetails(order._id)}
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium">
                        #{order._id.toString().slice(-6).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium">{order.address.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {formatOrderDate(order.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <StatusIndicator status={order.status} />
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {currency}
                        {order.amount}
                      </p>
                    </div>
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="border-t p-6 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Package size={20} /> Purchased Items
                        </h3>
                        {renderOrderItems(order.items)}
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <User size={20} /> Customer Details
                          </h3>
                          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="space-y-2 text-sm">
                              <p className="font-medium">
                                {order.address.fullName}
                              </p>
                              <p className="flex items-center gap-2 text-gray-600">
                                <MapPin size={16} />
                                {order.address.address}, {order.address.city}{" "}
                                {order.address.postalCode}
                              </p>
                              <p className="flex items-center gap-2 text-gray-600">
                                <Phone size={16} />
                                {order.address.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Truck size={20} /> Shipping Actions
                          </h3>
                          <button
                            onClick={() => setInvoiceOrderId(order._id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                          >
                            <Printer size={18} />
                            Print Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Invoice Modal */}
        {invoiceOrderId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative">
              {/* Close Button with visible background */}
              <button
                onClick={() => setInvoiceOrderId(null)}
                className="absolute right-4 top-4 p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                aria-label="Close invoice"
              >
                <X size={20} className="text-white" />
              </button>

              <Invoice
                order={orders.find((o) => o._id === invoiceOrderId)}
                key={invoiceOrderId}
              />
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
