import React, { useEffect, useState } from 'react';
import Heading from '../../../components/ui/Heading';
import api from '../../../constants/api';
import { toast } from 'react-toastify';
import CommonTable from '../../../common/CommonTable';
import Button from '../../../components/ui/Button';
import { CircleHelp } from 'lucide-react';
import { useColorClasses } from '../../../theme/useColorClasses';
import Popup from '../../../common/Popup';
import { useFilters } from '../../../context/FilterContext';
import { useAuth } from '../../../context/AuthContext';

function Products() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupState, setPopupState] = useState({ open: false, deviceId: null, type: '' });
  const COLOR_CLASSES = useColorClasses();
  const {filters} = useFilters();
  const {user} = useAuth();
  const  [totalItems, setTotalItems] = useState(0);
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await api.user.getUserDevices(user.id,filters);
      setDevices(response.data);
      setTotalItems(response.total);
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
    { key: "id", label: "ID", sortable: true },
    { key: "category", label: "Category", sortable: true  },
    { key: "brand", label: "Brand", sortable: true  },
    { key: "model", label: "Model", sortable: true  },
    { key: "condition", label: "Condition", sortable: true  },
    { key: "base_price", label: "Base Price", sortable: true  },
    { key: "ebay_avg_price", label: "Ebay Avg Price", sortable: true  },
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
        onFetch={fetchDevices}
        title='Product List'
        totalItems={totalItems}
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
