import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react'; // Optional: for nicer separators
import Heading from '../../components/ui/Heading';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/theme';
import { useColorClasses } from '../../theme/useColorClasses';

const CustomBreadcrumbs = ({ items, separator = <ChevronRight size={16} /> }) => {
  const navigate = useNavigate();
  const COLOR_CLASSES = useColorClasses();

  return (
    <nav aria-label="breadcrumb" className="py-3 px-2">
      <ol className="flex flex-wrap items-center gap-2 text-sm font-medium">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const labelClass = `${FONT_SIZES.md} ${FONT_WEIGHTS.medium} ${
            isLast ? COLOR_CLASSES.textPrimary : `${COLOR_CLASSES.textSecondary} ${COLOR_CLASSES.textHoverPrimary}`
          }`;

          return (
            <li key={index} className="flex items-center gap-1">
              {!isLast ? (
                <span
                  onClick={() => navigate(item.path)}
                  className={`cursor-pointer transition-colors duration-200`}
                >
                  <Heading className={labelClass}>
                    {item.label}
                  </Heading>
                </span>
              ) : (
                <Heading className={labelClass}>{item.label}</Heading>
              )}
              {!isLast && (
                <span className={`${COLOR_CLASSES.textLight}`}>
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CustomBreadcrumbs;
