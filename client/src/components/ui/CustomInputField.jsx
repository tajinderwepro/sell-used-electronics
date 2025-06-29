import { useColorClasses } from "../../theme/useColorClasses";


export default function CustomInputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = ''
}) {
  const COLOR_CLASSES = useColorClasses();


  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className={`block mb-2 ${COLOR_CLASSES.primary} font-semibold`}
      >
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
        className={`w-full border ${COLOR_CLASSES.borderPrimary} rounded-lg p-3 
                    ${COLOR_CLASSES.textHoverPrimary} ${COLOR_CLASSES.bgPrimary} 
                    placeholder-${COLOR_CLASSES.primaryBgHover}
                    focus:outline-none focus:ring-2 ${COLOR_CLASSES.primaryRing} 
                    focus:ring-${COLOR_CLASSES.primary} focus:border-${COLOR_CLASSES.primary} 
                    transition ${className}`}
      />
    </div>
  );
}
