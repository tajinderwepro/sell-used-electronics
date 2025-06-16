import React, { useState } from 'react'
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/theme'
import ModeToggleButton from '../../components/common/ModeToggleButton'
import { useColorClasses } from '../../theme/useColorClasses'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sun,
  UserCircle,
} from "lucide-react"
import { PROJECT_NAME } from '../../constants'
import { useMode } from '../../context/ModeContext'

const DROPDOWN_MENU = [
  {
    name: "Profile",
    href: "/profile",
    icon: UserCircle,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

function Header() {
  const COLOR_CLASSES = useColorClasses()
  const { user, isAuthenticated, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { mode, toggleMode } = useMode();
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }


 function ModeToggle() {
  return (
      <button
        onClick={toggleMode}
        className={`p-2 rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-200`}
        aria-label="Toggle Theme"
      >
        {mode === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-700" />}
      </button>
    );
  }


  return (
    <header className={`fixed top-0 left-0 w-full border-b z-[3]  ${COLOR_CLASSES.borderGray200} shadow-sm ${COLOR_CLASSES.bgWhite}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-2 py-4 flex justify-between items-center">
        <a
          href="/"
          className={`${FONT_SIZES["2xl"]} ${FONT_WEIGHTS.bold} ${COLOR_CLASSES.primary}`}
        >
          {PROJECT_NAME}
        </a>
        <div className="flex justify-end items-center gap-2">
          {!user || !isAuthenticated ? (
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
              <ModeToggle/>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2  hover:text-indigo-700"
              >
                <UserCircle className="h-6 w-6" />
              </button>
              {dropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 ${COLOR_CLASSES.bgWhite} border ${COLOR_CLASSES.borderGray200} rounded shadow z-40`}>
                  {DROPDOWN_MENU.map((item) => (
                    <Link
                      key={item.name}
                      to={user.role === "admin" ? '/admin'+item.href : item.href}
                      className={`flex items-center w-full px-4 py-2 text-sm ${COLOR_CLASSES.secondaryBgHover}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <item.icon className="h-4 w-4 mr-2" /> {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className={`flex items-center w-full px-4 py-2 text-sm ${COLOR_CLASSES.secondaryBgHover}`}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                  <div className={`border-t ${COLOR_CLASSES.borderGray200}`}>
                    <ModeToggleButton />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
