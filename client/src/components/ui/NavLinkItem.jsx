import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavLinkItem({ name, icon: Icon, path }) {
  const { pathname } = useLocation();
  const isActive = pathname.startsWith(path);

  return (
    <Link
      to={path}
      className={`flex items-center gap-4 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
      }`}
    >
      <Icon className="h-5 w-5" />
      {name}
    </Link>
  );
}
