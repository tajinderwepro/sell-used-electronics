import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, LocationEdit, Menu } from 'lucide-react';
import { PROJECT_NAME } from '../../constants';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/theme';
import { useColorClasses } from '../../theme/useColorClasses';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { name: 'Products', path: '/products', icon: <ShoppingBag size={18} /> },
  { name: 'Shipment Address', path: '/address', icon: <LocationEdit size={18} /> },
];

const SidebarNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const COLOR_CLASSES = useColorClasses()

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 640
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button for mobile — HIDDEN when sidebar open */}
      {!isOpen && (
        <div
          className={`sm:hidden z-50 ${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.primary} rounded-md ${COLOR_CLASSES.shadowLg}`}
          onClick={() => setIsOpen(true)}
        >
          <Menu size={20} />
        </div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 ${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.primary} ${COLOR_CLASSES.shadowMd} z-40 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        sm:translate-x-0 sm:static sm:flex`}
        onClick={(e) => {
          // If clicked directly on empty sidebar area, close it (mobile only)
          if (e.target === e.currentTarget && window.innerWidth < 640) {
            setIsOpen(false);
          }
        }}
      >
        {/* Logo */}
        <div className={`py-4 flex items-center justify-center border-b ${COLOR_CLASSES.borderGray200}`}>
          <a
            href="/"
            className={`${FONT_SIZES["2xl"]} ${FONT_WEIGHTS.bold} ${COLOR_CLASSES.primary}`}
          >
            {PROJECT_NAME}
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md ${COLOR_CLASSES.textPrimary} font-medium transition-all duration-200 ${
                  isActive ? COLOR_CLASSES.primaryLightBg : COLOR_CLASSES.primaryBgHover
                }`
              }
              onClick={() => setIsOpen(false)} // Close on nav click (mobile only)
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SidebarNav;
