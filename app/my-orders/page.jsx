"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import OrderList from "@/components/OrderList/OrderList";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSellerOrders();
  }, [user]);

  useEffect(() => {
    const filterOrders = () => {
      let result = [...orders];
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        result = result.filter((order) => order.date >= start.getTime());
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        result = result.filter((order) => order.date <= end.getTime());
      }
      setFilteredOrders(result);
    };
    filterOrders();
  }, [startDate, endDate, orders]);

  const calculateStatistics = () => {
    const totalOrders = filteredOrders.length;
    const totalSpent = filteredOrders.reduce(
      (acc, order) => acc + order.amount,
      0
    );
    const avgOrder = totalOrders ? totalSpent / totalOrders : 0;

    return [
      { title: "Total Orders", value: totalOrders },
      { title: "Total Spent", value: `${currency}${totalSpent.toFixed(2)}` },
      { title: "Avg. Order", value: `${currency}${avgOrder.toFixed(2)}` },
    ];
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `/api/order/update-status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success("Status updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 m-5 min-h-screen bg-gray-50">
        <OrderList
          orders={filteredOrders}
          currency={currency}
          stats={calculateStatistics()}
          loading={loading}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onStatusChange={handleStatusChange}
          isSeller={false}
          headerTitle="Order Management Dashboard"
          headerDescription="Monitor and manage customer orders"
        />
      </div>
      <Footer />
    </>
  );
};

export default Orders;
