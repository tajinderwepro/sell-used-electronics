import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import CommonTable from "../../../common/CommonTable";
import api from "../../../constants/api";
export default function Devices() {
  const [users, setUsers] = useState([]);
  const [loading,setLoading]= useState (false)
  const fetchUsers = async ( ) => {
    try {
      setLoading(true);
      const response=await api.admin.getDevices();
      console.log(response.users,'response')
      setUsers(response.users)
      // toast.success("Lead deleted successfully!");
    
    } catch (err) {
      console.log(err,'err')
      // toast.error("Failed to delete lead.");
    } finally {
     
      setLoading(false);
    }
  };
    useEffect(() => {
      fetchUsers()
  }, []);
  

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
      render: (user) => (
        <button
          onClick={() => handleDelete(user.id)}
        >
          <Trash2 size={18} color="grey" />
        </button>
      ),
    },
  ];

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="min-h-screen">
      <CommonTable columns={columns}  data={[]} loading={loading}  pageSize={10} title={"Devices List"}/>
    </div>
  );
}
