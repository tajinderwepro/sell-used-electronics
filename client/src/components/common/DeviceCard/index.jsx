import React from 'react';
import {
  Smartphone,
  Tag,
  BadgeDollarSign,
  PackageCheck,
  Truck,
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

const placeholderImage = 'http://localhost:8000/static/uploads/8383af11-e0dc-4930-a203-f7bf1788414a.jpg';

function DeviceCard({ device, onRequestShipment, fullView = false }) {
  const COLOR_CLASSES = useColorClasses();

  const imageList =
    Array.isArray(device.media) && device.media.length > 0
      ? device.media.map((m) => m.path)
      : [device.image, device.model_image, device.category_name_image].filter(Boolean).length > 0
        ? [device.image, device.model_image, device.category_name_image].filter(Boolean)
        : [placeholderImage, placeholderImage, placeholderImage];

  const renderButton = () => {
    switch (device.status) {
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
      case 'shipped':
        return (
          <a
            href="https://track.easypost.com/djE6dHJrXzkxMzU4NjI3Mjk3MzRkOTZhZDJmOWVkMGYwNTY1YTI3"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center w-full py-2 rounded-md text-sm font-medium ${COLOR_CLASSES.gradientBtn}`}
          >
            <Truck className="inline-block mr-1 w-5 h-5" />
            Track
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`${COLOR_CLASSES.bgGradient} backdrop-blur-md border ${COLOR_CLASSES.borderGray200} rounded-2xl overflow-hidden ${COLOR_CLASSES.shadowLg} flex flex-col ${
        fullView ? 'w-full max-w-6xl p-8 gap-6 md:flex-row' : 'w-full'
      }`}
    >
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={fullView}
          pagination={{ clickable: true }}
          className={`product-swiper w-full ${fullView ? 'md:w-1/2 h-[28rem]' : 'h-60'} rounded-2xl ${fullView ? 'swiper-nav-enabled' : ''}`}
        >
        {imageList.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div
              className={`flex items-center justify-center w-full h-full overflow-hidden ${
                fullView ? 'p-6' : 'p-4'
              }`}
            >
              <img
                src={img}
                alt={`Device image ${idx + 1}`}
                className={`max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out hover:scale-105`}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={`${fullView ? 'md:w-1/2 px-6' : 'p-6'} flex flex-col justify-between flex-1 text-sm`}>
        <div className="flex justify-between items-start mb-4">
          <p className={`text-lg font-semibold ${COLOR_CLASSES.textPrimary}`}>{device.category_name}</p>
          <Chip status={device.status} />
        </div>

        <div className={`space-y-3 ${COLOR_CLASSES.primaryDark}`}>
          <div className="flex justify-between">
            <div className="space-y-3">
              <p className={`${COLOR_CLASSES.textSecondary} flex items-center gap-2`}>
                <Smartphone className="w-5 h-5" />
                <strong>Model:</strong> <span className={`${COLOR_CLASSES.textPrimary}`}>{device.brand_name} {device.model_name}</span>
              </p>
              <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
                <Tag className="w-5 h-5" />
                <strong>Condition:</strong> <Chip status={device.condition} />
              </p>
              <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
                <BadgeDollarSign className="w-5 h-5" />
                <strong>Offered Price:</strong> {formatCurrency(device.offered_price)}
              </p>
            </div>

            {fullView && (
              <div className="flex-1 space-y-3 pl-6">
                <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
                  <BadgeDollarSign className="w-5 h-5" />
                  <strong>eBay Avg Price:</strong> {formatCurrency(device.ebay_avg_price)}
                </p>
                <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
                  <strong>Risk Score:</strong> {<RiskScoreBadge score={device.risk_score} />}
                </p>
                <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
                  <strong>Brand:</strong> {device.brand_name}
                </p>
                <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
                  <strong>Model ID:</strong> {device.model_id}
                </p>
              </div>
            )}
          </div>

          {fullView && (
            <div className="mt-4">
              <div className={`border rounded-lg p-4 bg-gray-50 ${COLOR_CLASSES.borderGray200} shadow-sm`}>
                <h4 className={`text-sm font-semibold mb-3 ${COLOR_CLASSES.textPrimary}`}>
                  Shipping Label
                </h4>
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
                    {/* Uncomment if download is desired
                    <a
                      href={device.shipping_label_url}
                      download={`shipping-label-${device.id || 'order'}.png`}
                      className="text-sm text-green-600 underline hover:text-green-800"
                    >
                      Download
                    </a>
                    */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">{renderButton()}</div>
      </div>
    </div>
  );
}

export default DeviceCard;
