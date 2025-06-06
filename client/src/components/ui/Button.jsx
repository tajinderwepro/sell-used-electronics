import { COLOR_CLASSES, FONT_SIZES, FONT_WEIGHTS } from "../../constants/theme";

// components/ui/Button.jsx
export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`${COLOR_CLASSES.primaryBg} ${COLOR_CLASSES.primaryBgHover} text-white w-full py-2 rounded ${FONT_WEIGHTS.semibold} ${FONT_SIZES.lg}`}
      {...props}
    >
      {children}
    </button>
  );
}
