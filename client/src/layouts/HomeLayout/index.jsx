// src/layouts/UserLayout.jsx
import { Link } from 'react-router-dom';
import { COLOR_CLASSES, FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS } from '../../constants/theme'
const HomeLayout = ({ children }) => {
  return (
    <div
      className={`${COLOR_CLASSES.bgGradient} ${COLOR_CLASSES.textPrimary} ${FONT_FAMILIES.primary} min-h-screen flex flex-col`}
    >
      {/* Header */}
      <header
        className={`w-full border-b ${COLOR_CLASSES.borderGray200} shadow-sm ${COLOR_CLASSES.bgWhite} backdrop-blur-md`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a
          href='/'
            className={`${FONT_SIZES["2xl"]} ${FONT_WEIGHTS.bold} ${COLOR_CLASSES.primary} `}
          >
            SellUsedElectronics
          </a>
          <nav className="space-x-6">
            <Link
              to="/login"
              className={`${FONT_SIZES.sm} ${FONT_WEIGHTS.medium} ${COLOR_CLASSES.textSecondary} ${COLOR_CLASSES.textHoverPrimary} transition-colors duration-200`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`${FONT_SIZES.sm} ${FONT_WEIGHTS.medium} ${COLOR_CLASSES.textSecondary} ${COLOR_CLASSES.textHoverPrimary} transition-colors duration-200`}
            >
              Register
            </Link>
          </nav>
        </div>
      </header>
        {/* <main className="p-6"> */}
            {children}
        {/* </main> */}
      {/* Footer */}
      <footer
        className={`w-full text-center text-sm py-6 border-t ${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.textSecondary}`}
      >
        © {new Date().getFullYear()} ElectroTrade. All rights reserved.
      </footer>
    </div>
  );
};

export default HomeLayout;
