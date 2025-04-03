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
  Info
} from "react-feather";
import Image from "next/image";
import { getImageSource } from "@/utils/images";
import Invoice from "@/components/Invoice/Invoice";

const StatusIndicator = ({ status }) => {
  const statusConfig = {
    'Order Placed': {
      color: 'bg-blue-100 text-blue-800',
      icon: <Package size={16} />,
      label: 'Order Placed'
    },
    'Processing': {
      color: 'bg-purple-100 text-purple-800',
      icon: <Clock size={16} />,
      label: 'Processing'
    },
    'Shipped': {
      color: 'bg-amber-100 text-amber-800',
      icon: <Truck size={16} />,
      label: 'Shipped'
    },
    'Completed': {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle size={16} />,
      label: 'Completed'
    },
    'Cancelled': {
      color: 'bg-red-100 text-red-800',
      icon: <XCircle size={16} />,
      label: 'Cancelled'
    },
    'default': {
      color: 'bg-gray-100 text-gray-800',
      icon: <Info size={16} />,
      label: status || 'Unknown'
    }
  };

  const config = statusConfig[status] || statusConfig['default'];

  return (
    <div className={`inline-flex items-center rounded-full py-1 px-3 text-sm ${config.color}`}>
      {config.icon}
      <span className="ml-2">{config.label}</span>
    </div>
  );
};

const OrderList = ({
  orders = [],
  currency = '$',
  stats = [],
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onStatusChange,
  isSeller = false,
  headerTitle = "Order Management Dashboard",
  headerDescription = "Monitor and manage customer orders"
}) => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [invoiceOrderId, setInvoiceOrderId] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatOrderDate = (timestamp) => {
    if (!timestamp) return 'Date not available';
    
    // Use UTC to avoid timezone differences
    const date = new Date(timestamp);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
    return `${day} ${month} ${year} • ${hours}:${minutes}`;
  };

  const renderOrderItems = (items = []) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, index) => {
        const snapshot = item?.productSnapshot || {};
        return (
          <div
            key={item?._id || `item-${index}`}
            className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                {snapshot?.image?.[0] ? (
                  <Image
                    src={getImageSource(snapshot.image[0])}
                    alt={snapshot?.name || "Product image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">
                  {snapshot?.name || "Unnamed Product"}
                </h4>
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                  <p>
                    Quantity: {item?.quantity || 0} {snapshot?.unit || "unit"}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {currency}
                      {(snapshot?.offerPrice || snapshot?.price || 0).toFixed(2)}
                    </span>
                    {snapshot?.offerPrice && snapshot?.price && (
                      <span className="line-through text-gray-400">
                        {currency}
                        {snapshot.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8" suppressHydrationWarning>
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {headerTitle}
        </h1>
        <p className="mt-2 text-gray-600 max-w-3xl">
          {headerDescription}
        </p>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="text-gray-600 text-sm font-medium mb-1">
              {stat.title}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Date Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="text-gray-400" size={18} />
            <input
              type="date"
              className="form-input rounded-md border-gray-300 w-full"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
            />
          </div>
          <span className="text-gray-400 hidden sm:block">–</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="text-gray-400" size={18} />
            <input
              type="date"
              className="form-input rounded-md border-gray-300 w-full"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
            />
          </div>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => toggleOrderDetails(order._id)}
              >
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium truncate">
                      #{order._id?.toString().slice(-6).toUpperCase() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium truncate">
                      {order.address?.fullName || 'Guest Customer'}
                    </p>
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
                      {(order.amount || 0).toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-1 text-gray-500">
                      <span className="text-sm">
                        {order.items?.length || 0} item
                        {(order.items?.length || 0) !== 1 ? 's' : ''}
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
                <div className="border-t p-6 bg-gray-50 rounded-b-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                        <Package size={20} className="text-blue-500" /> Purchased Items
                      </h3>
                      {renderOrderItems(order.items)}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
                          <User size={20} className="text-purple-500" /> Customer Details
                        </h3>
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                          <div className="space-y-3 text-sm">
                            <p className="font-medium text-gray-900">
                              {order.address?.fullName || 'Customer name not available'}
                            </p>
                            {order.address?.address && (
                              <p className="flex items-start gap-2 text-gray-600">
                                <MapPin size={16} className="mt-0.5 text-gray-400 flex-shrink-0" />
                                <span>
                                  {[order.address.address, order.address.city, order.address.postalCode]
                                    .filter(Boolean)
                                    .join(', ')}
                                </span>
                              </p>
                            )}
                            {order.address?.phone && (
                              <p className="flex items-center gap-2 text-gray-600">
                                <Phone size={16} className="text-gray-400" />
                                {order.address.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
                          <Truck size={20} className="text-amber-500" /> Order Actions
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                          {isSeller && (
                            <div className="relative flex-1">
                              <select
                                value={order.status || 'Order Placed'}
                                onChange={(e) =>
                                  onStatusChange(order._id, e.target.value)
                                }
                                className="w-full px-4 py-2 pr-8 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                              <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={18} />
                            </div>
                          )}
                          <button
                            onClick={() => setInvoiceOrderId(order._id)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Printer size={16} />
                            Print Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">
              {startDate || endDate 
                ? "Try adjusting your date filters" 
                : "You don't have any orders yet"}
            </p>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

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
    </div>
  );
};

export default OrderList;