import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

import {
  COLOR_CLASSES,
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
  // You can import more if needed
} from "../../constants/theme"; // adjust path if needed

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`flex min-h-screen ${COLOR_CLASSES.bgGradient} ${FONT_FAMILIES.primary}`}>
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col">
        <Header setMobileMenuOpen={setMobileMenuOpen} />
        <main className={`flex-1 p-2 ${COLOR_CLASSES.bgWhite}`}>
          <div
            className={`${COLOR_CLASSES.bgWhite} rounded-lg ${COLOR_CLASSES.shadowLg} p-6`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
