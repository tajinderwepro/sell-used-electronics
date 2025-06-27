import { useMode } from '../context/ModeContext';
import { colorMap } from './colors';

export const useColorClasses = () => {
  const { mode, theme } = useMode();

  const currentTheme = colorMap[theme] || colorMap['default'];
  const currentMode = currentTheme[mode] || currentTheme['light'];

  return {
    // Primary Colors
    primary: currentMode.primary,
    primaryDark: currentMode.primaryDark,
    primaryLightBg: currentMode.primaryLightBg,
    primaryBg: `bg-gradient-to-r ${currentMode.primaryFrom} ${currentMode.primaryTo}`,
    primaryBgHover: `${currentMode.hoverFrom} ${currentMode.hoverTo}`,
    primaryRing: currentMode.primaryRing,

    // Secondary
    secondary: mode === 'dark' ? "text-gray-400" : "text-gray-700",
    secondaryDark: mode === 'dark' ? "text-gray-300" : "text-gray-900",
    secondaryBg: mode === 'dark' ? "bg-gray-600" : "bg-gray-200",
    secondaryBgHover: mode === 'dark' ? "hover:bg-gray-500" : "hover:bg-gray-300",

    // Text
    textPrimary: mode === 'dark' ? "text-gray-100" : "text-gray-900",
    textSecondary: mode === 'dark' ? "text-gray-400" : "text-gray-600",
    textLight: mode === 'dark' ? "text-gray-500" : "text-gray-400",
    textHoverPrimary: currentMode.textHover,

    // Borders
    borderPrimary: currentMode.border,
    borderGray100: mode === 'dark' ? "border-gray-600" : "border-gray-100",
    borderGray200: mode === 'dark' ? "border-gray-600" : "border-gray-200",
    borderHoverPrimary: currentMode.borderHover,

    // Backgrounds
    bgWhite: currentMode.bgWhite || (mode === 'dark' ? "bg-[#121e1d]" : "bg-white"),
    bgGradient: mode === 'dark'
      ? `bg-gradient-to-br from-[#121e1d] via-[#1b2c2b] to-[#203532]`
      : `bg-gradient-to-br from-white via-${currentMode.primaryLightBg || 'gray-50'} to-${currentMode.primaryDark || 'gray-100'}`,

    // Gradient button
    gradientBtn: `bg-gradient-to-r ${currentMode.primaryFrom} ${currentMode.primaryTo} ${currentMode.hoverFrom} ${currentMode.hoverTo} text-white`,

    // Shadows
    shadowMd: mode === 'dark' ? 'shadow shadow-slate-900/30' : 'shadow-md',
    shadowLg: mode === 'dark'
      ? 'hover:shadow-xl shadow-slate-800/20 transition-shadow duration-300 ease-in-out'
      : 'hover:shadow-lg transition-shadow duration-300 ease-in-out',
  };
};
