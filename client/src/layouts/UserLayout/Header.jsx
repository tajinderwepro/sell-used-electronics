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

export default function Header({ setMobileMenuOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="h-16 flex items-center justify-between bg-white px-4">
      <div>
        <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-gray-600 hover:text-indigo-600"
        >
            <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex justify-end items-center gap-4 relative">
        <button className="relative text-gray-600 hover:text-indigo-600">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-700"
          >
            <UserCircle className="h-8 w-8" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
              <Link
                to="/admin/dashboard"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2" /> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
