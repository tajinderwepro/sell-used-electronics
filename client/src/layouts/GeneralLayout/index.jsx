// src/layouts/UserLayout.jsx
import { FONT_FAMILIES } from '../../constants/theme';
import { useColorClasses } from '../../theme/useColorClasses';
import { useMode } from '../../context/ModeContext';
import  Footer  from './Footer';
import  Header  from './Header';
import UserNavbar from './UserNavbar';
import { useAuth } from '../../context/AuthContext';
const GeneralLayout = ({ children }) => {
  const COLOR_CLASSES = useColorClasses();
  const {user, isAuthenticated, logout} = useAuth();
  return (
    <div
      className={`${COLOR_CLASSES.textPrimary} ${FONT_FAMILIES.primary}  ${COLOR_CLASSES.bgGradient} ${COLOR_CLASSES.bgWhite} min-h-screen flex flex-col`}
    >
      <Header/>
      <div
        className={`max-w-7xl mx-auto w-full `}
      >
        {user && isAuthenticated && <UserNavbar />}
        <div className="min-h-screen my-3">
            {children}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default GeneralLayout;
