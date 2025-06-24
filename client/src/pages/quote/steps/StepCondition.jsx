import React, { useEffect, useRef, useState, useTransition } from "react";
import { CloudUpload, X, PlusCircle } from "lucide-react";
import { useColorClasses } from "../../../theme/useColorClasses";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import InputField from "../../../components/ui/InputField";
import { CustomStorageSchema, QuoteFormSchema } from "../../../common/Schema";

export default function StepCondition({ condition, setCondition,category }) {
  const fileInputRef = useRef(null);
  const COLOR_CLASSES = useColorClasses();
  const [errors,setErrors]= useState("")

  const [customStorage, setCustomStorage] = useState({ ram: "", rom: "" });
  const [customInputVisible, setCustomInputVisible] = useState(false);

  const conditionOptions = [
    { label: "Excellent", value: "excellent" },
    { label: "Good", value: "good" },
    { label: "Fair", value: "fair" },
    { label: "Bad", value: "bad" },
  ];

  const [storageOptions, setStorageOptions] = useState([
    "4 GB / 64 GB",
    "6 GB / 128 GB",
    "8 GB / 256 GB",
  ]);

  const allowedRAM = [4, 6, 8, 12, 16];
  const allowedROM = [64, 128, 256, 512, 1024];

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
    <div>
      {/* --- Condition Selector --- */}
      <div className="mb-6">
        <label className={`block mb-2 font-semibold ${COLOR_CLASSES.primary}`}>
          Condition
        </label>
        <div className="flex gap-3 flex-wrap">
          {conditionOptions.map((opt) => {
            const isSelected = condition.condition === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleConditionChange(opt.value)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition
                ${
                  isSelected
                    ? `${COLOR_CLASSES.primaryLightBg} ${COLOR_CLASSES.primary} ${COLOR_CLASSES.borderPrimary}`
                    : `bg-white text-gray-700 border-gray-300 hover:${COLOR_CLASSES.borderPrimary}`
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

    {(category.label=="Mobile" || category.label=="mobile" ) &&
    <>
     {/* --- Storage Selector --- */}
      <div className="mb-6">
        <label className={`block mb-2 font-semibold ${COLOR_CLASSES.primary}`}>
          Storage
        </label>
        <div className="flex gap-3 flex-wrap">
          {storageOptions.map((option, index) => {
            const isSelected = condition.storage.includes(option);
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleStorageSelect(option)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition
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
              className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-1 ${COLOR_CLASSES.primaryBg} ${COLOR_CLASSES.borderPrimary} text-white`}
            >
              <PlusCircle className="w-4 h-4" />
              Custom Storage
            </button>
          )}
        </div>

        {/* --- Custom Storage Input --- */}
       {customInputVisible && (
        <div className="flex flex-wrap gap-3 mt-3 items-start">
          <div className="flex flex-col w-32">
            <InputField
              type="number"
              placeholder="RAM"
              value={customStorage.ram}
              onChange={(e) =>
                setCustomStorage({ ...customStorage, ram: e.target.value })
              }
              error={errors.ram}
              className={`py-[8px] px-[16px] rounded-lg border transition-all duration-300 ${COLOR_CLASSES.borderPrimary} ${COLOR_CLASSES.textPrimary} ${COLOR_CLASSES.bgWhite}`}
            />
          </div>

          <div className="flex flex-col w-32">
            <InputField
              type="number"
              placeholder="ROM"
              value={customStorage.rom}
              onChange={(e) =>
                setCustomStorage({ ...customStorage, rom: e.target.value })
              }
              error={errors.rom}
              className={`py-[8px] px-[16px] rounded-lg border transition-all duration-300 ${COLOR_CLASSES.borderPrimary} ${COLOR_CLASSES.textPrimary} ${COLOR_CLASSES.bgWhite}`}
            />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Button
              type="button"
              onClick={addCustomStorage}
              className="py-[8px] px-[16px] text-sm"
            >
              Add
            </Button>
            <Button
              type="button"
              onClick={cancelCustomStorage}
              variant="secondary"
              className="py-[8px] px-[16px] text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      </div>

      {/* --- IMEI Input --- */}
      <div className="mb-6">
        <InputField
          label="IMEI Number"
          type="number"
          placeholder="Enter IMEI Number"
          value={condition.imei || ""}
          onChange={(e) =>
            setCondition({ ...condition, imei: e.target.value })
          }
        />
      </div>
      </>
      }

      {/* --- Image Upload Section --- */}
      <div className="mt-6">
        <label className={`block mb-2 ${COLOR_CLASSES.primary} font-semibold text-left`}>
          Images
        </label>
        <div className="mt-4 flex gap-4 flex-wrap">
          {condition.images.map((img, idx) => (
            <div
              key={idx}
              className="relative group w-28 h-36 rounded-lg border border-gray-300 bg-white flex items-center justify-center overflow-hidden"
            >
              <img
                src={URL.createObjectURL(img)}
                alt={`upload-${idx}`}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 p-1 rounded-full bg-white shadow-md hover:shadow-lg transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
          <div
            className={`w-28 h-36 border-2 border-dashed flex flex-col items-center justify-center rounded-lg cursor-pointer transition hover:bg-gray-50 ${COLOR_CLASSES.borderPrimary}`}
            onClick={() => fileInputRef.current.click()}
          >
            <CloudUpload className="h-6 w-6 text-gray-400 mb-1" />
            <span className={`text-xs font-medium text-gray-600 ${COLOR_CLASSES.primary}`}>
              {condition.images.length > 0 ? "Add More" : "Add Image"}
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
