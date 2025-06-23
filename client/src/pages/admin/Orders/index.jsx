import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import CommonTable from "../../../common/CommonTable";
import api from "../../../constants/api";
import { useFilters } from "../../../context/FilterContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import QuoteCard from "../../../components/common/DeviceCard";
import Heading from "../../../components/ui/Heading";
import { useColorClasses } from "../../../theme/useColorClasses";
import Button from "../../../components/ui/Button";
import axios from "axios";
import { formatDate } from "../../../components/common/formatDate";
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading,setLoading]= useState (false)
  const {filters} = useFilters();
  const navigate = useNavigate()
  const COLOR_CLASSES = useColorClasses();
  const fetchOrders = async ( ) => {
    try {
      setLoading(true);
      const response=await api.admin.getOrders(filters);
      console.log(response,'response')
      setOrders(response.data)
    
    } catch (err) {
      console.log(err,'err')
      // toast.error("Failed to delete lead.");
    } finally {
     
      setLoading(false);
    }
  };
    useEffect(() => {
      fetchOrders()
  }, []);
  

  const columns = [
    { key: "id", label: "ID",sortable: true },
    { key: "quote_id", label: "Quote Id",sortable: true },
    { key: "user_name", label: "User Name",sortable: true, render: (order) => order.quote.user ? order.quote.user.name : "" },
    { key: "status", label: "Status",sortable: true },
    { key: "tracking_number", label: "Tracking Number",sortable: true },
    // { key: "shipping_label_url", label: "Shipping Label Url",sortable: true },
    { key: "payment_status", label: "Payment Status",sortable: true },
    {
      key: "created_at",
      label: "Order Date",
      render: (order) => formatDate(order.created_at),
      sortable: true
    },
      {
      key: "actions",
      label: "Actions",
      render: (order) => (
        <div className="flex gap-2">
          <button onClick={() => navigate(`/admin/order/${order.id}`)}>
            <Eye size={18} color="gray" />
          </button>
        <button
          onClick={() => handleDelete(order.id)}
        >
            <Trash2 size={18} color="grey" />
        </button>
          
        </div>
      ),
    },
  ];

  const handleDelete = (id) => {
    setOrders((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="min-h-screen mt-2">
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`rounded-xl border p-4 space-y-4 ${COLOR_CLASSES.bgWhite}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={`text-base font-semibold ${COLOR_CLASSES.textPrimary}`}>
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.tracking_number && (
                      <a
                        href={`https://track.easypost.com/${order.tracking_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 underline"
                      >
                        Track
                      </a>
                    )}
                  </div>
                </div>
                <QuoteCard
                  device={{...order.quote,shipping_label_url:order.shipping_label_url}}
                  fullView={true}
                  onRequestShipment={(id) => console.log('Request shipment for ID:', id)}
                />
              </div>
            ))}
        </div> */}
      <CommonTable columns={columns}  data={orders} loading={loading}  pageSize={10} title={"Orders List"} isCreate={false} onFetch={fetchOrders}/>
    </div>
  );
}
