"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import { 
  Package, 
  ChevronDown, 
  Truck, 
  CreditCard, 
  MapPin, 
  Info,
  CheckCircle,
  RefreshCw,
  XCircle,
  Filter,
  Calendar,
  Printer,
  X
} from "react-feather";
import { getImageSource } from "@/utils/images";
import Image from "next/image";
import Invoice from "@/components/Invoice/Invoice";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
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
    user && fetchOrders();
  }, [user]);

  const calculateStatistics = (orders) => {
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
    const averageOrder = totalOrders > 0 ? totalAmount / totalOrders : 0;

    return {
      totalOrders,
      totalAmount,
      averageOrder,
    };
  };

  const filterOrders = () => {
    let result = [...orders];

    if (startDate) {
      const startTimestamp = new Date(startDate).getTime();
      result = result.filter((order) => order.date >= startTimestamp);
    }

    if (endDate) {
      const endTimestamp = new Date(endDate).getTime();
      result = result.filter((order) => order.date <= endTimestamp);
    }

    setFilteredOrders(result);
  };

  useEffect(() => {
    filterOrders();
  }, [startDate, endDate]);

  const { totalOrders, totalAmount, averageOrder } =
    calculateStatistics(filteredOrders);
  const stats = [
    { title: "Total Orders", value: totalOrders },
    { title: "Total Spent", value: `${currency}${totalAmount.toFixed(2)}` },
    { title: "Avg. Order", value: `${currency}${averageOrder.toFixed(2)}` },
  ];

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusDetails = (status) => {
    const statusMap = {
      "Order Placed": {
        color: "bg-blue-100 text-blue-800",
        icon: <Package size={16} />,
      },
      completed: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle size={16} />,
      },
      processing: {
        color: "bg-purple-100 text-purple-800",
        icon: <RefreshCw size={16} />,
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle size={16} />,
      },
      shipped: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Truck size={16} />,
      },
    };
    return (
      statusMap[status] || {
        color: "bg-gray-100 text-gray-800",
        icon: <Info size={16} />,
      }
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            <p className="mt-2 text-gray-500">
              Manage and review your purchases
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <dt className="text-sm font-medium text-gray-500">
                  {stat.title}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </div>

          {/* Filter Controls */}
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

          {loading ? (
            <Loading />
          ) : filteredOrders.length === 0 ? (
            <div className="text-center bg-white p-8 rounded-xl shadow-sm">
              <Filter className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200"
                >
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleOrder(order._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-500">
                            #{order._id.toString().slice(-6).toUpperCase()}
                          </span>
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium 
                            ${getStatusDetails(order.status).color}`}
                          >
                            {getStatusDetails(order.status).icon}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
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
                    <div className="border-t p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
                            <Package size={16} /> Purchased Items
                          </h3>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-start gap-4"
                              >
                                <div className="relative flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                  {item.productSnapshot.image?.length > 0 ? (
                                    <Image
                                      src={getImageSource(
                                        item.productSnapshot.image[0]
                                      )}
                                      alt={item.productSnapshot.name}
                                      fill
                                      className="object-contain p-2"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  {console.log(item.product)}
                                  <div className="mt-1 text-sm text-gray-500">
                                    <p>
                                      Quantity: {item.quantity}{" "}
                                      {item.productSnapshot.unit}
                                    </p>
                                    <p className="mt-1">
                                      {item.productSnapshot.offerPrice ? (
                                        <span className="flex items-center gap-2">
                                          <span className="text-gray-900 font-medium">
                                            {currency}
                                            {item.productSnapshot.offerPrice.toFixed(
                                              2
                                            )}
                                          </span>
                                          <span className="line-through text-gray-400">
                                            {currency}
                                            {item.productSnapshot.price.toFixed(
                                              2
                                            )}
                                          </span>
                                        </span>
                                      ) : (
                                        <span className="text-gray-900 font-medium">
                                          {currency}
                                          {item.productSnapshot.price.toFixed(
                                            2
                                          )}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                              <MapPin size={16} /> Shipping Details
                            </h3>
                            <div className="text-sm space-y-1">
                              <p className="font-medium">
                                {order.address?.fullName}
                              </p>
                              <p className="text-gray-600">
                                {order.address?.address}
                              </p>
                              <p className="text-gray-600">
                                {order.address?.city},{" "}
                                {order.address?.postalCode}
                              </p>
                              <p className="text-gray-600">
                                Phone: {order.address?.phone}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                              <CreditCard size={16} /> Payment Info
                            </h3>
                            <div className="text-sm space-y-1">
                              <p className="font-medium">COD</p>
                              <p className="text-gray-600">
                                Payment Status: Pending
                              </p>
                              <p className="text-gray-600">Shipping: FREE</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                              <Truck size={16} /> Shipping Actions
                            </h3>
                            <button
                              onClick={() => setSelectedOrderId(order._id)}
                              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                            >
                              <Printer size={18} />
                              Print Invoice
                            </button>
                          </div>

                          {/* Add this right before the closing </div> of the main container */}
                          {selectedOrderId && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative">
                                <button
                                  onClick={() => setSelectedOrderId(null)}
                                  className="absolute right-4 top-4 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors ring-1 ring-gray-200"
                                  aria-label="Close invoice"
                                >
                                  <X size={20} className="text-gray-600" />
                                </button>
                                <Invoice
                                  order={orders.find(
                                    (o) => o._id === selectedOrderId
                                  )}
                                />
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  )}
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
