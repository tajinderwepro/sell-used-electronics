import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../constants/api";
import { Chip } from "../../../components/ui/Chip";
import LoadingIndicator from "../../../common/LoadingIndicator";
import { useColorClasses } from "../../../theme/useColorClasses";
import Button from "../../../components/ui/Button";
import { ChevronRight, CircleCheckBig, CircleHelp } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import CustomBreadcrumbs from "../../../common/CustomBreadCrumbs";

const ViewOrder = () => {
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState(null);
  const { orderId } = useParams();
  const COLOR_CLASSES = useColorClasses();
  const {user}=useAuth();
  console.log(device,"devicedevice")

  const breadcrumbItems = [
    { label: 'Devices', path: '/admin/orders' },
    { label: device?.model, path: `/admin/order/${orderId}` },
  ];
  const getDevice = async () => {
    try {
      setLoading(true);
      const res = await api.admin.orders.get(orderId);
    } catch (err) {
      console.error("Failed to fetch device:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDevice();
  }, []);


  if (loading || !device) return <LoadingIndicator isLoading={loading} />;

  return (
    <div className="max-w-8xl mx-auto ">
      <CustomBreadcrumbs
          items={breadcrumbItems}
          separator={<ChevronRight style={{ fontSize: "12px" }} />}
        />
    </div>
  );
};

export default ViewOrder;
