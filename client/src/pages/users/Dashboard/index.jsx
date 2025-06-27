import axios from "axios";
import { Chip } from "../../../components/ui/Chip";
import Heading from "../../../components/ui/Heading";
import { useAuth } from "../../../context/AuthContext";
import UserNavbar from "../../../layouts/GeneralLayout/UserNavbar";
import { FileText, Mail, PlusCircle, SearchCheck, ShoppingBag, Smartphone, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useFilters } from "../../../context/FilterContext";
import api from "../../../constants/api";
import { useColorClasses } from "../../../theme/useColorClasses";


const devices = [
  {
    id: 1,
    name: "iPhone 12",
    price: "35,000",
    condition: "Excellent",
    status: "Pending",
    image: "https://grattan.scene7.com/is/image/OttoUK/600w/Apple-iPhone-14-Pro-Max-1TB-Deep-Purple~33H992FRSP.jpg",
    date: "2025-06-18",
  },
  {
    id: 2,
    name: "Samsung Galaxy S21",
    price: "30,000",
    condition: "Good",
    status: "Approved",
    image: "data:image/jpeg;base64,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",
    date: "2025-06-17",
  },
];



export default function Dashboard() {
  const { user } = useAuth();
  const [device, setDevices] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [approvedQuotes, setApprovedQuotes] = useState([]);

  const { filters } = useFilters();

useEffect(() => {
      fetchData();
    },[user]);

  const fetchData = async () => {

    try {
      // const usersRes = await api.admin.getAllUsers(filters);
      // setUsers(usersRes.data);

      const quotePending = await api.user.getAllQuotes(filters);
      setQuotes(quotePending.data.filter(quote => quote.status === 'pending'));

      // const brandsRes = await api.admin.getAllBrand(user.id, 0, 0);
      // setBrand(brandsRes.data);
      
      const conditionRes = await api.user.getAllDevices(filters);
      setDevices(conditionRes.data);

      const quoteApproved = await api.user.getAllQuotes(filters);
      setApprovedQuotes(quoteApproved.data.filter(quote => quote.status === 'approved'));

      // const orders = await api.admin.getLatestDevice(user.id);
      // const latestOrder = orders.data

      //   ? [{ ...orders.data, order_id: orders.data.id }]
      //   : [];
      // setRecentOrders(latestOrder);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  const stats = [
  {
    title: "Totol Orders",
    value: device.length,
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    title: "Pending Quotes",
    value: approvedQuotes.length, 
    icon: FileText,
    color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
  },
  {
    title: "Pending Shipments",
    value: approvedQuotes.length, 
    icon: FileText,
    color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
  },
  {
    title: "Pending Payments",
    value: quotes.length,
    icon: ShoppingBag,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
  }
];

  const COLOR_CLASSES = useColorClasses()
  return (
    <div className={`p-6 ${COLOR_CLASSES.bgWhite} rounded-md min-h-screen space-y-6`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ title, value, icon: Icon, color }, idx) => (
          <div key={idx} className={`${COLOR_CLASSES.bgWhite} dark:bg-gray-800 shadow rounded-md p-4 flex items-center space-x-4`}>
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

      {/* Device List */}
      <div className={`${COLOR_CLASSES.bgWhite} dark:bg-gray-800 rounded-lg shadow overflow-hidden`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-lg font-semibold text-gray-800 dark:text-white">
          Recent Quotes
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <img
                src={device.image}
                alt={device.name}
                className="w-20 h-20 rounded object-contain mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">{device.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Condition: {device.condition}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Listed on: {device.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-700 dark:text-white">${device.price}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status: {device.status}</p>
              </div>
            </div>
          ))} */}
          <div className="p-4 h-[300px] flex items-center justify-center flex-col">
            <SearchCheck className="h-12 w-12 text-gray-400"/>
            <h2>No quotes found</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
