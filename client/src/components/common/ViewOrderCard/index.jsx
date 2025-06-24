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
import Notes from "../Notes";

const placeholderImage = 'http://localhost:8000/static/uploads/8383af11-e0dc-4930-a203-f7bf1788414a.jpg';

const ViewOrderCard = ({ selectedDevice = null }) => {
    const [order, setOrder] = useState(null);
    const [popupState, setPopupState] = useState({ open: false, type: null });
    const [loading, setLoading] = useState(false);
    const { orderId } = useParams();
    const { user } = useAuth();
    const COLOR_CLASSES = useColorClasses();

    const breadcrumbItems = [
        { label: 'Orders', path: user?.role === 'user' ? '/orders' : '/admin/orders' },
        { label: `Order #${orderId}`, path: user?.role === 'user' ? `/orders/${orderId} ` : `/admin/orders/${orderId}` },
    ];

    const getDevice = async () => {
        if (selectedDevice) {
            setOrder(selectedDevice);
        }
        else {
            setLoading(true);
            try {
                const res = await api.admin.orders.get(orderId);
                setOrder(res.data);
            } catch (err) {
                toast.error("Failed to fetch order");
            } finally {
                setLoading(false);
            }
        }
    };
    console.log(selectedDevice, order, "orderrrrrrrr")

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
        <div className="mt-4 mb-6 max-w-8xl mx-auto">
            <div className={`${COLOR_CLASSES.bgGradient} backdrop-blur-md border ${COLOR_CLASSES.borderGray200} rounded-2xl overflow-hidden shadow-lg flex flex-col w-full p-8 gap-6 md:flex-row`}>
                <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="product-swiper md:w-1/2 h-[28rem] w-full rounded-2xl">
                    {imageList.map((img, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="flex items-center justify-center h-full p-6">
                                <img
                                    src={img}
                                    alt={`Device image ${idx + 1}`}
                                    className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Device Detail Panel */}
                <div className="md:w-1/2 px-6 flex flex-col justify-between text-sm">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-lg font-semibold">{device.category_name}</p>
                        <Chip status={device.status} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <div className="flex-1 space-y-3 pl-6">
                                <p className="flex items-center gap-2"><Smartphone /> <strong>Model:</strong> {device.model_name}</p>
                                <p className="flex items-center gap-2"><Tag /> <strong>Condition:</strong> <Chip status={device.condition} /></p>
                                <p className="flex items-center gap-2"><BadgeDollarSign /> <strong>Offered Price:</strong> {formatCurrency(device.offered_price)}</p>
                                <p className="flex items-center gap-2"><BadgeDollarSign /> <strong>Total Price:</strong> {formatCurrency(device.total_amount)}</p>
                            </div>

                            <div className="flex-1 space-y-3 pl-6">
                                {device.ebay_avg_price && <p className="flex items-center gap-2"><BadgeDollarSign /> <strong>eBay Avg Price:</strong> {formatCurrency(device.ebay_avg_price)}</p>}
                                <p className="flex items-center gap-2"><ShieldAlert /> <strong>Risk Score:</strong> <RiskScoreBadge score={device.risk_score} /></p>
                                <p className="flex items-center gap-2"><CircleCheckBig /> <strong>Status:</strong> <Chip status={order?.payment?.[0]?.status ?? "Pending"} /></p>
                            </div>
                        </div>

                        {device.shipping_label_url && (
                            <div className="mt-4 border p-4 bg-gray-50 rounded-lg shadow-sm">
                                <h4 className="text-sm font-semibold mb-3">Shipping Label</h4>
                                <div className="flex flex-col items-center gap-3">
                                    <img src={device.shipping_label_url} alt="Shipping Label" className="w-40 rounded-md border" />
                                    <a href={device.shipping_label_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline hover:text-blue-800">
                                        View Full Size
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-4">
                            <div className="w-full">{renderButton()}</div>
                            {order?.status === "delivered" && !order?.payment?.length && user.role === "admin" && (
                                <Button className={`w-full ${COLOR_CLASSES.gradientBtn}`} icon={<BadgeDollarSign />} onClick={() => setPopupState({ open: true, type: "payment" })}>Pay Now</Button>
                            )}
                            {order?.payment?.[0]?.status === "success" && (
                                <Button disabled className={`w-full cursor-not-allowed ${COLOR_CLASSES.gradientBtn}`} icon={<CircleCheckBig />}>Paid</Button>
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
                </div>
            </div>
            {/* Popups */}
            <ConfirmationPopup
                open={popupState.open}
                onClose={() => setPopupState({ open: false, type: null })}
                onSubmit={handlePay}
                title={"Confirm Payment"}
                btnCancel="Cancel"
                btnSubmit={"Confirm"}
                loading={loading}
                icon={<CircleHelp className="w-20 h-20 text-blue-500" />}
                description={
                    "Are you sure you want to proceed with the payment?"
                }
            />

        </div>
    );
};

export default ViewOrderCard;
