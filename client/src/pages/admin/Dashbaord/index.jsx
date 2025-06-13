import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useFilters } from "../../../context/FilterContext";
import api from "../../../constants/api";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer
// } from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const { filters } = useFilters();

  const [users, setUsers] = useState([]);
  const [device, setDevice] = useState([]);
  const [brands, setBrand] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchSummary();
    fetchOrders();
  }, []);

  const fetchSummary = async () => {
    try {
      const usersRes = await api.admin.getUsers(filters);
      setUsers(usersRes.data);

      const devicesRes = await api.admin.getDevices(filters);
      setDevice(devicesRes.data);

      const brandsRes = await api.admin.getBrand(user.id, 10, 0);
      setBrand(brandsRes.data);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const orders = await fetch("/api/v1/orders").then((res) => res.json());
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const chartData = [
    { name: "Devices", value: device?.length || 0 },
    { name: "Brands", value: brands?.length || 0 }
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Total Users" count={users?.length} color="bg-blue-500" />
        <SummaryCard title="Total Devices" count={device?.length} color="bg-green-500" />
        <SummaryCard title="Total Brands" count={brands?.length} color="bg-purple-500" />
      </div>

      {/* Graph Section
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 h-64">
          <h2 className="text-lg font-semibold mb-2">Devices and Brands (Graph)</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-4 h-64 flex items-center justify-center">
          <span className="text-gray-500">[ Device Condition Graph Placeholder ]</span>
        </div>
      </div> */}

      {/* Recent Orders */}
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
          {recentOrders.length > 0 ? (
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.user_id}</td>
                <td className="py-2 px-4">{order.device_id}</td>
                <td className="py-2 px-4">{order.status}</td>
                <td className="py-2 px-4">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="5">
                <p className="text-center py-6 text-gray-500 mt-2">No order found!</p>
              </td>
            </tr>
          </tbody>
        )}
        </table>
      </div>
    </div>
  );
}

// Summary card component
const SummaryCard = ({ title, count, color }) => (
  <div className={`p-4 rounded-lg shadow text-white ${color}`}>
    <h3 className="text-lg">{title}</h3>
    <p className="text-2xl font-bold">{count}</p>
  </div>
);
