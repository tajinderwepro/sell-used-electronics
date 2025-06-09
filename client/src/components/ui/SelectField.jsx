import { useColorClasses } from "../../theme/useColorClasses";

export default function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
  className = '',
}) {
  const COLOR_CLASSES = useColorClasses();
  return (
    <div className="mb-6">
      {/* Label with theme color */}
      <label
        htmlFor={id}
        className={`block mb-2 ${COLOR_CLASSES.primary} font-semibold`}
      >
        {label}
      </label>

      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border ${COLOR_CLASSES.borderPrimary} rounded-lg p-3 ${COLOR_CLASSES.textHoverPrimary} ${COLOR_CLASSES.bgPrimary} placeholder-${COLOR_CLASSES.primaryBgHover}
                    focus:outline-none focus:ring-2 ${COLOR_CLASSES.primaryRing} focus:ring-${COLOR_CLASSES.primary} focus:border-${COLOR_CLASSES.primary} transition ${className}`}
      >
        <option selected>Select {id}</option>
        {options.map((option, index) => (
          <>
          <option key={index} value={option.value}>
            {option.label}
          </option>
          </>
        ))}
      </select>
    </div>
  );
}
