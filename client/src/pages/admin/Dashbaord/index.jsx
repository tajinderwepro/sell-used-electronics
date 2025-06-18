import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useFilters } from "../../../context/FilterContext";
import api from "../../../constants/api";
import CommonTable from "../../../common/CommonTable";
import { useColorClasses } from "../../../theme/useColorClasses";

const columns = [
  { key: "order_id", label: "Order Id" },
  { key: "status", label: "Status" },
  { key: "shipping_label_url", label: "Shipping Company Url" },
  { key: "tracking_number", label: "Tracking Number" },
  { key: "quote_id", label: "Quote Id" },
  {
    key: "created_at",
    label: "Order Date",
    render: (order) => new Date(order.created_at).toLocaleDateString(),
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { filters } = useFilters();
  const [users, setUsers] = useState([]);
  const [device, setDevice] = useState([]);
  const [brands, setBrand] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const COLOR_CLASSES = useColorClasses();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const usersRes = await api.admin.getAllUsers(filters);
      setUsers(usersRes.data);

      const devicesRes = await api.admin.quotes.getAllQuotes(filters);
      setDevice(devicesRes.data);

      const brandsRes = await api.admin.getAllBrand(user.id, 0, 0);
      setBrand(brandsRes.data);

      const orders = await api.admin.getLatestDevice(user.id);

      const latestOrder = orders.data
        ? [
            {
              ...orders.data,
              order_id: orders.data.id, // map to column key
            },
          ]
        : [];

      setRecentOrders(latestOrder);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  const chartData = [
    { name: "Devices", value: device?.length || 0 },
    { name: "Brands", value: brands?.length || 0 },
  ];

  return (
    <div className={`md:p-6 sm:px-0 min-h-screen ${COLOR_CLASSES.bgWhite}`}>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Total Users" count={users?.length} color="bg-blue-500" />
        <SummaryCard title="Total Quotes" count={device?.length} color="bg-green-500" />
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
      <div className="min-h-screen mt-2">
        <CommonTable
          columns={columns}
          data={recentOrders}
          searchable={false}
          isCreate={false}
          pageSize={10}
          title={"Recent Orders"}
        />
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
