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
import QuoteCard from "../../../components/common/DeviceCard";
const ViewOrder = () => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const COLOR_CLASSES = useColorClasses();
  const {user}=useAuth();
  console.log(order,"devicedevice")
  const breadcrumbItems = [
    { label: 'Orders', path: '/admin/orders' },
    { label: "Order #"+orderId, path: `/admin/orders/${orderId}` },
  ];

  const getDevice = async () => {
    try {
      setLoading(true);
      const res = await api.admin.orders.get(orderId);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDevice();
  }, []);

  


  if (loading || !order) return <LoadingIndicator isLoading={loading} />;

  return (
    <div className="max-w-8xl mx-auto ">
      <CustomBreadcrumbs
          items={breadcrumbItems}
          separator={<ChevronRight style={{ fontSize: "12px" }} />}
        />
        <div
          key={order.id}
          // className={`rounded-xl border p-4 space-y-4 ${COLOR_CLASSES.bgWhite}`}
        >
          {/* <div className="flex justify-between items-center">
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
          </div> */}
          <QuoteCard
            device={{...order.quote,shipping_label_url:order.shipping_label_url,tracking_url:order.tracking_url, total_amount: order.total_amount}}
            fullView={true}
            onRequestShipment={(id) => console.log('Request shipment for ID:', id)}
            order={order}
            getDevice={getDevice}

          />
        </div>
    </div>
  );
};

export default ViewOrder;
