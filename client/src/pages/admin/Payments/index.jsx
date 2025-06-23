import { useEffect, useState } from "react";
import { Trash2, SquarePen, CircleHelp, CircleCheckBig, Eye } from "lucide-react";
import CommonTable from "../../../common/CommonTable";
import Popup from "../../../common/Popup";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";
import api from "../../../constants/api";
import { useColorClasses } from "../../../theme/useColorClasses";
import { useFilters } from "../../../context/FilterContext";
import { useAuth } from "../../../context/AuthContext";
import { formatDate } from "../../../components/common/formatDate";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const COLOR_CLASSES = useColorClasses();
  const {user}=useAuth();
  const [errors, setErrors] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const {filters} = useFilters();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.admin.payments.getList(filters);
      setTotalItems(response.total);
      setPayments(response.data);
    } catch (err) {
      console.error("Failed to fetch quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "ID", sortable: true },
    {
      key: "user_name",
      label: "User",
      sortable: true,
      render: (row) =>  row.user?.name.charAt(0).toUpperCase() + row.user?.name.slice(1) || ""
    },
    { key: "order_id", label: "Order Id", sortable: true },
    { key: "method", label: "Method", sortable: true },
    { key: "transaction_id", label: "Transaction Id", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "created_at", label: "Payment Time", sortable: true, render: (row) => formatDate(row.created_at) },
  ];

  useEffect(() => {
    fetchPayments()
  }, []);

  return (
    <div className="min-h-screen mt-2">
      <CommonTable
        isDownloadCSV={true}
        columns={columns}
        data={payments}
        loading={loading}
        pageSize={10}
        title="Payments List"
        totalItems={totalItems}
        onFetch={fetchPayments} 
        isCreate={false}
      />
    </div>
  );
}
