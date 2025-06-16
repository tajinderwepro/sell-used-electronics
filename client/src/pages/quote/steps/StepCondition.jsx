import React, { useRef } from "react";
import SelectField from "../../../components/ui/SelectField";
import { SquarePen, Trash2, X } from "lucide-react";
import Button from "../../../components/ui/Button";
import { useColorClasses } from "../../../theme/useColorClasses";

export default function StepCondition({ condition, setCondition }) {
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
      {/* Condition Dropdown */}
      <select
        id="condition"
        value={condition.condition}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Condition</option>
        {conditionOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Upload Images */}
      <div className="mt-4">
        <label className="block font-medium mb-1">Upload Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* Image Previews with Edit/Delete */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          {condition.images.map((img, idx) => (
            <div
              key={idx}
              className="relative group border rounded overflow-hidden"
            >
              <img
                src={URL.createObjectURL(img)}
                alt={`upload-${idx}`}
                className="w-full h-24 object-cover"
              />
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white rounded-full p-1">
                <button onClick={() => handleRemoveImage(idx)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

