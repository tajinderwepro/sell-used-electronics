import React, { useRef } from "react";
import SelectField from "../../../components/ui/SelectField";
import { X } from "lucide-react";
import { useColorClasses } from "../../../theme/useColorClasses";

export default function StepCondition({ condition, setCondition }) {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setCondition({
      ...condition,
      condition: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setCondition({
      ...condition,
      images: [...condition.images, ...files],
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...condition.images];
    updatedImages.splice(index, 1);
    setCondition({
      ...condition,
      images: updatedImages,
    });
  };

  const conditionOptions = [
    { label: "Excellent", value: "excellent" },
    { label: "Good", value: "good" },
    { label: "Fair", value: "fair" },
    { label: "Bad", value: "bad" },
  ];

  return (
    <div>
      <SelectField
        label="Select Condition"
        id="condition"
        value={condition.condition}
        onChange={handleChange}
        options={conditionOptions}
      />

      {/* Upload Images Section */}
      <div className="mt-6">
        <label
          htmlFor="condition-image"
          className="w-24 h-24 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden mx-auto"
          onClick={() => fileInputRef.current.click()}
        >
          <span className="text-sm text-gray-500">Upload Images</span>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Image Previews */}
        <div className="mt-6 grid grid-cols-3 gap-4 max-h-[200px] overflow-y-auto">
          {condition.images.map((img, idx) => (
            <div
              key={idx}
              className="relative group w-full h-full rounded-lg border border-gray-200 overflow-hidden"
            >
              <img
                src={URL.createObjectURL(img)}
                alt={`upload-${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-0 right-0 m-1 p-1 rounded-full bg-white shadow group-hover:opacity-100 opacity-0 transition-opacity"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
