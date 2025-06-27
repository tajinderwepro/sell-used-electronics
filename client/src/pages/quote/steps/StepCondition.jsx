import React, { useEffect, useRef, useState } from "react";
import { CloudUpload, X, PlusCircle, HeartPulse, Smile, Meh, Frown } from "lucide-react";
import { useColorClasses } from "../../../theme/useColorClasses";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import InputField from "../../../components/ui/InputField";
import { CustomStorageSchema } from "../../../common/Schema";

export default function StepCondition({ condition, setCondition, category }) {
  const fileInputRef = useRef(null);
  const COLOR_CLASSES = useColorClasses();
  const [errors, setErrors] = useState({});

  const [customStorage, setCustomStorage] = useState({ ram: "", rom: "" });
  const [customInputVisible, setCustomInputVisible] = useState(false);

  const conditionOptions = [
    { label: "Excellent", value: "excellent", icon: <HeartPulse className="w-4 h-4" /> },
    { label: "Good", value: "good", icon: <Smile className="w-4 h-4" /> },
    { label: "Fair", value: "fair", icon: <Meh className="w-4 h-4" /> },
    { label: "Bad", value: "bad", icon: <Frown className="w-4 h-4" /> },
  ];

  const [storageOptions, setStorageOptions] = useState([
    "4 GB / 64 GB",
    "6 GB / 128 GB",
    "8 GB / 256 GB",
  ]);

  const handleConditionChange = (val) => {
    setCondition({ ...condition, condition: val });
  };

  const handleStorageSelect = (value) => {
    setCondition({ ...condition, storage: [value] });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setCondition({ ...condition, images: [...condition.images, ...files] });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...condition.images];
    updatedImages.splice(index, 1);
    setCondition({ ...condition, images: updatedImages });
  };

  useEffect(() => {
    const validateLive = async () => {
      try {
        await CustomStorageSchema.validateAt("ram", { ram: customStorage.ram });
        setErrors((prev) => ({ ...prev, ram: undefined }));
      } catch (err) {
        setErrors((prev) => ({ ...prev, ram: err.message }));
      }
    };

    if (customStorage.ram !== "") validateLive();
  }, [customStorage.ram]);

  useEffect(() => {
    const validateLive = async () => {
      try {
        await CustomStorageSchema.validateAt("rom", { rom: customStorage.rom });
        setErrors((prev) => ({ ...prev, rom: undefined }));
      } catch (err) {
        setErrors((prev) => ({ ...prev, rom: err.message }));
      }
    };

    if (customStorage.rom !== "") validateLive();
  }, [customStorage.rom]);

  const addCustomStorage = async () => {
    try {
      await CustomStorageSchema.validate(customStorage, { abortEarly: false });

      const newOption = `${parseInt(customStorage.ram)} GB / ${parseInt(customStorage.rom)} GB`;
      if (!storageOptions.includes(newOption)) {
        setStorageOptions((prev) => [...prev, newOption]);
      }

      setCondition({ ...condition, storage: [newOption] });
      setCustomStorage({ ram: "", rom: "" });
      setErrors({});
      setCustomInputVisible(false);
    } catch (err) {
      const fieldErrors = {};
      if (err.inner) {
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
      }
      setErrors(fieldErrors);
    }
  };

  const cancelCustomStorage = () => {
    setCustomStorage({ ram: "", rom: "" });
    setCustomInputVisible(false);
    setErrors({});
  };

  return (
    <div className="space-y-8">
      {/* --- Condition Selector --- */}
      <div>
        <label className={`block mb-3 font-semibold text-lg ${COLOR_CLASSES.primary}`}>Condition</label>
        <div className="flex gap-3 flex-wrap">
          {conditionOptions.map((opt) => {
            const isSelected = condition.condition === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleConditionChange(opt.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition shadow-md border
                ${
                  isSelected
                    ? `${COLOR_CLASSES.primaryLightBg} ${COLOR_CLASSES.primary} border-2 ${COLOR_CLASSES.borderPrimary}`
                    : `bg-white text-gray-700 border-gray-300 hover:${COLOR_CLASSES.borderPrimary}`
                }`}
              >
                <span className="flex items-center gap-1">
                  {opt.icon}
                  {opt.label}
                </span>

              </button>
            );
          })}
        </div>
      </div>

      {/* --- Storage Section for Mobiles --- */}
      {(category.label?.toLowerCase() === "mobile") && (
        <div>
          <label className={`block mb-3 font-semibold text-lg ${COLOR_CLASSES.primary}`}>Storage</label>
          <div className="flex gap-3 flex-wrap items-start">
            {storageOptions.map((option, index) => {
              const isSelected = condition.storage.includes(option);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleStorageSelect(option)}
                  className={`px-5 py-2 rounded-lg border text-sm font-semibold transition shadow-sm
                    ${
                      isSelected
                        ? `${COLOR_CLASSES.primaryLightBg} ${COLOR_CLASSES.primary} ${COLOR_CLASSES.borderPrimary}`
                        : `bg-white text-gray-700 border-gray-300 hover:${COLOR_CLASSES.borderPrimary}`
                    }`}
                >
                  {option}
                </button>
              );
            })}

            {!customInputVisible && (
              <button
                type="button"
                onClick={() => setCustomInputVisible(true)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 ${COLOR_CLASSES.primaryBg} ${COLOR_CLASSES.borderPrimary} text-white`}
              >
                <PlusCircle className="w-4 h-4" /> Custom
              </button>
            )}
          </div>

          {customInputVisible && (
            <div className="flex flex-wrap gap-3 mt-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
              <InputField
                type="number"
                placeholder="RAM"
                value={customStorage.ram}
                onChange={(e) => setCustomStorage({ ...customStorage, ram: e.target.value })}
                error={errors.ram}
              />
              <InputField
                type="number"
                placeholder="ROM"
                value={customStorage.rom}
                onChange={(e) => setCustomStorage({ ...customStorage, rom: e.target.value })}
                error={errors.rom}
              />
              <div className="flex gap-2">
                <Button onClick={addCustomStorage}>Add</Button>
                <Button onClick={cancelCustomStorage} variant="secondary">Cancel</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- IMEI --- */}
      {(category.label?.toLowerCase() === "mobile") && (
        <InputField
          label="IMEI Number"
          type="number"
          placeholder="Enter IMEI Number"
          value={condition.imei || ""}
          onChange={(e) => setCondition({ ...condition, imei: e.target.value })}
        />
      )}

      {/* --- Images Upload --- */}
      <div>
        <label className={`block mb-3 font-semibold text-lg ${COLOR_CLASSES.primary}`}>Images</label>
        <div className="flex gap-4 flex-wrap">
          {condition.images.map((img, idx) => (
            <div key={idx} className="relative group w-28 h-36 rounded-lg border border-gray-300 bg-white flex items-center justify-center overflow-hidden shadow-sm">
              <img src={URL.createObjectURL(img)} alt={`upload-${idx}`} className="max-w-full max-h-full object-contain" />
              <button onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 p-1 rounded-full bg-white shadow hover:shadow-md">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
          <div
            className={`w-28 h-36 border-2 border-dashed flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-gray-50 ${COLOR_CLASSES.borderPrimary}`}
            onClick={() => fileInputRef.current.click()}
          >
            <CloudUpload className="h-6 w-6 text-gray-400 mb-1" />
            <span className={`text-xs font-medium text-gray-600 ${COLOR_CLASSES.primary}`}>
              {condition.images.length > 0 ? "Add More" : "Add Image"}
            </span>
          </div>
        </div>
        <input
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