import { useState } from "react";
import { useColorClasses } from "../../theme/useColorClasses";
import { Plus, Save, X } from "lucide-react";
import axios from "axios";
import CustomInputField from "./CustomInputField";

export default function CustomSelectField({
  label,
  id,
  value,
  onChange,
  options,
  setOptions,
  required = false,
  className = '',
  onCustomChange = () => {},
  apiUrl = '',
}) {
  const COLOR_CLASSES = useColorClasses();
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "__custom__") {
      setIsCustom(true);
      setCustomValue("");
      onChange({ target: { name: id, value: "" } });
    } else {
      setIsCustom(false);
      onChange(e);
    }
  };

  const handleCustomInputChange = (e) => {
    setCustomValue(e.target.value);
    onCustomChange({ target: { name: id, value: e.target.value } });
  };

  const handleCreate = async () => {
    if (!customValue.trim()) return;
    try {
      setLoading(true);
      const response = await axios.post(apiUrl, {
        name: customValue,
        type: id, 
      });

      const newOption = {
        label: response.data.name || customValue,
        value: response.data.id,
      };

      setOptions((prev) => [...prev, newOption]);
      onChange({ target: { name: id, value: newOption.value } });
      setIsCustom(false);
      setCustomValue("");
    } catch (error) {
      console.error("Error creating option:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCustom(false);
    setCustomValue("");
  };

  return (
    <div className=" relative">
      <label
        htmlFor={id}
        className={`block mb-2 ${COLOR_CLASSES.primary} font-semibold text-left`}
      >
        {label}
      </label>

      {!isCustom && (
        <select
          id={id}
          name={id}
          value={value}
          onChange={handleSelectChange}
          required={required}
          className={`w-full border ${COLOR_CLASSES.borderPrimary} rounded-lg p-3 ${COLOR_CLASSES.textHoverPrimary} ${COLOR_CLASSES.bgPrimary}
                      focus:outline-none focus:ring-2 ${COLOR_CLASSES.primaryRing} transition ${className}`}
        >
          <option value="" disabled>
            Select {label || id}
          </option>
          {/* <option value="__custom__">➕ Create new...</option> */}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {isCustom && (
        <div className="relative">
          <input
            id={`${id}_custom`}
            type="text"
            name={`${id}_custom`}
            value={customValue}
            onChange={handleCustomInputChange}
            placeholder={`Enter new ${label || id}`}
            required
            className={`w-full border ${COLOR_CLASSES.borderPrimary} rounded-lg p-3 pr-20 
              ${COLOR_CLASSES.textHoverPrimary} ${COLOR_CLASSES.bgPrimary} 
              placeholder-${COLOR_CLASSES.primaryBgHover}
              focus:outline-none focus:ring-2 ${COLOR_CLASSES.primaryRing} 
              focus:ring-${COLOR_CLASSES.primary} focus:border-${COLOR_CLASSES.primary} 
              transition ${className}`}
          />

          {customValue && (
            <div className="absolute right-3 top-2.5 flex gap-2">
              <button
                type="button"
                className="text-green-600 hover:text-green-800"
                onClick={handleCreate}
                disabled={loading}
              >
                <Save size={18} />
              </button>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={handleCancel}
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
