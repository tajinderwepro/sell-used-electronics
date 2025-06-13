import { useAuth } from "../../../context/AuthContext";

import React, { useEffect, useState } from "react";
export default function Dashboard() {

  const {user} = useAuth();
    const [summary, setSummary] = useState({
    totalUsers: 0,
    totalDevices: 0,
    totalOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchSummary();
    fetchOrders();
  }, []);

  const fetchSummary = async () => {
    // Replace with real API calls
    const users = await fetch("/api/v1/users/list").then((res) => res.json());
    const devices = await fetch("/api/v1/devices/list").then((res) => res.json());
    const orders = await fetch("/api/v1/orders/list").then((res) => res.json());
console.log(users,"usersdata")
    setSummary({
      totalUsers: users.length,
      totalDevices: devices.length,
      totalOrders: orders.length,
    });
  };

  const fetchOrders = async () => {
    const orders = await fetch("/api/v1/orders").then((res) => res.json());
    setRecentOrders(orders.slice(0, 5));
  };
  console.log(user);
  return (
    // <div className="min-h-screen">
    //   <h1 className="text-3xl font-bold mb-4">Welcome {user?.name}</h1>

    // </div>
        <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Total Users" count={summary.totalUsers} color="bg-blue-500" />
        <SummaryCard title="Total Devices" count={summary.totalDevices} color="bg-green-500" />
        <SummaryCard title="Total Orders" count={summary.totalOrders} color="bg-purple-500" />
        <SummaryCard title="Total Brands" count={summary.totalOrders} color="bg-pink-500" />
        <SummaryCard title="Total Models" count={summary.totalOrders} color="bg-yellow-500" />
      </div>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 h-64 flex items-center justify-center">
          <span className="text-gray-500">[ Sales Chart Placeholder ]</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 h-64 flex items-center justify-center">
          <span className="text-gray-500">[ Device Condition Chart Placeholder ]</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">User</th>
              <th className="py-2 px-4">Device</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.user_id}</td>
                <td className="py-2 px-4">{order.device_id}</td>
                <td className="py-2 px-4">{order.status}</td>
                <td className="py-2 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, count, color }) => (
  <div className={`p-4 rounded-lg shadow text-white ${color}`}>
    <h3 className="text-lg">{title}</h3>
    <p className="text-2xl font-bold">{count}</p>
  </div>
  );




