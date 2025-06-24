import React, { useEffect, useState } from 'react';
import {
  ChevronRight,
  CircleHelp,
  SearchCheck,
} from 'lucide-react';
import api from '../../../constants/api';
import { toast } from 'react-toastify';
import Popup from '../../../common/Popup';
import { useColorClasses } from '../../../theme/useColorClasses';
import { useFilters } from '../../../context/FilterContext';
import { useAuth } from '../../../context/AuthContext';
import QuoteCard from '../../../components/common/DeviceCard';
import LoadingIndicator from '../../../common/LoadingIndicator';
import Button from '../../../components/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import CustomBreadcrumbs from '../../../common/CustomBreadCrumbs';
import ViewQuoteCard from '../../../components/common/ViewQuoteCard';
import Notes from '../../../components/common/Notes';

function Products() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupState, setPopupState] = useState({ open: false, deviceId: null, type: '' });
  const COLOR_CLASSES = useColorClasses();
  const { filters } = useFilters();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams();

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await api.user.getUserQuotes(user.id, filters);
      setQuotes(response.data);
    } catch (err) {
      console.error('Failed to fetch quotes:', err);
      toast.error('Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const breadcrumbItems = [
    { label: 'Quotes', path: '/products' },
    productId ? { label: "Quote #" + productId, path: `/products/${productId}` } : "",
  ];

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
      if(res.success){
        toast.success(res.message);
      }else{
        toast.error(res.message);
      }
      fetchQuotes();
      handleClose();
    } catch (err) {
      console.error('Failed to request shipment:', err);
      toast.error('Failed to request shipment');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryShipment = async () => {
    setLoading(true);
    try {
      const res = await api.user.retryShipment(popupState.deviceId);
      const success = res?.success ?? res?.success ?? false;
      if (success) {
        toast.success(res.message);
        fetchQuotes();
      } else {
        toast.error(res.message || "Shipment retry failed.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.message ||
        error?.message ||
        "Shipment retry failed due to an unexpected error.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedDevice = quotes.find((d) => String(d.id) === productId);

  return (
    <div className="py-6">
      <CustomBreadcrumbs items={breadcrumbItems} separator={productId ? <ChevronRight style={{ fontSize: "12px" }} /> : ""} />
      {loading ? (
        <div className={`flex justify-center items-center h-64 ${COLOR_CLASSES.textSecondary}`}>
          <LoadingIndicator loading={loading} />
        </div>
      ) : quotes.length === 0 ? (
          <div className={`p-4 h-[300px] flex items-center justify-center flex-col`}>
            <SearchCheck className="h-12 w-12 text-gray-400"/>
            <h2>No quotes found</h2>
          </div>
      ) : (
        productId && selectedDevice ? (
          <>
          <ViewQuoteCard selectedDevice={selectedDevice} />
           <Notes order={selectedDevice}/>
           </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map((device, index) => (
              <Card
                key={device.id}
                device={device}
                onRequestShipment={(id, type = 'approved') => handleOpen(id, type)}
                type="quote"
                onClick={() => navigate(`/products/${device.id}`)}
                index={index}
              />
            ))}
          </div>
        )
      )}

      <Popup
        open={popupState.open}
        onClose={handleClose}
        onSubmit={popupState.type === 'approved' ? handleRequest : popupState.type == 'retry' ? handleRetryShipment : () => {}}
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

export default Products;