// components/BrandCard.jsx

import React from "react";
import { FONT_FAMILIES } from "../../constants/theme";
import { useColorClasses } from "../../theme/useColorClasses";
import { SquarePen, Trash2 } from "lucide-react";


const Cards = ({ brand, onClick=()=>{},handleEdit=()=>{},handleDelete=()=>{} }) => {
 const COLOR_CLASSES = useColorClasses();

  return (
    <div
      key={brand.id}
      onClick={() => onClick(brand)}
      className={`rounded-md  shadow-sm hover:shadow-md transition-all duration-200 border ${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.borderHoverPrimary} flex flex-col items-center p-4 cursor-pointer group`}
    >
            <div className="flex gap-2 justify-end w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e)=>e.stopPropagation()}>
                <button onClick={(e) => { e.stopPropagation(); handleEdit(brand); }}>
                <SquarePen size={18} color="grey" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(brand); }}>
                <Trash2 size={18} color="grey" />
                </button>
            </div>
      <div className="w-20 h-20 mb-4 flex items-center justify-center overflow-hidden">
        
        <img
          src={brand?.media[0]?.path}
          alt={brand.name}
          className="object-contain w-full h-full"
        />
      </div>
      <h3 className={`text-sm font-semibold ${COLOR_CLASSES.textPrimary}text-center ${COLOR_CLASSES.textHoverPrimary}  
        ${FONT_FAMILIES.primary}`}>
        {brand.name}
      </h3>
    </div>
  );
};

export default Cards;
