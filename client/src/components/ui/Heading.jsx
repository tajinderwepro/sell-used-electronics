// components/ui/Heading.jsx
import { FONT_SIZES, FONT_WEIGHTS, FONT_FAMILIES } from '../../constants/theme';
import { useColorClasses } from '../../theme/useColorClasses';

export default function Heading({ children, className = '' }) {
    const COLOR_CLASSES = useColorClasses();
  
  return (
    <h2
      className={`
        ${FONT_SIZES["3xl"]}
        ${FONT_WEIGHTS.bold}
        text-center
        tracking-wide
        ${COLOR_CLASSES.primary}
        ${FONT_FAMILIES.heading}
        ${className}
      `}
    >
      {children}
    </h2>
  );
}
