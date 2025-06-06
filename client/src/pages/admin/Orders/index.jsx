import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import CommonTable from "../../../common/CommonTable";
import api from "../../../constants/api";
export default function Orders() {
  const [users, setUsers] = useState([]);
  const [loading,setLoading]= useState (false)
  const fetchUsers = async ( ) => {
    try {
      setLoading(true);
      const response=await api.admin.getUsers();
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
    { key: "quote_id", label: "Quote Id" },
    { key: "status", label: "Status" },
    { key: "tracking_number", label: "Tracking Number" },
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
      <CommonTable columns={columns}  data={[]} loading={loading}  pageSize={10} title={"Orders List"}/>
    </div>
  );
}
