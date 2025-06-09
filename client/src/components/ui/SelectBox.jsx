export default function SelectField({
  label,
  id,
  value,
  onChange,
  options = [],
  required = false,
}) {
  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={id} className="block mb-2 text-indigo-800 font-semibold">
          {label}
        </label>
      )}
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-indigo-300 rounded-md px-4 py-3 text-indigo-400 placeholder-indigo-400
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 transition"
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}
