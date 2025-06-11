import React from 'react';
import Popup from '../../common/Popup';
import { useAuth } from '../../context/AuthContext';
import { useSession } from '../../context/SessionContext';
import Button from '../ui/Button';
import { Lock } from 'lucide-react'; // Icon for session lock

function SessionExpiredModal() {
  const { logout } = useAuth();
  const { open, setOpen } = useSession();

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <Popup
      open={open}
      onClose={() => setOpen(false)}
      title="Session Expired"
      isbtnCancel={false}
      isbtnDelete={false}
      isbtnSubmit={true}
      onSubmit={handleLogout}
      btnSubmit="Login Again"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-red-100 p-4 rounded-full">
          <Lock size={32} className="text-red-600" />
        </div>
        <p className="text-gray-700 text-sm">
          Your session has expired or you have been logged out.
          <br />
          Please log in again to continue.
        </p>
      </div>
    </Popup>
  );
}

export default SessionExpiredModal;
