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
        className="w-full border border-indigo-300 rounded-md px-4 py-3 text-indigo-900 placeholder-indigo-400
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 transition"
      />
    </div>
  );
}
