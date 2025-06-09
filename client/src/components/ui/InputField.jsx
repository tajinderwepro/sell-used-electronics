import { COLOR_CLASSES } from "../../constants/theme";

// components/ui/InputField.jsx
export default function InputField({ label, id, type = "text", value, onChange, placeholder, required = false }) {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block mb-2 text-indigo-800 font-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border ${COLOR_CLASSES.borderPrimary} rounded-lg p-3 text-${COLOR_CLASSES.primaryBgHover} placeholder-${COLOR_CLASSES.primaryBgHover}
                  focus:outline-none focus:ring-2 ${COLOR_CLASSES.primaryRing} focus:ring-${COLOR_CLASSES.primary} focus:border-${COLOR_CLASSES.primary}`}
      />
    </div>
  );
}
