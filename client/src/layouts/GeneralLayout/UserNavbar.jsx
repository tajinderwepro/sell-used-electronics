import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, LocationEdit, BadgeDollarSign } from 'lucide-react';
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
    icon: LocationEdit,
  },
  {
    name: 'Payments',
    to: '/payments',
    icon: BadgeDollarSign,
  },
  {
    name: 'Stripe Status',
    to: '/stripe-status',
    icon: LocationEdit,
  },
];

export default function UserNavbar() {
  const COLOR_CLASSES = useColorClasses();

  return (
    <nav className={`border-b ${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.borderPrimary} py-5`}>
      <div className='mx-auto px-4 sm:px-6 lg:px-8 xl:px-2 flex items-center justify-start w-full gap-6'>
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-2 text-[12.6px] sm:text-sm font-medium transition-colors ${
                isActive ? COLOR_CLASSES.primary : COLOR_CLASSES.textSecondary
              } hover:${COLOR_CLASSES.primary}`
            }
          >
            <link.icon className="h-4 w-4" />
            {link.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
