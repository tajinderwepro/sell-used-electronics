import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomBreadcrumbs = ({ items, separator = '/' }) => {
  const navigate = useNavigate();

  return (
    <nav
      aria-label="breadcrumb"
      className="px-4 py-3 rounded-md mb-6"
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
                  {item.label}
                </span>
              ) : (
                <span className=" py-[4px] rounded-[15px] text-black-600 ">{item.label}</span>
              )}
              {!isLast && (
                <span className="mx-2 text-gray-400">{separator}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CustomBreadcrumbs;
