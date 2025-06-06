import React from "react";
import {
  LayoutDashboard,
  Monitor,
  Package,
  FileText,
  Users,
} from "lucide-react";
import Heading from "../../components/ui/Heading";
import NavLinkItem from "../../components/ui/NavLinkItem";

import {
  COLOR_CLASSES,
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../../constants/theme"; // adjust path if needed

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Devices", icon: Monitor, path: "/admin/devices" },
  { name: "Orders", icon: Package, path: "/admin/orders" },
  { name: "Quotes", icon: FileText, path: "/admin/quotes" },
];

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`w-64 ${COLOR_CLASSES.bgWhite} border-r ${COLOR_CLASSES.shadowMd} fixed z-20 inset-y-0 left-0 transform md:translate-x-0 transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <div className={`h-16 flex items-center justify-center border-b px-4`}>
          <Heading
            className={`${FONT_SIZES.xl} ${FONT_WEIGHTS.bold} ${COLOR_CLASSES.primary}`}
          >
            SellUsedElectronics
          </Heading>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLinkItem
              key={item.name}
              {...item}
              onClick={() => setMobileMenuOpen(false)}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-10 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
