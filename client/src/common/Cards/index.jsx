// components/BrandCard.jsx

import React from "react";
import { FONT_FAMILIES } from "../../constants/theme";
import { useColorClasses } from "../../theme/useColorClasses";


const Cards = ({ brand, onClick }) => {
 const COLOR_CLASSES = useColorClasses();

  return (
    <div
      key={brand.id}
      onClick={() => onClick(brand)}
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 ${COLOR_CLASSES.borderHoverPrimary} flex flex-col items-center p-4 cursor-pointer group`}
    >
      <div className="w-20 h-20 mb-4 flex items-center justify-center overflow-hidden">
        <img
          src={brand.media[0]?.path}
          alt={brand.name}
          className="object-contain w-full h-full"
        />
      </div>
      <h3 className={`text-sm font-semibold text-gray-800 text-center ${COLOR_CLASSES.textHoverPrimary}  
        ${FONT_FAMILIES.primary}`}>
        {brand.name}
      </h3>
    </div>
  );
};

export default Cards;
