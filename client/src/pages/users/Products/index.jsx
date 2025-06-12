import React, { useEffect, useState } from 'react';
import Heading from '../../../components/ui/Heading';
import api from '../../../constants/api';
import { toast } from 'react-toastify';
import CommonTable from '../../../common/CommonTable';
import Button from '../../../components/ui/Button';
import { CircleHelp } from 'lucide-react';
import { useColorClasses } from '../../../theme/useColorClasses';
import Popup from '../../../common/Popup';


function Products() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupState, setPopupState] = useState({ open: false, deviceId: null, type: '' });
  const COLOR_CLASSES = useColorClasses();

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getDevices();
      setDevices(response.data);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
      toast.error("Failed to fetch devices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleOpen = (deviceId, type = 'approved') => {
    setPopupState({ open: true, deviceId, type });
  };

  const handleClose = () => {
    setPopupState({ open: false, deviceId: null, type: '' });
  };

  const handleApproved = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      await api.admin.approveDevice(popupState.deviceId);
      toast.success("Device shipment requested successfully");
      fetchDevices();
    } catch (err) {
      console.error("Failed to request shipment:", err);
      toast.error("Failed to request shipment");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "category_name", label: "Category" },
    { key: "brand_name", label: "Brand" },
    { key: "model_name", label: "Model" },
    { key: "condition", label: "Condition" },
    { key: "base_price", label: "Base Price" },
    { key: "ebay_avg_price", label: "Ebay Avg Price" },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Shipment",
      render: (device) => (
        device.status === "approved" && (
          <Button
            className='text-xs px-2'
            onClick={() => handleOpen(device.id, 'approved')}
          >
            Request
          </Button>
        )
      ),
    },
  ];

  return (
    <div className="py-6">
      {/* <Heading className='text-start mb-4'>Products List</Heading> */}
      <CommonTable
        columns={columns}
        data={devices}
        loading={loading}
        pageSize={10}
        isCreate={false}
        title='Product List'
      />

      <Popup
        open={popupState.open}
        onClose={handleClose}
        onSubmit={popupState.type === "approved" ? handleApproved : () => {}}
        title={"Shipment Request"}
        btnCancel="Cancel"
        btnSubmit="Submit"
        loading={loading}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
          <CircleHelp className={`w-28 h-28 ${COLOR_CLASSES.primary}`} />
          <p className={`text-sm font-medium ${COLOR_CLASSES.primary}`}>
            Are you sure you want to request shipment for this product?
          </p>
        </div>
      </Popup>
    </div>
  );
}

export default Products;
