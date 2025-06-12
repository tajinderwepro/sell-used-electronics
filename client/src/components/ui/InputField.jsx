import { useColorClasses } from "../../theme/useColorClasses";

export default function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  name = '',
  marginBottom = "mb-4",
  isCurrencyFormat = false,
  error = ''
}) {
  const COLOR_CLASSES = useColorClasses();

  const inputBaseClasses = `
    w-full border rounded-lg p-3 placeholder-${COLOR_CLASSES.primaryBgHover}
    focus:outline-none focus:ring-2 transition-all duration-300
    ${isCurrencyFormat ? 'pl-8' : ''}
    ${className}
    ${COLOR_CLASSES.bgWhite}
    ${error ? 'border-red-500 ring-red-300 focus:border-red-500 focus:ring-red-300' : COLOR_CLASSES.borderPrimary + ' focus:ring-' + COLOR_CLASSES.primaryBg + ' focus:border-' + COLOR_CLASSES.primary}
  `;

  return (
    <div className={`${marginBottom} transition-all duration-300`}>
      {label && (
        <label
          htmlFor={id}
          className={`block mb-2 ${COLOR_CLASSES.primary} font-semibold text-left`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {isCurrencyFormat && (
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">$</span>
        )}

        <input
          id={id}
          type={type}
          name={name || id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputBaseClasses}
        />
      </div>

      {/* Error message with transition */}
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
