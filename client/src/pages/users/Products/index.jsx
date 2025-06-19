import React, { useEffect, useState } from 'react';
import {
  CircleHelp,
} from 'lucide-react';
import api from '../../../constants/api';
import { toast } from 'react-toastify';
import Popup from '../../../common/Popup';
import { useColorClasses } from '../../../theme/useColorClasses';
import { useFilters } from '../../../context/FilterContext';
import { useAuth } from '../../../context/AuthContext';
import QuoteCard from '../../../components/common/DeviceCard';
import LoadingIndicator from '../../../common/LoadingIndicator';


function Products() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupState, setPopupState] = useState({ open: false, deviceId: null, type: '' });
  const COLOR_CLASSES = useColorClasses();
  const { filters } = useFilters();
  const { user } = useAuth();

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
    } catch (err) {
      console.error('Failed to request shipment:', err);
      toast.error('Failed to request shipment');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <div className="py-6">
      <h2 className={`text-2xl font-bold mb-6 ${COLOR_CLASSES.textPrimary}`}>Products</h2>
      {loading ? (
        <div className={`flex justify-center items-center h-64 ${COLOR_CLASSES.textSecondary}`}>
          <LoadingIndicator loading={loading} />
        </div>
      ) : quotes.length === 0 ? (
        <div className={`text-center ${COLOR_CLASSES.textSecondary}`}>No products found.</div>
      ) : (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quotes.map((device) => (
            <QuoteCard
              key={device.id}
              device={device}
              onRequestShipment={(id) => handleOpen(id, 'approved')}
            />
          ))}
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

export default Products;
