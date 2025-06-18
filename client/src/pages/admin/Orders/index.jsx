import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import CommonTable from "../../../common/CommonTable";
import api from "../../../constants/api";
import { useFilters } from "../../../context/FilterContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function Orders() {
  const [users, setUsers] = useState([]);
  const [loading,setLoading]= useState (false)
  const {filters} = useFilters();
  const navigate = useNavigate()
  const fetchOrders = async ( ) => {
    try {
      setLoading(true);
      const response=await api.admin.getOrders(filters);
      console.log(response,'response')
      setUsers(response.data)
    
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
    { key: "status", label: "Status",sortable: true },
    { key: "tracking_number", label: "Tracking Number",sortable: true },
    { key: "shipping_label_url", label: "Shipping Label Url",sortable: true },
    {
      key: "created_at",
      label: "Order Date",
      render: (order) => new Date(order.created_at).toLocaleDateString(),
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
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="min-h-screen mt-2">
      <CommonTable columns={columns}  data={users} loading={loading}  pageSize={10} title={"Orders List"} isCreate={false} onFetch={fetchOrders}/>
    </div>
  );
}
