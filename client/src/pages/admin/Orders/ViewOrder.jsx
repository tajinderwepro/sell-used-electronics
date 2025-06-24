import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../constants/api";
import { Chip } from "../../../components/ui/Chip";
import LoadingIndicator from "../../../common/LoadingIndicator";
import { useColorClasses } from "../../../theme/useColorClasses";
import Button from "../../../components/ui/Button";
import {
  ChevronRight, CircleCheckBig, CircleHelp, StickyNote, Smartphone, Tag,
  BadgeDollarSign, PackageCheck, Truck, ShieldAlert, Calendar
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import CustomBreadcrumbs from "../../../common/CustomBreadCrumbs";
import ConfirmationPopup from "../../../components/common/ConfirmationPopup";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import RiskScoreBadge from '../../../common/RiskScoreBadge';
import { toast } from 'react-toastify';
import { formatDate } from "../../../components/common/formatDate";
import { formatCurrency } from "../../../components/ui/CurrencyFormatter";
import InputField from "../../../components/ui/InputField";
import ViewOrderCard from "../../../components/common/ViewOrderCard";
import Notes from "../../../components/common/Notes";

const placeholderImage = 'http://localhost:8000/static/uploads/8383af11-e0dc-4930-a203-f7bf1788414a.jpg';

const ViewOrder = () => {
  const [order, setOrder] = useState(null);
  const [popupState, setPopupState] = useState({ open: false, type: null });
  const [loading, setLoading] = useState(false);

  const { orderId } = useParams();
  const { user } = useAuth();
  const COLOR_CLASSES = useColorClasses();

  const breadcrumbItems = [
    { label: 'Orders', path: '/admin/orders' },
    { label: `Order #${orderId}`, path: `/admin/orders/${orderId}` },
  ];

  const getDevice = async () => {
    setLoading(true);
    try {
      const res = await api.admin.orders.get(orderId);
      setOrder(res.data);
    } catch (err) {
      toast.error("Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getDevice();
  }, []);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await api.admin.payments.pay(order.id);
      const success = res?.detail?.success ?? res?.success;
      const message = res?.detail?.message ?? res?.message ?? "Payment processed.";

      toast[success ? "success" : "error"](message);
      if (success) {
        getDevice();
        setPopupState({ open: false, type: "payment" })
      }
    } catch (error) {
      const msg =
        error?.response?.data?.detail?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Payment failed due to an unexpected error.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };



  if (loading || !order) return <LoadingIndicator isLoading={loading} />;

  const device = {
    ...order.quote,
    shipping_label_url: order.shipping_label_url,
    tracking_url: order.tracking_url,
    total_amount: order.total_amount,
  };

  const imageList = Array.isArray(device.media) && device.media.length
    ? device.media.map((m) => m.path)
    : [device.image, device.model_image, device.category_name_image].filter(Boolean) || [placeholderImage];

  const renderButton = () => {
    const commonProps = {
      className: `w-full py-2 rounded-full text-sm font-medium ${COLOR_CLASSES.gradientBtn}`,
    };
    switch (device?.status) {
      case 'pending':
        return <Button {...commonProps} disabled icon={<PackageCheck />} >Waiting for approval</Button>;
      case 'approved':
        return <Button {...commonProps} icon={<PackageCheck />} >Request Shipment</Button>;
      case 'delivered':
        return <Button {...commonProps} disabled icon={<PackageCheck />} >Shipment Delivered</Button>;
      default:
        return (
          <a
            href={device.tracking_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center ${commonProps.className}`}
          >
            <Truck className="mr-1 w-5 h-5" /> Track
          </a>
        );
    }
  };

  return (
    <div className="max-w-8xl mx-auto">
      <CustomBreadcrumbs items={breadcrumbItems} separator={<ChevronRight size={12} />} />
      <ViewOrderCard />
      {/* Notes Section */}
      <Notes data={order} type="order"/>

      {/* Payment Modal */}
      <ConfirmationPopup
        open={popupState.open && popupState.type === "payment"}
        onClose={() => setPopupState({ open: false, type: null })}
        onSubmit={handlePay}
        title="Confirm Payment"
        btnCancel="Cancel"
        btnSubmit="Confirm"
        loading={loading}
        icon={<CircleHelp className="w-20 h-20 text-blue-500" />}
        description="Are you sure you want to proceed with the payment?"
      />


    </div>
  );
};

export default ViewOrder;
