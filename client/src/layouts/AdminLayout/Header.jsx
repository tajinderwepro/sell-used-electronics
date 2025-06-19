import React, { useState } from "react";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle,
  Menu,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../../constants/theme";
import { useColorClasses } from "../../theme/useColorClasses";
import ModeToggleButton from "../../components/common/ModeToggleButton";

const DROPDOWN_MENU = [
  {
    name: "Profile",
    href: "/admin/profile",
    icon: UserCircle,
  },
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function Header({ setMobileMenuOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const COLOR_CLASSES = useColorClasses();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <header
      className={`h-16 flex items-center justify-between ${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.shadowMd} px-8`}
    >
      <div>
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className={`md:hidden hover:${COLOR_CLASSES.primary}`}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex justify-end items-center gap-4 relative">
        <button
          className={`relative  hover:${COLOR_CLASSES.primary}`}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2  hover:${COLOR_CLASSES.primaryDark}`}
          >
            <UserCircle className="h-6 w-6" />
          </button>
          {dropdownOpen && (
            <div className={`absolute right-0 mt-2 w-48 ${COLOR_CLASSES.bgWhite} border rounded shadow z-40`}>
              {DROPDOWN_MENU.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
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
                <ModeToggleButton onClick={() => setDropdownOpen(false)}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
