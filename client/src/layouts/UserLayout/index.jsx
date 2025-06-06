// src/layouts/UserLayout.jsx
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { useState } from 'react';
import { COLOR_CLASSES, FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS } from '../../constants/theme'
const UserLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen text-gray-900">
      {/* Header */}
      <header className="bg-white  py-4 px-6 flex justify-between items-center">
        <Link to="/"  className={`${FONT_SIZES['2xl']} ${FONT_WEIGHTS.bold} ${COLOR_CLASSES.primary} `}>
          SellUsedElectronics
        </Link>
        <div className="flex-1 flex flex-col">
        <Header setMobileMenuOpen={setMobileMenuOpen} />
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
