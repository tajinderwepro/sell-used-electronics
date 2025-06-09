// src/layouts/UserLayout.jsx
import { Link } from 'react-router-dom';
import { FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS } from '../../constants/theme';
import { useColorClasses } from '../../theme/useColorClasses';
import { useMode } from '../../context/ModeContext';
import { Moon, Sun } from 'lucide-react';
import ModeToggleButton from '../../components/common/ModeToggleButton';

const HomeLayout = ({ children }) => {
  const COLOR_CLASSES = useColorClasses();
  const { mode, toggleMode } = useMode();

  return (
    <div
      className={`${COLOR_CLASSES.bgGradient} ${COLOR_CLASSES.textPrimary} ${FONT_FAMILIES.primary} min-h-screen flex flex-col`}
    >
      {/* Header */}
      <header
        className={`w-full border-b ${COLOR_CLASSES.borderGray200} shadow-sm ${COLOR_CLASSES.bgWhite} backdrop-blur-md`}
      >
        <div className="max-w-7xl mx-auto pl-6 py-4 flex justify-between items-center">
          <a
            href="/"
            className={`${FONT_SIZES["2xl"]} ${FONT_WEIGHTS.bold} ${COLOR_CLASSES.primary}`}
          >
            SellUsedElectronics
          </a>

          <div className="flex items-center gap-4">
            <nav className="space-x-6 hidden sm:block">
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

            <ModeToggleButton/>
          </div>
        </div>
      </header>

      {/* Content */}
      {children}

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
