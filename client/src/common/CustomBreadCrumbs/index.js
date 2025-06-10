import React from 'react';
import { useNavigate } from 'react-router-dom';
import Heading from '../../components/ui/Heading';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/theme';

const CustomBreadcrumbs = ({ items, separator = '/' }) => {
  const navigate = useNavigate();

  return (
    <nav
      aria-label="breadcrumb"
      className="py-3 rounded-md"
    >
      <ol className="flex flex-wrap text-sm font-medium text-gray-700">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <span
                  onClick={() => navigate(item.path)}
                  className=" py-[4px] rounded-[15px] text-gray-500  cursor-pointer"
                >
                <Heading className={`${FONT_SIZES.md} ${FONT_WEIGHTS.semibold}`}>
                    {item.label}
                </Heading>
                </span>
              ) : (
                <Heading className={`${FONT_SIZES.md} ${FONT_WEIGHTS.bold}`}>
                    {item.label}
                </Heading>
                // <span className=" py-[4px] rounded-[15px] text-black-600 ">{item.label}</span>
              )}
              {!isLast && (
                  <Heading className={`${FONT_SIZES.md} `}>
                    {separator}
                </Heading>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CustomBreadcrumbs;
