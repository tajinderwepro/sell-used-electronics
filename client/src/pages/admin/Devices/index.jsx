import { useEffect, useState } from "react";
import { Trash2, SquarePen, Eye } from "lucide-react";
import CommonTable from "../../../common/CommonTable";
import api from "../../../constants/api";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch devices from API
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getDevices();
      setDevices(response.data);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.admin.deleteDevice(id);
      setDevices((prev) => prev.filter((device) => device.id !== id));
    } catch (error) {
      console.error("Failed to delete device:", error);
    }
  };

  const handleView = (id) => {
    // Navigate or show modal with details
    console.log("View device", id);
  };

  const handleUpdate = (id) => {
    // Navigate or show update form
    console.log("Update device", id);
  };

  // Define columns for table including Actions
  const columns = [
    { key: "id", label: "ID" },
    { key: "category", label: "Category" },
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "condition", label: "Condition" },
    { key: "base_price", label: "Base Price" },
    { key: "ebay_avg_price", label: "Ebay Avg Price" },
    {
      key: "actions",
      label: "Actions",
      render: (device) => (
        <div className="flex gap-3">
          <button
            onClick={() => handleDelete(device.id)}
            className="p-2 rounded hover:bg-red-100"
            aria-label="Delete device"
            title="Delete"
          >
            <Trash2 size={18} color="red" />
          </button>
          <button
            onClick={() => handleView(device.id)}
            className="p-2 rounded hover:bg-blue-100"
            aria-label="View device"
            title="View"
          >
            <Eye size={18} color="blue" />
          </button>
          <button
            onClick={() => handleUpdate(device.id)}
            className="p-2 rounded hover:bg-green-100"
            aria-label="Update device"
            title="Update"
          >
            <SquarePen size={18} color="green" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-white rounded shadow">
      <CommonTable
        columns={columns}
        data={devices}
        loading={loading}
        pageSize={10}
        title="Devices List"
      />
    </div>
  );
}
