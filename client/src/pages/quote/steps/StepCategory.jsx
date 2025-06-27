import React from "react";
import { useColorClasses } from "../../../theme/useColorClasses";

export default function StepCategory({ category, setCategory, categories }) {
  const COLOR_CLASSES = useColorClasses();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat) => {
        const isSelected = category?.value === cat.id.toString();
        return (
          <div
            key={cat.id}
            onClick={() => setCategory({ value: cat.id.toString(), label: cat.name })}
            className={`cursor-pointer p-4 rounded-xl border ${COLOR_CLASSES.borderHoverPrimary} ${
                  isSelected ? COLOR_CLASSES.borderPrimary : 'border-gray-200'
                } hover:shadow-lg`}
            >
            <img
              src={cat.media?.[0]?.path}
              alt={cat.name}
              className="w-full h-32 object-contain mb-2"
            />
            <p className="text-center font-medium">{cat.name}</p>
          </div>
        );
      })}
    </div>
  );
}
