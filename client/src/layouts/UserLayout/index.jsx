// src/layouts/UserLayout.jsx
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { useState } from 'react';
import { FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS } from '../../constants/theme'
import { useColorClasses } from '../../theme/useColorClasses';
const UserLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const COLOR_CLASSES = useColorClasses();
  
  return (
    <div className={`min-h-screen text-gray-900  ${COLOR_CLASSES.bgWhite}`}>
      {/* Header */}
        <Header setMobileMenuOpen={setMobileMenuOpen} />
      {/* Main Content */}
      <main className={`p-6  ${COLOR_CLASSES.textPrimary} ${FONT_FAMILIES.primary}`}>
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
