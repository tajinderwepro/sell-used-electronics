// src/layouts/UserLayout.jsx
import { FONT_FAMILIES } from '../../constants/theme';
import { useColorClasses } from '../../theme/useColorClasses';
import { useMode } from '../../context/ModeContext';
import  Footer  from './Footer';
import  Header  from './Header';
import UserNavbar from './UserNavbar';
import { useAuth } from '../../context/AuthContext';
import { useLocation,matchPath  } from 'react-router-dom';
const GeneralLayout = ({ children }) => {
  const COLOR_CLASSES = useColorClasses();
  const {user, isAuthenticated, logout} = useAuth();
  const paths = ['/orders','/orders/:orderId', '/products', '/products/:productId', '/dashboard', '/payments', '/address','/stripe-status' ];
  const location = useLocation();
  const shouldShowNavbar = user && isAuthenticated && paths.some((path) =>
    matchPath({ path, end: true }, location.pathname)
  );
  return (
    <div
      className={`${COLOR_CLASSES.textPrimary} ${FONT_FAMILIES.primary}  ${COLOR_CLASSES.bgGradient} ${COLOR_CLASSES.bgWhite} min-h-screen flex flex-col`}
    >
      <Header/>
      <div
        className={`max-w-7xl mx-auto w-full pt-[72px]`}
      >
        {shouldShowNavbar && (
          <div className="hidden sm:block">
            <UserNavbar />
          </div>
        )}
        <div className="min-h-screen my-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-2">
            {children}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default GeneralLayout;
