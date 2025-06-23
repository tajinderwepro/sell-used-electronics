import React, { useState } from 'react';
import {
  Smartphone,
  Tag,
  BadgeDollarSign,
  PackageCheck,
  Truck,
  CircleHelp,
  ChartBar,
  Calendar,
  LoaderCircle,
  ShieldAlert,
  CircleCheckBig,
  Banknote,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Button from '../../../components/ui/Button';
import { useColorClasses } from '../../../theme/useColorClasses';
import './style.css';
import { Chip } from '../../ui/Chip';
import { formatCurrency } from '../../ui/CurrencyFormatter';
import RiskScoreBadge from '../../../common/RiskScoreBadge';
import ConfirmationPopup from '../ConfirmationPopup';
import api from '../../../constants/api';
import { toast } from 'react-toastify';
import { formatDate } from '../formatDate';

const placeholderImage = 'http://localhost:8000/static/uploads/8383af11-e0dc-4930-a203-f7bf1788414a.jpg';

function DeviceCard({ device, onRequestShipment, fullView = false,order ,getDevice}) {
  const COLOR_CLASSES = useColorClasses();
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await api.admin.payments.pay(order.id); 

      const success = res?.detail?.success ?? res?.success ?? false;
      const message = res?.detail?.message ?? res?.message ?? "Payment processed.";

      if (success) {
        toast.success(message);
        getDevice();
        setShowPaymentPopup(false);
      } else {
        toast.error(message || "Payment failed.");
      }

    } catch (error) {
      console.error("Payment Error:", error);
      
      const errorMessage =
        error?.response?.data?.detail?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Payment failed due to an unexpected error.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const imageList =
    Array.isArray(device.media) && device.media.length > 0
      ? device.media.map((m) => m.path)
      : [device.image, device.model_image, device.category_name_image].filter(Boolean).length > 0
        ? [device.image, device.model_image, device.category_name_image].filter(Boolean)
        : [placeholderImage, placeholderImage, placeholderImage];

  const renderButton = () => {
    switch (device?.status) {
      case 'pending':
        return (
          <Button variant="primary" disabled className={`w-full py-2 rounded-full text-sm font-medium ${COLOR_CLASSES.gradientBtn}`}>
            <PackageCheck className="inline-block mr-2 w-5 h-5" />
            Waiting for approval
          </Button>
        );
      case 'approved':
        return (
          <Button
            variant="primary"
            onClick={() => onRequestShipment(device.id)}
            className={`w-full py-2 rounded-full text-sm font-medium ${COLOR_CLASSES.gradientBtn}`}
          >
            <PackageCheck className="inline-block mr-2 w-5 h-5" />
            Request Shipment
          </Button>
        );
      case 'delivered':
        return (
          <Button
            variant="primary"
            disabled={true}
            className={`w-full py-2 rounded-full text-sm font-medium ${COLOR_CLASSES.gradientBtn}`}
          >
            <PackageCheck className="inline-block mr-2 w-5 h-5" />
            Shipment Delivered
          </Button>
        );
      default:
        return (
          <a
            href={device.tracking_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center w-full py-2 rounded-md text-sm font-medium ${COLOR_CLASSES.gradientBtn}`}
          >
            <Truck className="inline-block mr-1 w-5 h-5" />
            Track
          </a>
        );
    }
  };
return (
  <div
    className={`${COLOR_CLASSES.bgGradient} backdrop-blur-md border ${COLOR_CLASSES.borderGray200} rounded-2xl overflow-hidden ${COLOR_CLASSES.shadowLg} flex flex-col ${fullView ? 'w-full max-w-6xl p-8 gap-6 md:flex-row' : 'w-full'}`}
  >
    {/* Swiper Image Carousel */}
    <Swiper
      modules={[Navigation, Pagination]}
      navigation={fullView}
      pagination={{ clickable: true }}
      className={`product-swiper ${fullView ? 'md:w-1/2 h-[28rem]' : 'h-60'} w-full rounded-2xl ${fullView ? 'swiper-nav-enabled' : ''}`}
    >
      {imageList.map((img, idx) => (
        <SwiperSlide key={idx}>
          <div className={`flex items-center justify-center w-full h-full overflow-hidden ${fullView ? 'p-6' : 'p-4'}`}>
            <img
              src={img}
              alt={`Device image ${idx + 1}`}
              className="max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
              onError={(e) => (e.target.src = placeholderImage)}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>

    {/* Device Details Section */}
    <div className={`${fullView ? 'md:w-1/2 px-6' : 'p-6'} flex flex-col justify-between flex-1 text-sm`}>
      <div className="flex justify-between items-start mb-4">
        <p className={`text-lg font-semibold ${COLOR_CLASSES.textPrimary}`}>{device.category_name}</p>
        <Chip status={device.status} />
      </div>

      <div className={`space-y-3 ${COLOR_CLASSES.primaryDark}`}>
        <div className="flex justify-between">
          <div className="flex-1 space-y-3 pl-6">
            <p className={`${COLOR_CLASSES.textSecondary} flex items-center gap-2`}>
              <Smartphone className="w-5 h-5" />
              <strong>Model:</strong> <span className={`capitalize ${COLOR_CLASSES.textPrimary}`}> {device.model_name}</span>
            </p>
            <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`} style={{marginTop:"17px"}}>
              <Tag className="w-5 h-5" />
              <strong>Condition:</strong> <Chip status={device.condition} />
            </p>
            <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`} style={{marginTop:"17px"}}>
              <BadgeDollarSign className="w-5 h-5" />
              <strong>Offered Price:</strong>  <span className={`capitalize ${COLOR_CLASSES.textPrimary}`}> {formatCurrency(device.offered_price)}</span>
            </p>
            
          </div>

          {fullView && (
           <div className={`flex-1 space-y-3 pl-6 ${device.ebay_avg_price ? "" : "mt-[-5px]"}`}>
              {device.ebay_avg_price && <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
                <BadgeDollarSign className="w-5 h-5" />
                <strong>eBay Avg Price:</strong> {formatCurrency(device.total_amount)}
              </p>
                }
              <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
                <ShieldAlert className="w-5 h-5"  />
                <strong>Risk Score:</strong> <RiskScoreBadge score={device.risk_score} />
              </p>
              {order?.payment?.[0]?.status && (
                <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
                  {/* <ChartBar className="w-5 h-5" /> */}
                  <CircleCheckBig className={`w-5 h-5 `} />
                  <strong>Status:</strong><p className=''> <Chip status={order.payment[0].status}>{order.payment[0].status}</Chip></p>
                </p>
              )}
              {/* <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
                <strong>Brand:</strong> {device.brand_name}
              </p>
              <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
                <strong>Model ID:</strong> {device.model_id}
              </p> */}
            </div>
          )}
        </div>

        {/* Shipping Label */}
        {fullView && (
          <div className="mt-4">
            <div className={`border rounded-lg p-4 bg-gray-50 ${COLOR_CLASSES.borderGray200} shadow-sm`}>
              <h4 className={`text-sm font-semibold mb-3 text-gray-900`}>Shipping Label</h4>
              <div className="flex flex-col items-center gap-3">
                <img
                  src={device.shipping_label_url}
                  alt="Shipping Label"
                  className="w-40 max-w-xs rounded-md border"
                />
                <div className="flex gap-3">
                  <a
                    href={device.shipping_label_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    View Full Size
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shipment or Track Button */}
      <div className='flex w-full gap-4'>
        <div className=" mt-4 w-full">{renderButton()}</div>
        {/* Payment Button */}
          {order?.status === "delivered" && order?.payment.length === 0 && (
            <div className="flex items-center gap-4 mt-4 w-full">
                <button
                  onClick={() => setShowPaymentPopup(true)}
                  className={`flex items-center gap-2 justify-center  ${COLOR_CLASSES.gradientBtn} px-4 py-2 rounded-md text-sm font-medium w-full`}
                >
                  <BadgeDollarSign className="w-4 h-4" />
                  Pay Now
                </button>

              
            </div>
          )}

          {order?.payment?.[0]?.status === "success" && (
             <div className="flex items-center gap-4 mt-4 w-full">
                  <button
                    disabled
                    className={`flex w-full justify-center items-center gap-2 ${COLOR_CLASSES.gradientBtn} px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed`}
                  >
                    <CircleCheckBig className="w-4 h-4" />

                    Paid
                  </button>
                  
              </div>
              )}
      </div>
      {/* Payment Info */}
      {order?.payment?.[0] && (
        <div className={`mt-4 border rounded-lg ${COLOR_CLASSES.bgWhite} shadow-sm p-4 ${COLOR_CLASSES.borderGray200}`}>
          <h4 className={`text-sm font-semibold mb-3 ${COLOR_CLASSES.textPrimary}`}>Payment Information</h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
              <BadgeDollarSign className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Method:</span>
             <span className={`capitalize ${COLOR_CLASSES.textPrimary}`}>{order.payment[0].method}</span>
            </div>
            <div className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
              <PackageCheck className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Transaction ID:</span>
              <span className={`${COLOR_CLASSES.textPrimary}`}>{order.payment[0].transaction_id}</span>
            </div>
            <div className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Paid On:</span>
              <span className={`${COLOR_CLASSES.textPrimary}`}>{formatDate(order.payment[0].created_at)}</span>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Payment Confirmation Modal */}
    <ConfirmationPopup
      open={showPaymentPopup}
      onClose={() => setShowPaymentPopup(false)}
      onSubmit={handlePay}
      title="Confirm Payment"
      btnCancel="Cancel"
      btnSubmit="Confirm"
      loading={loading}
      icon={<CircleHelp className={`w-20 h-20 ${COLOR_CLASSES.primary}`} />}
      description="Are you sure you want to proceed with the payment?"
    />
  </div>
);

}

export default DeviceCard;
