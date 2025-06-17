import React, { useRef } from "react";
import SelectField from "../../../components/ui/SelectField";
import { CloudUpload, X } from "lucide-react";
import { useColorClasses } from "../../../theme/useColorClasses";

export default function StepCondition({ condition, setCondition }) {
  const fileInputRef = useRef(null);
  const COLOR_CLASSES = useColorClasses()
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
          htmlFor="image"
          className={`block mb-2 ${COLOR_CLASSES.primary} font-semibold text-left`}
        >
          Images
        </label>

        <div className={`mt-4 flex gap-4 flex-wrap`}>
          {condition.images.map((img, idx) => (
            <div
              key={idx}
              className="relative group w-28 h-27 rounded-lg border border-gray-200 overflow-hidden"
            >
              <img
                src={URL.createObjectURL(img)}
                alt={`upload-${idx}`}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 p-1 rounded-full bg-white shadow group-hover:opacity-100 opacity-0 transition-opacity"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}

          {/* Upload Box */}
          <div
            className={`w-28 h-27 border-2 border-dashed bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition hover:bg-gray-100 shadow-sm rounded-lg ${COLOR_CLASSES.borderPrimary}`}
            onClick={() => fileInputRef.current.click()}
          >
            <CloudUpload className="h-6 w-6 text-gray-500 mb-1" />
            <span className={`text-xs text-gray-600 font-medium ${COLOR_CLASSES.primary}`}>
              {condition.images.length > 0 ? 'Add More' : 'Add Image'}
            </span>
          </div>
        </div>

        <input
          id="condition-image"
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
