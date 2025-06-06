// components/ui/Button.jsx
export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-indigo-700
                  active:scale-95 transform transition duration-150 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
