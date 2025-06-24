import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, CircleHelp } from 'lucide-react';
import api from '../../../constants/api';
import { toast } from 'react-toastify';
import Popup from '../../../common/Popup';
import { useColorClasses } from '../../../theme/useColorClasses';
import { useFilters } from '../../../context/FilterContext';
import { useAuth } from '../../../context/AuthContext';
import QuoteCard from '../../../components/common/DeviceCard';
import LoadingIndicator from '../../../common/LoadingIndicator';
import CustomBreadcrumbs from '../../../common/CustomBreadCrumbs';
import Card from '../../../components/common/Card';
import ViewOrderCard from '../../../components/common/ViewOrderCard';
import Notes from '../../../components/common/Notes';
import Button from '../../../components/ui/Button';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupState, setPopupState] = useState({ open: false, deviceId: null, type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const COLOR_CLASSES = useColorClasses();
  const { filters } = useFilters();
  const { user } = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Orders', path: '/orders' },
    orderId ? { label: "Order #" + orderId, path: `/order/${orderId}` } : "",
  ];

  const handleShowMore = () => {
    fetchOrders(currentPage + 1, true);
  };

  const fetchOrders = async (page = 1, append = false) => {
    try {
      setLoading(true);
      const response = await api.user.getUserOrders(user.id, {
        ...filters,
        current_page: page,
        order_by: 'desc',
        sort_by: 'id'
      });

      const fetched = response?.data || [];
      const total = response?.total || 0;

      setOrders((prev) => (append ? [...prev, ...fetched] : fetched));
      setTotalOrders(total);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpen = (deviceId, type = 'approved') => {
    setPopupState({ open: true, deviceId, type });
  };

  const handleClose = () => {
    setPopupState({ open: false, deviceId: null, type: '' });
  };

  const handleRequest = async () => {
    try {
      setLoading(true);
      const res = await api.user.requestShipment(popupState.deviceId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      fetchOrders();
    } catch (err) {
      console.error('Failed to request shipment:', err);
      toast.error('Failed to request shipment');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const getDevice = () => fetchOrders();

  const selectedDevice = orders.find((d) => String(d.id) === orderId);
  return (
    <div className="py-4">
      {/* <h2 className={`text-2xl font-bold mb-6 ${COLOR_CLASSES.textPrimary}`}>Orders</h2> */}
      <CustomBreadcrumbs className items={breadcrumbItems} separator={orderId ? <ChevronRight style={{ fontSize: "12px" }} /> : ""} />
      {loading ? (
        <div className={`flex justify-center items-center h-64 ${COLOR_CLASSES.textSecondary}`}>
          <LoadingIndicator loading={loading} />
        </div>
      ) : orders.length === 0 ? (
        <div className={`text-center ${COLOR_CLASSES.textSecondary}`}>No Orders found.</div>
      ) : (
        <>
          {orderId && selectedDevice ? (
           <ViewOrderCard selectedDevice={selectedDevice}/>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {orders.map((device) => (
                <Card
                  key={device.id}
                  device={device}
                  getDevice={getDevice}
                  onRequestShipment={(id) => handleOpen(id, 'approved')}
                  onClick={() => navigate(`/orders/${device.id}`)} 
                />
              ))}
            </div>
          )}
          {selectedDevice && 
          <Notes data={selectedDevice}/>}
        </>
      )}
      {!selectedDevice && orders.length < totalOrders && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleShowMore}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Loading...' : 'Show More'}
          </Button>
        </div>
      )}
      <Popup
        open={popupState.open}
        onClose={handleClose}
        onSubmit={popupState.type === 'approved' ? handleRequest : () => {}}
        title={'Shipment Request'}
        btnCancel="Cancel"
        btnSubmit="Submit"
        loading={loading}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
          <CircleHelp className={`w-20 h-20 ${COLOR_CLASSES.primary}`} />
          <p className={`text-sm font-medium ${COLOR_CLASSES.primary}`}>
            Are you sure you want to request shipment for this product?
          </p>
        </div>
      </Popup>
    </div>
  );
}

export default Orders;
