import { useColorClasses } from "../../theme/useColorClasses";

export default function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
  className = '',
  error = ''
}) {
  const COLOR_CLASSES = useColorClasses();

  const baseClass = `
    w-full border rounded-lg p-3 transition-all duration-300
    ${COLOR_CLASSES.textHoverPrimary}
    placeholder-${COLOR_CLASSES.primaryBgHover}
     ${COLOR_CLASSES.bgWhite}
    focus:outline-none focus:ring-2
    ${error ? 'border-red-500 ring-red-300 focus:border-red-500 focus:ring-red-300' :
      `${COLOR_CLASSES.borderPrimary} focus:ring-${COLOR_CLASSES.primary} focus:border-${COLOR_CLASSES.primary}`}
    ${className}
  `;

  return (
    <div className="mb-4 transition-all duration-300">
      {label && (
        <label
          htmlFor={id}
          className={`block mb-2 ${COLOR_CLASSES.primary} font-semibold text-left`}
        >
          {label}
        </label>
      )}

      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className={baseClass}
      >
        <option value="">Select {id}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Animated error message */}
      <div
        className={`text-left text-red-500 text-sm mt-1 transition-all duration-300 transform ${
          error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 h-0'
        }`}
      >
        {error || <>&nbsp;</>}
      </div>
    </div>
  );
}
