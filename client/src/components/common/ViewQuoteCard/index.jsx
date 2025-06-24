import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../constants/api";
import { Chip } from "../../../components/ui/Chip";
import LoadingIndicator from "../../../common/LoadingIndicator";
import { useColorClasses } from "../../../theme/useColorClasses";
import Button from "../../../components/ui/Button";
import { ChevronRight, CircleCheckBig, CircleHelp, StickyNote } from "lucide-react";
import ConfirmationPopup from "../../../components/common/ConfirmationPopup";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import CustomBreadcrumbs from "../../../common/CustomBreadCrumbs";
import InputField from "../../../components/ui/InputField";
import Notes from "../../../components/common/Notes";
import RiskScoreBadge from "../../../common/RiskScoreBadge";

const ViewQuoteCard = ({selectedDevice = null}) => {
    const [loading, setLoading] = useState(false);
    const [device, setDevice] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [noteSubmitting, setNoteSubmitting] = useState(false);

    const [popupState, setPopupState] = useState({ open: false, type: null });
    const { quoteId } = useParams();
    const { user } = useAuth();
    const COLOR_CLASSES = useColorClasses();

    const breadcrumbItems = [
        { label: "Quotes", path: "/admin/quotes" },
        { label: device?.brand_name || "Loading...", path: `/admin/quotes/${quoteId}` },
    ];

    const getDevice = async () => {

        if (selectedDevice) {
            setDevice(selectedDevice);
        }
        else{
            try {
                setLoading(true);
                const res = await api.admin.quotes.get(quoteId);
                setDevice(res.data);
                setSelectedImage(res.data.media?.[0]?.path || "");
            } catch (err) {
                toast.error("Failed to fetch device");
            } finally {
                setLoading(false);
            }

        }
        
    };

    useEffect(() => {
        getDevice();
    }, []);
    const handleApproved = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("user_id", user.id);
            formData.append("status", "approved");
            const res = await api.admin.quotes.updateStatus(device.id, formData);
            toast.success(res.message);
            await getDevice();
            setPopupState({ open: false, type: null });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClosePopup = () => {
        setPopupState({ open: false, type: null });
        setNewNote("");
    };

    if (loading || !device) return <LoadingIndicator isLoading={loading} />;

    return (
        <>
          <div className={`flex flex-col md:flex-row gap-100 ${COLOR_CLASSES.bgGradient} backdrop-blur-md border ${COLOR_CLASSES.borderGray200} p-6 rounded-2xl shadow-md`}>
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <div className="flex md:flex-row gap-2 overflow-x-auto md:overflow-y-auto max-h-[80px] md:max-h-[400px] pr-1">
                        {device.media.map((img) => (
                            <img
                                key={img.id}
                                src={img.path}
                                alt="Thumbnail"
                                onClick={() => setSelectedImage(img.path)}
                                className={`w-16 h-16 object-contain rounded-md cursor-pointer border ${selectedImage === img.path ? "border-blue-500" : "border-gray-200"
                                    }`}
                            />
                        ))}
                    </div>
                    <div className={`rounded-lg w-full h-[300px] md:h-[400px] flex justify-center items-center`}>
                        <img src={selectedImage} alt="Device" className=" max-w-[500px] object-contain" />
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-between">
                    <div>
                        <h2 className={`text-2xl font-semibold mb-3 ${COLOR_CLASSES.secondary}`}>
                            {device.model_name}
                        </h2>

                        <div className="flex gap-2 mb-4">
                            <Chip status={device.condition} />
                            <Chip status={device.status} />
                            {device.risk_score != null && (
                                <Chip status={device.risk_score < 30 ? 'low risk' : 'high risk'}>
                                    Risk Score: {device.risk_score}
                                </Chip>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm md:text-base mb-4">
                            <div>
                                <div className="text-gray-500">Base Price</div>
                                <div className="text-green-600 font-medium">${device.offered_price}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Final Amount</div>
                                <div className="text-blue-600 font-medium">${device.amount}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                                <div className="text-gray-500">Category</div>
                                {device.category_name}
                            </div>
                            <div>
                                <div className="text-gray-500">Brand</div>
                                {device.brand_name}
                            </div>
                            <div>
                                <div className="text-gray-500">Model</div>
                                {device.model_name}
                            </div>
                            <div>
                                <div className="text-gray-500">Specs</div>
                                {device.specifications || 'N/A'}
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                {/* <div className="text-gray-500">Submitted By</div>
                                {device.user?.name} ({device.user?.email}) */}
                                 <div className="text-gray-500">Risk :</div>
                                 
                                 <RiskScoreBadge score={device.risk_score} />


                            </div>
                            <div>
                                <div className="text-gray-500">Created At</div>
                                {new Date(device.created_at).toLocaleString()}
                            </div>
                        </div>

                        {user.role=="admin"&&<div className="mt-4 flex gap-2">
                            <Button
                                icon={<CircleCheckBig className="w-4 h-4" color={device.status === 'approved' ? 'green' : 'white'} />}
                                className="p-2 text-sm"
                                onClick={() => setPopupState({ open: true, type: 'approve' })}
                                disabled={device.status === 'approved'}
                            >
                                {device.status === 'approved' ? 'Approved' : 'Approve'}
                            </Button>
                        </div>}
                    </div>
                </div>

            </div>

            <ConfirmationPopup
                open={popupState.open}
                onClose={handleClosePopup}
                onSubmit={handleApproved}
                title={"Approve Device"}
                btnCancel="Cancel"
                btnSubmit={"Approve"}
                loading={loading}
                icon={
                    <CircleHelp className={`w-20 h-20 ${COLOR_CLASSES.primary}`} />
                }
                description={
                    "Are you sure you want to approve this device?"
                }
            />

        </>
    );
};

export default ViewQuoteCard;
