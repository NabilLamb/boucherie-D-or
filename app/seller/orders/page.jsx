
// app/seller/orders/page.jsx

"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import OrderList from "@/components/OrderList/OrderList";
import Footer from "@/components/seller/Footer";
import toast from "react-hot-toast";
import axios from "axios";
import Loading from "@/components/Loading";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, avgOrder: 0 });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/order/seller-orders", { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) { setOrders(data.orders); setFilteredOrders(data.orders); }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchSellerOrders(); }, [user]);

  useEffect(() => {
    let result = [...orders];
    if (startDate) { const s = new Date(startDate); s.setHours(0,0,0,0); result = result.filter((o) => o.date >= s.getTime()); }
    if (endDate) { const e = new Date(endDate); e.setHours(23,59,59,999); result = result.filter((o) => o.date <= e.getTime()); }
    setFilteredOrders(result);
  }, [startDate, endDate, orders]);

  useEffect(() => {
    const total = filteredOrders.reduce((acc, o) => acc + o.amount, 0);
    setStats({ totalOrders: filteredOrders.length, totalSpent: total, avgOrder: filteredOrders.length ? total / filteredOrders.length : 0 });
  }, [filteredOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(`/api/order/update-status/${orderId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        const update = (prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o);
        setOrders(update);
        setFilteredOrders(update);
        toast.success("Status updated");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const statsList = [
    { title: "Total Orders", value: stats.totalOrders },
    { title: "Total Revenue", value: `${currency}${stats.totalSpent.toFixed(2)}` },
    { title: "Avg. Order", value: `${currency}${stats.avgOrder.toFixed(2)}` },
  ];

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <OrderList
          orders={filteredOrders}
          currency={currency}
          stats={statsList}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onStatusChange={handleStatusChange}
          isSeller={true}
          header={{
            title: "Order Management",
            description: "Monitor and manage customer orders",
          }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Orders;