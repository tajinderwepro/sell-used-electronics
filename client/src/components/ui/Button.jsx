import { COLOR_CLASSES, FONT_SIZES, FONT_WEIGHTS } from "../../constants/theme";

// components/ui/Button.jsx
export default function Button({
  children,
  className = '',
  disabled = false,
  variant = 'primary',
  ...props
}) {
  // Button variants and their styles
  const buttonStyles = {
    primary: `${COLOR_CLASSES.primaryBg} ${COLOR_CLASSES.primaryBgHover} text-white`,
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100',
  };

  const buttonClass = buttonStyles[variant] || buttonStyles.primary;

  return (
    <button
      className={`${buttonClass} ${FONT_WEIGHTS.semibold} ${FONT_SIZES.lg} w-full py-2 rounded-xl ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
