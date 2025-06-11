import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Settings, Settings2 } from 'lucide-react';
import { useColorClasses } from '../../theme/useColorClasses';

const navLinks = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Products',
    to: '/products',
    icon: ShoppingBag,
  },
  {
    name: 'Shipment Address',
    to: '/address',
    icon: ShoppingBag,
  },
];

export default function UserNavbar() {
  const COLOR_CLASSES = useColorClasses();

  return (
    <nav className={`border-b ${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.borderPrimary} py-5 flex gap-6`}>
      {navLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center gap-2 text-sm font-medium transition-colors ${
              isActive ? COLOR_CLASSES.primary : COLOR_CLASSES.textSecondary
            } hover:${COLOR_CLASSES.primary}`
          }
        >
          <link.icon className="h-4 w-4" />
          {link.name}
        </NavLink>
      ))}
    </nav>
  );
}
