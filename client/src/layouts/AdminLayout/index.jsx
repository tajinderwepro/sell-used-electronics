import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

import {
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
  // You can import more if needed
} from "../../constants/theme"; // adjust path if needed
import { useColorClasses } from "../../theme/useColorClasses";

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const COLOR_CLASSES = useColorClasses();

  return (
    <div className={`flex min-h-screen ${COLOR_CLASSES.bgGradient} ${COLOR_CLASSES.textPrimary} ${FONT_FAMILIES.primary}`}>
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col max-w-full overflow-hidden">
        <Header setMobileMenuOpen={setMobileMenuOpen} />
        <main className={`flex-1 p-2 ${COLOR_CLASSES.bgWhite}`}>
          <div
            className={`${COLOR_CLASSES.bgWhite} rounded-lg p-6`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
