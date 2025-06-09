import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../../constants/theme";
import { useColorClasses } from "../../theme/useColorClasses";

export default function NavLinkItem({ name, icon: Icon, path }) {
  const { pathname } = useLocation();
  const isActive = pathname.startsWith(path);
  const COLOR_CLASSES = useColorClasses();
  
  return (
    <Link
      to={path}
      className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-200
        ${FONT_SIZES.sm} ${FONT_WEIGHTS.medium}
        ${
          isActive
            ? `${COLOR_CLASSES.primaryLightBg} ${COLOR_CLASSES.primaryDark}`
            : `text-gray-600 hover:bg-gray-100 hover:${COLOR_CLASSES.primary}`
        }`}
    >
      <Icon className="h-5 w-5" />
      {name}
    </Link>
  );
}
