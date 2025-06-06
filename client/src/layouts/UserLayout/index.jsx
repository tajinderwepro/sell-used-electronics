// src/layouts/UserLayout.jsx
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          SellUsedElectronics
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/user/profile" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
            <User size={18} />
            <span>Profile</span>
          </Link>
          <button className="flex items-center gap-1 text-red-600 hover:text-red-800">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
