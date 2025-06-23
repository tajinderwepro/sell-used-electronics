import React, { useEffect, useState } from "react";
import CommonTable from "../../../common/CommonTable";
import api from "../../../constants/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useFilters } from "../../../context/FilterContext";
import { useColorClasses } from "../../../theme/useColorClasses";
import { useAuth } from "../../../context/AuthContext";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user} = useAuth()
  const { filters } = useFilters();
  const COLOR_CLASSES = useColorClasses();
  const [totalItems, setTotalItems] = useState(0);
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.user.getUserPayments(user.id,filters);
      if (response.success) {
        setPayments(response.data);
        setTotalItems(response.total);
      } else {
        toast.error("Failed to fetch payments");
      }
    } catch (err) {
      console.error("Error fetching payments", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const columns = [
    { key: "id", label: "Payment ID", sortable: true },
    { key: "order_id", label: "Order ID", sortable: true },
    { key: "method", label: "Method", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (payment) => (
        <span className="capitalize">{payment.status}</span>
      ),
      sortable: true,
    },
    {
      key: "transaction_id",
      label: "Transaction ID",
      render: (payment) =>
        payment.transaction_id ? (
          <span className="text-gray-700">{payment.transaction_id}</span>
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
      sortable: true,
    },
    {
      key: "created_at",
      label: "Payment Date",
      render: (payment) =>
        new Date(payment.created_at).toLocaleDateString(),
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen mt-2">
      <CommonTable
        columns={columns}
        data={payments}
        loading={loading}
        totalItems={totalItems}
        pageSize={10}
        title={"Payments List"}
        isCreate={false}
        onFetch={fetchPayments}
        isDownloadCSV={true}
      />
    </div>
  );
};

export default Payments;
