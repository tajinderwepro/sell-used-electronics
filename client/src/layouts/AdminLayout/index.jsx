// src/layouts/AdminLayout.jsx
import React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">
        <div className="p-6 text-2xl font-bold text-indigo-600 border-b">
          Admin Panel
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
