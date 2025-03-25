"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  Package,
  Truck,
  Printer,
  X,
  MapPin,
  Phone,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "react-feather";
import Image from "next/image";
import { getImageSource } from "@/utils/images";
import Invoice from "@/components/Invoice/Invoice";
import Loading from "@/components/Loading";

const OrderList = ({
  orders,
  currency,
  stats,
  loading,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onStatusChange,
  isSeller = false,
  header,
}) => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [invoiceOrderId, setInvoiceOrderId] = useState(null);

const StatusIndicator = ({ status }) => {
  const statusConfig = {
    'Order Placed': {
      color: 'bg-blue-100 text-blue-800',
      icon: <Package size={16} />,
      label: 'Order Placed'
    },
    Processing: {
      color: 'bg-purple-100 text-purple-800',
      icon: <Clock size={16} />,
      label: 'Processing'
    },
    Shipped: {
      color: 'bg-amber-100 text-amber-800',
      icon: <Truck size={16} />,
      label: 'Shipped'
    },
    Completed: {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle size={16} />,
      label: 'Completed'
    },
    Cancelled: {
      color: 'bg-red-100 text-red-800',
      icon: <XCircle size={16} />,
      label: 'Cancelled'
    }
  };

  const config = statusConfig[status] || {
    color: 'bg-gray-100 text-gray-800',
    icon: <Info size={16} />,
    label: status
  };

  return (
    <div className={`inline-flex items-center rounded-full py-1 px-3 text-sm ${config.color}`}>
      {config.icon}
      <span className="ml-2">{config.label}</span>
    </div>
  );
};

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

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
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package size={24} />
                  </div>
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
    <>
      {header && (
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{header.title}</h1>
          <p className="mt-2 text-gray-600">{header.description}</p>
        </header>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="text-gray-600 text-sm mb-1">{stat.title}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Date Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="text-gray-400" size={18} />
            <input
              type="date"
              className="form-input rounded-md border-gray-300"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <span className="text-gray-400 hidden sm:block">–</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="text-gray-400" size={18} />
            <input
              type="date"
              className="form-input rounded-md border-gray-300"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center p-12">
          <Loading />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
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
                    <p className="text-lg font-semibold text-gray-900">
                      {currency}
                      {order.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-gray-500">
                      <span className="text-sm">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedOrder === order._id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
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
                        <div className="flex gap-3">
                          {isSeller && (
                            <div className="relative w-full">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  onStatusChange(order._id, e.target.value)
                                }
                                className="w-full px-4 py-2 pr-8 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {[
                                  "Order Placed",
                                  "Processing",
                                  "Shipped",
                                  "Completed",
                                  "Cancelled",
                                ].map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-3 text-gray-400" size={18} />
                            </div>
                          )}
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
            <button
              onClick={() => setInvoiceOrderId(null)}
              className="absolute right-4 top-4 p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
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
    </>
  );
};

export default OrderList;