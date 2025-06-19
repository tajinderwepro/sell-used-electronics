import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../constants/api";
import { Chip } from "../../../components/ui/Chip";
import LoadingIndicator from "../../../common/LoadingIndicator";
import { useColorClasses } from "../../../theme/useColorClasses";
import Button from "../../../components/ui/Button";
import { ChevronRight, CircleCheckBig, CircleHelp } from "lucide-react";
import Popup from "../../../common/Popup";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import CustomBreadcrumbs from "../../../common/CustomBreadCrumbs";

const ViewQuote = () => {
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState(null);
  const [selectedImage, setSelectedImage] = useState([]);
  const { quoteId } = useParams();
  const COLOR_CLASSES = useColorClasses();
  const [popupState, setPopupState] = useState({ open: false, type: "form", isEdit: false, id: null });
  const { user } = useAuth();

  const breadcrumbItems = [
    { label: 'Quotes', path: '/admin/quotes' },
    { label: device?.brand_name, path: `/admin/quotes/${quoteId}` },
  ];

  const getDevice = async () => {
    try {
      setLoading(true);
      const res = await api.admin.quotes.get(quoteId);
      setDevice(res.data);
      setSelectedImage(res.data.media?.[0]?.path || "");
    } catch (err) {
      console.error("Failed to fetch device:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDevice();
  }, []);

  const handleApprovedPopup = (id) => {
    setPopupState({ open: true, type: "approved", id });
  };

  const handleClose = () => {
    setPopupState({ open: false, type: "form", isEdit: false, id: null });
  };

  const handleApproved = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("status", "approved");
      const res = await api.admin.updateDeviceStatus(device.id, formData);
      toast.success(res.message);
      await getDevice();
      handleClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !device) return <LoadingIndicator isLoading={loading} />;

  return (
    <div className={`max-w-8xl mx-auto `}>
      <CustomBreadcrumbs items={breadcrumbItems} separator={<ChevronRight style={{ fontSize: "12px" }} />} />

      <div className={`flex flex-col md:flex-row gap-10 ${COLOR_CLASSES.bgGradient} backdrop-blur-md border ${COLOR_CLASSES.borderGray200} p-8 rounded-2xl shadow-md min-h-screen`}>
        {/* Image Section */}
        <div className="flex flex-row gap-4">
          {/* Thumbnails with Scroll */}
          <div className="flex md:flex-col gap-2 overflow-y-auto h-[400px] pr-1 scrollbar-hidden">
            {device.media.map((img) => (
              <img
                key={img.id}
                src={img.path}
                alt="Thumbnail"
                onClick={() => setSelectedImage(img.path)}
                className={`w-16 h-16 object-contain rounded-md cursor-pointer border ${
                  selectedImage === img.path ? "border-blue-500" : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className={`flex justify-center items-center border ${COLOR_CLASSES.borderGray200} rounded-lg w-[300px] h-[300px] md:w-[400px] md:h-[400px]`}>
            <img
              src={selectedImage}
              alt="Main Device"
              className="max-w-full max-h-full object-contain transform transition-transform duration-200 ease-in-out hover:scale-110"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1">
          <h2 className={`text-2xl font-semibold mb-3 ${COLOR_CLASSES.secondary}`}>
             {device.model_name}
          </h2>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <Chip status={device.condition} />
            <Chip status={device.status} />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4 text-sm md:text-base mb-4">
            <div>
              <div className="text-gray-500">Base Price</div>
              <div className="text-green-600 font-medium">₹{device.offered_price}</div>
            </div>
          </div>

          {/* Meta Info */}
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
              <div className="text-gray-500">Submitted By</div>
              {device.user?.name} ({device.user?.email})
            </div>
          </div>

          <div className="mt-4">
            <Button
              icon={<CircleCheckBig color={device.status === "approved" ? "green" : "white"} />}
              className="px-2 py-1 text-sm"
              onClick={handleApprovedPopup}
            >
              Approve
            </Button>
          </div>
        </div>
      </div>

      {/* Approval Popup */}
      <Popup
        open={popupState.open}
        onClose={handleClose}
        onSubmit={handleApproved}
        title={
          popupState.type === "delete"
            ? "Delete Confirmation"
            : popupState.isEdit
              ? "Edit Device"
              : popupState.type === "approved"
                ? "Approved Device"
                : "Create Device"
        }
        btnCancel="Cancel"
        btnSubmit="Submit"
        btnDelete="Delete"
        isbtnCancel={true}
        isbtnSubmit={popupState.type !== "delete"}
        isbtnDelete={popupState.type === "delete"}
        loading={loading}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
          <CircleHelp className={`w-28 h-28 ${COLOR_CLASSES.primary}`} />
          <p className={`text-sm font-medium ${COLOR_CLASSES.primary}`}>
            {`Are you sure you want to ${popupState.type === "approved" ? "approve" : "delete"} this device?`}
          </p>
        </div>
      </Popup>
    </div>
  );
};

export default ViewQuote;
