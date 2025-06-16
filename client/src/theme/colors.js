// theme/colors.js

// 🎨 LIGHT THEME
export const COLOR_CLASSES_LIGHT = {
  // Primary Colors (updated to gradient-inspired blues/purples)
  primary: "text-indigo-600",
  primaryDark: "text-purple-700",
  primaryLightBg: "bg-indigo-50",
  primaryBg: "bg-gradient-to-r from-indigo-500 to-purple-500",
  primaryBgHover: "hover:from-purple-600 hover:to-indigo-600",
  primaryRing: "ring-indigo-300",

  // Secondary (toned to complement gradient)
  secondary: "text-gray-600",
  secondaryDark: "text-gray-800",
  secondaryBg: "bg-gray-300",
  secondaryBgHover: "hover:bg-gray-400",

  // Text Colors
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-600",
  textLight: "text-gray-400",
  textHoverPrimary: "hover:text-indigo-600",

  // Borders
  borderPrimary: "border-indigo-500",
  borderGray100: "border-gray-100",
  borderGray200: "border-gray-200",
  borderHoverPrimary: "hover:border-purple-500",

  // Backgrounds
  bgWhite: "bg-white",
  bgGradient: "bg-gradient-to-br from-white via-indigo-50 to-purple-100",

  // Gradient button (used everywhere for primary actions)
  gradientBtn:
    "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600 text-white",

  // Shadows
  shadowMd: "shadow-md",
  shadowLg: "hover:shadow-lg transition-shadow duration-300 ease-in-out",
};

// 🌙 DARK THEME
export const COLOR_CLASSES_DARK = {
  // Primary Colors
  primary: "text-indigo-300",
  primaryDark: "text-purple-300",
  primaryLightBg: "bg-[#1f2733]",
  primaryBg: "bg-gradient-to-r from-indigo-700 to-purple-700",
  primaryBgHover: "hover:from-purple-600 hover:to-indigo-600",
  primaryRing: "ring-indigo-400",

  // Secondary
  secondary: "text-gray-400",
  secondaryDark: "text-gray-300",
  secondaryBg: "bg-gray-600",
  secondaryBgHover: "hover:bg-gray-500",

  // Text
  textPrimary: "text-gray-100",
  textSecondary: "text-gray-400",
  textLight: "text-gray-500",
  textHoverPrimary: "hover:text-indigo-300",

  // Borders
  borderPrimary: "border-indigo-400",
  borderGray100: "border-gray-600",
  borderGray200: "border-gray-600",
  borderHoverPrimary: "hover:border-purple-400",

  // Backgrounds
  bgWhite: "bg-[#151d27]",
  bgGradient: "bg-gradient-to-br from-[#151d27] via-[#1f2733] to-[#232b38]",

  // Gradient button
  gradientBtn:
    "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600 text-white",

  // Shadows
  shadowMd: "shadow shadow-slate-900/30",
  shadowLg:
    "hover:shadow-xl shadow-slate-800/20 transition-shadow duration-300 ease-in-out",
};
