import Heading from "../../../components/ui/Heading";
import { useAuth } from "../../../context/AuthContext";
import UserNavbar from "../../../layouts/GeneralLayout/UserNavbar";
import { Mail, PlusCircle, Smartphone, Star, Users } from "lucide-react";

const stats = [
  { title: "Devices Listed", value: 12, icon: Smartphone, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" },
  { title: "Devices Sold", value: 5, icon: Star, color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" },
  { title: "Pending Approval", value: 3, icon: Users, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300" },
  { title: "Offers Received", value: 8, icon: Mail, color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300" },
];

const devices = [
  {
    id: 1,
    name: "iPhone 12",
    price: "₹35,000",
    condition: "Excellent",
    status: "Pending",
    image: "https://via.placeholder.com/80",
    date: "2025-06-18",
  },
  {
    id: 2,
    name: "Samsung Galaxy S21",
    price: "₹30,000",
    condition: "Good",
    status: "Approved",
    image: "https://via.placeholder.com/80",
    date: "2025-06-17",
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Welcome Back {user?.name}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ title, value, icon: Icon, color }, idx) => (
          <div key={idx} className={`bg-white dark:bg-gray-800 shadow rounded p-4 flex items-center space-x-4`}>
            <div className={`rounded-full p-3 ${color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Device Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
          <PlusCircle size={18} /> Add New Device
        </button>
      </div>

      {/* Device List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-lg font-semibold text-gray-800 dark:text-white">
          My Devices
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <img
                src={device.image}
                alt={device.name}
                className="w-20 h-20 rounded object-cover mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">{device.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Condition: {device.condition}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Listed on: {device.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-700 dark:text-white">{device.price}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status: {device.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
