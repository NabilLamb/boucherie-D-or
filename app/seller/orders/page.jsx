"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import OrderList from "@/components/OrderList/OrderList";
import Footer from "@/components/seller/Footer";
import toast from "react-hot-toast";
import axios from "axios";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    avgOrder: 0,
  });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/order/seller-orders", {
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

  useEffect(() => {
    const totalOrders = filteredOrders.length;
    const totalSpent = filteredOrders.reduce(
      (acc, order) => acc + order.amount,
      0
    );
    setStats({
      totalOrders,
      totalSpent,
      avgOrder: totalOrders ? totalSpent / totalOrders : 0,
    });
  }, [filteredOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `/api/order/update-status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (data.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        toast.success("Status updated successfully");
        
        // Update filtered orders as well
        setFilteredOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const statsList = [
    { title: "Total Orders", value: stats.totalOrders },
    { title: "Total Spent", value: `${currency}${stats.totalSpent.toFixed(2)}` },
    { title: "Avg. Order", value: `${currency}${stats.avgOrder.toFixed(2)}` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        <OrderList
          orders={filteredOrders}
          currency={currency}
          stats={statsList}
          loading={loading}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onStatusChange={handleStatusChange}
          isSeller={true}
          header={{
            title: "Order Management Dashboard",
            description: "Monitor and manage customer orders",
          }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Orders;