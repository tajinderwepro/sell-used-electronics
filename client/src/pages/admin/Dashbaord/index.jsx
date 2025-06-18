import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useFilters } from "../../../context/FilterContext";
import api from "../../../constants/api";
import CommonTable from "../../../common/CommonTable";
import { useColorClasses } from "../../../theme/useColorClasses";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { Chip } from "../../../components/ui/Chip";

const PIE_COLORS = ["#22c55e", "#facc15", "#f97316", "#ef4444"]; // excellent, good, fair, bad
const LINE_COLORS = ["#6366f1", "#0ea5e9", "#14b8a6"];

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
  const [conditions, setConditions] = useState([]);
  const [order, setOrders] = useState([]);

  const COLOR_CLASSES = useColorClasses();

  useEffect(() => {
    fetchSummary();
  }, []);

  console.log(brands,'brands')

  const fetchSummary = async () => {
    try {
      const usersRes = await api.admin.getAllUsers(filters);
      setUsers(usersRes.data);

      const devicesRes = await api.admin.quotes.getAllQuotes(filters);
      setDevice(devicesRes.data);

      const brandsRes = await api.admin.getAllBrand(user.id, 0, 0);
      setBrand(brandsRes.data);
      
      const conditionRes = await api.admin.getAllDevices(filters);
      setConditions(conditionRes.data);

      const totalOrder = await api.admin.getOrders(filters);
      setOrders(totalOrder.data);

      const orders = await api.admin.getLatestDevice(user.id);
      const latestOrder = orders.data

        ? [{ ...orders.data, order_id: orders.data.id }]
        : [];
      setRecentOrders(latestOrder);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  // Prepare Pie Chart Data
  const pieData = Object.entries(
    conditions.reduce((acc, curr) => {
      const cond = curr.condition?.toLowerCase() || "unknown";
      acc[cond] = (acc[cond] || 0) + 1;
      return acc;
    }, {})
  ).map(([key, value]) => ({ name: key, value }));

  // Prepare Line Chart Data (example: brands grouped by creation month)
 const grouped = {};

order.forEach((or) => {
  const date = new Date(or.created_at);
  const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const status = or.status?.toLowerCase() || "unknown";

  if (!grouped[month]) {
    grouped[month] = { month, pending: 0, received: 0, paid: 0 };
  }

  if (grouped[month][status] !== undefined) {
    grouped[month][status] += 1;
  }
}); 



const orderData = Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
const statusColorMap = {
  excellent: "#22c55e",  // green-500
  good: "#eab308",       // yellow-500
  fair: "#f97316",       // orange-500
  bad: "#ef4444",        // red-500
};


  return (
    <div className={`md:p-6 sm:px-0 min-h-screen ${COLOR_CLASSES.bgWhite}`}>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Total Users" count={users?.length} color="bg-blue-500" />
        <SummaryCard title="Total Quotes" count={device?.length} color="bg-green-500" />
        <SummaryCard title="Total Brands" count={brands?.length} color="bg-purple-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Device Condition Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={statusColorMap[entry.name.toLowerCase()] || "#ccc"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Orders Status Data By Date</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
               <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pending"
                name="Pending"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="received"
                name="Received"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="paid"
                name="Paid"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />

            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

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
