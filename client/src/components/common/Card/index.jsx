import React, { useState } from 'react';
import {
  Smartphone, Tag, BadgeDollarSign, PackageCheck, Truck,
  CircleCheckBig
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
import { formatDate } from '../formatDate';

const placeholderImage = 'http://localhost:8000/static/uploads/8383af11-e0dc-4930-a203-f7bf1788414a.jpg';

function Card({ device, onRequestShipment, onClick, type = 'order' }) {
  const COLOR_CLASSES = useColorClasses();

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
  console.log(device,'fffff')
  return (
    <div
      onClick={() => onClick?.(device.id)}
      className={`${COLOR_CLASSES.bgGradient} backdrop-blur-md border ${COLOR_CLASSES.borderGray200} rounded-2xl overflow-hidden ${COLOR_CLASSES.shadowLg} flex flex-col w-full cursor-pointer`}
    >
      <div className="text-right"><span className={`${COLOR_CLASSES.gradientBtn} text-right p-2 rounded-bl-2xl text-xs`}>{formatDate( device?.created_at, false)}</span></div>
      
      {/* Swiper */}
      <Swiper
        modules={[Navigation, Pagination]}
        pagination={{ clickable: true }}
        className="product-swiper h-60 w-full rounded-2xl"
      >
        {imageList.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex items-center justify-center w-full h-full overflow-hidden p-4">
              <img
                src={img}
                alt={`Device image ${idx + 1}`}
                className="max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Device Details */}
      <div className="p-6 flex flex-col justify-between flex-1 text-sm">
        <div className="flex justify-between items-start mb-4">
          <p className={`text-lg font-semibold ${COLOR_CLASSES.textPrimary}`}>{device.category_name}</p>
          <Chip status={device.status} />
        </div>

        {/* Info Section */}
        <div className={`space-y-3 ${COLOR_CLASSES.primaryDark}`}>
          <div className="flex justify-between">
            <div className="flex-1 space-y-3 pl-6">
              <p className={`${COLOR_CLASSES.textSecondary} flex items-center gap-2`}>
                <Smartphone className="w-5 h-5" />
                <strong>Model:</strong> <span className={`capitalize ${COLOR_CLASSES.textPrimary}`}> {type=="order"?device?.quote.model_name:device.model_name}</span>
              </p>
              <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`} style={{ marginTop: "17px" }}>
                <Tag className="w-5 h-5" />
                <strong>Condition:</strong> <Chip status={type=="order"?device?.quote.condition:device.condition} />
              </p>
              {type == "order" && (
                <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`}>
                  <CircleCheckBig className="w-5 h-5" />
                  <strong>Payment Status:</strong>
                  <Chip
                    status={
                      device?.payment?.[0]?.status === undefined || device?.payment?.[0]?.status === null
                        ? "good"
                        : device.payment[0].status
                    }
                  >
                    {
                      device?.payment?.[0]?.status === undefined || device?.payment?.[0]?.status === null
                        ? "Pending"
                        : device.payment[0].status
                    }
                  </Chip>
                </p>
              )}
              <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`} style={{ marginTop: "17px" }}>
                <BadgeDollarSign className="w-5 h-5" />
                <strong>Offered Price:</strong>  <span className={`capitalize ${COLOR_CLASSES.textPrimary}`}> {formatCurrency(type=="order"?device?.quote.offered_price:device.offered_price)}</span>
              </p>
              <p className={`flex items-center gap-2 ${COLOR_CLASSES.textSecondary}`} style={{ marginTop: "17px" }}>
                <BadgeDollarSign className="w-5 h-5" />
                <strong>Total Price:</strong>  <span className={`capitalize ${COLOR_CLASSES.textPrimary}`}> {formatCurrency(type === "quote" ? device?.amount : device?.total_amount)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex w-full gap-4 mt-4'>
          <div className="w-full">{renderButton()}</div>
        </div>
      </div>
    </div>
  );
}

export default Card;