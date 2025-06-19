import React, { useEffect, useState } from 'react';
import api from '../../../constants/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

function StripeStatus() {
  const { user } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    console.log("useruseruser",user);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.admin.payments.stripeStatus(user?.stripe_account_id);
        const status = res.data?.status || 'incomplete';
        setPaymentStatus(status);
        toast.success(res.message || 'Stripe status fetched');
      } catch (err) {
        console.error('Failed to fetch Stripe account status', err);
        toast.error('Failed to fetch Stripe status');
      } finally {
        setLoading(false);
      }
    };

    if (user?.stripe_account_id) {
      fetchStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  const statusLabels = {
    verified: {
      label: 'Your Stripe Account is Verified',
      icon: <ShieldCheck className="w-10 h-10 text-green-600 mb-2" />,
      className: 'text-green-800',
    },
    incomplete: {
      label: 'Stripe Setup Incomplete',
      icon: <AlertCircle className="w-10 h-10 text-yellow-600 mb-2" />,
      className: 'text-yellow-800',
    },
    pending: {
      label: 'Stripe Account Status: Pending',
      icon: <Loader2 className="w-10 h-10 animate-spin text-gray-600 mb-2" />,
      className: 'text-gray-700',
    },
  };

  const statusConfig = statusLabels[paymentStatus] || {
    label: paymentStatus,
    icon: null,
    className: 'text-gray-800',
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="flex flex-col items-center rounded-2xl p-10 text-center max-w-lg w-full">
        <div className="flex flex-col items-center justify-center mb-6">
          {statusConfig.icon}
          <h1 className={`text-2xl md:text-3xl font-bold ${statusConfig.className}`}>
            {loading ? 'Loading Stripe Status...' : statusConfig.label}
          </h1>
        </div>
        {!loading && paymentStatus !== 'verified' && (
          <Button
            onClick={() => navigate('/connect/start')}
            className="mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 transition rounded-md"
          >
            Connect Stripe
          </Button>
        )}
      </div>
    </div>
  );
}

export default StripeStatus;
