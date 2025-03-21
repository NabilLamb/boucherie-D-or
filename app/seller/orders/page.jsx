"use client";
import React, { useEffect, useState } from "react";
import { BoxIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Pagination from "@/components/seller/Pagination";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // orders per page
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/order/seller-orders", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit,
          startDate,
          endDate,
        },
      });

      if (data.success) {
        setOrders(data.orders);
        setTotalPages(Math.ceil(data.totalOrders / limit));
        // Reset to page 1 if current page exceeds total pages
        if (currentPage > Math.ceil(data.totalOrders / limit)) {
          setCurrentPage(1);
        }
      } else {
        toast.error(data.message);
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

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const totalOrders = orders.length;
  const totalAmount = orders
    .reduce((sum, order) => sum + order.amount, 0)
    .toFixed(2);

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

  const DateFilter = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">From:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded-md p-2"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">To:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded-md p-2"
        />
      </div>
      <button
        onClick={() => {
          setStartDate("");
          setEndDate("");
        }}
        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        Clear Dates
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-gray-100">
      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <Loading />
        </div>
      ) : (
        <div className="flex-1 p-6 md:p-10 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Order Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Orders
              </h3>
              <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Amount
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {currency}
                {totalAmount}
              </p>
            </div>
          </div>

          <DateFilter />

          <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-gray-200">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <React.Fragment key={index}>
                    <tr
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                        #{order._id.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-4 whitespace-normal text-sm text-gray-800">
                        <div className="flex items-center flex-wrap">
                          <BoxIcon className="w-8 h-8 text-yellow-500 mr-2" />
                          {order.items.map((item) => (
                            <p key={item._id} className="mr-2 mb-1">
                              {item.product.name} x {item.quantity}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-normal text-sm text-gray-800">
                        <p className="font-semibold">
                          {order.address.fullName}
                        </p>
                        <p>{`${order.address.city}, ${order.address.postalCode}`}</p>
                        <p>{order.address.phone}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                        {currency}
                        {order.amount}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                        {formatOrderDate(order.date)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 flex items-center">
                        <p>Details</p>
                        {expandedOrder === order._id ? (
                          <ChevronUpIcon className="w-4 h-4 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4 ml-2" />
                        )}
                      </td>
                    </tr>
                    {expandedOrder === order._id && (
                      <tr>
                        <td colSpan="6" className="p-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {order.items.map((item) => (
                              <div
                                key={item._id}
                                className="border rounded-lg shadow-md p-4 bg-white"
                              >
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                  {item.product.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Price: {currency}
                                  {item.product.price}
                                </p>
                                {item.product.offerPrice && (
                                  <p className="text-sm text-green-600">
                                    Offer: {currency}
                                    {item.product.offerPrice}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
