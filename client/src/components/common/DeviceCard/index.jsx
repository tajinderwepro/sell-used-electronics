import React, { useEffect, useRef } from 'react';
import {
  Smartphone,
  Tag,
  BadgeDollarSign,
  PackageCheck,
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
const placeholderImage = 'http://localhost:8000/static/uploads/8383af11-e0dc-4930-a203-f7bf1788414a.jpg';

function DeviceCard({ device, onRequestShipment }) {
const COLOR_CLASSES = useColorClasses();
const imageList =
  Array.isArray(device.media) && device.media.length > 0
    ? device.media.map((m) => m.path)
    : [device.image].filter(Boolean).length > 0
    ? [device.image, device.model_image, device.category_name_image].filter(Boolean)
    : [placeholderImage, placeholderImage, placeholderImage];
  return (
    <div
      className={`${COLOR_CLASSES.bgWhite} backdrop-blur-md border ${COLOR_CLASSES.borderGray200} rounded-2xl overflow-hidden cursor-pointer ${COLOR_CLASSES.shadowLg} flex flex-col`}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="product-swiper w-full h-60 rounded-t-2xl"
      >
        {imageList.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`Device image ${idx + 1}`}
              className="w-full h-60 scale-75 object-contain rounded-t-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="p-4 flex flex-col justify-between flex-1 text-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className={`${COLOR_CLASSES.textPrimary}`}>{device.category_name}</p>
          </div>
           <Chip status={device.status} />
        </div>

        <div className={`space-y-1.5 ${COLOR_CLASSES.primaryDark}`}>
          <p className={`${COLOR_CLASSES.textSecondary} flex items-center gap-1`}>
            <Smartphone className={`w-4 h-4`} />
            <strong>Model</strong> <span className={`${COLOR_CLASSES.textPrimary}`}>{device.brand_name} {device.model_name}</span>
          </p>
          <p className={`flex items-center gap-1 ${COLOR_CLASSES.textSecondary}`}>
            <Tag className="w-4 h-4 text-gray-400" />
            <strong>Condition</strong><Chip status={device.condition} />
          </p>
          <p className={`flex items-center gap-1 ${COLOR_CLASSES.textSecondary}`}>
            <BadgeDollarSign className="w-4 h-4 text-gray-400" />
            <strong>Offered Price</strong> {formatCurrency(device.offered_price)}
          </p>
          {/* <p className={`flex items-center gap-1 ${COLOR_CLASSES.textSecondary}`}>
            <BadgeDollarSign className="w-4 h-4 text-gray-400" />
            <strong>Calculated Price</strong> {formatCurrency (device.ebay_avg_price)}
          </p> */}
        </div>

        {device.status === 'approved' ? 
          <div className="mt-4">
            <Button
              onClick={() => onRequestShipment(device.id)}
              className={`w-full py-1.5 rounded-full text-xs font-medium ${COLOR_CLASSES.gradientBtn}`}
            >
              <PackageCheck className="inline-block mr-2 w-4 h-4" />
              Request Shipment
            </Button>
          </div>
          :
          <div className="mt-4">
            <Button
              // onClick={() => onRequestShipment(device.id)}
              disabled={true}
              className={`w-full py-1.5 rounded-full text-xs font-medium ${COLOR_CLASSES.gradientBtn}`}
            >
              <PackageCheck className="inline-block mr-2 w-4 h-4" />
              Waiting for approval
            </Button>
          </div>
        }
      </div>
    </div>
  );
}

export default DeviceCard;
