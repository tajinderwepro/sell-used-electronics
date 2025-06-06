// components/ui/Heading.jsx
export default function Heading({ children, className = '' }) {
  return (
    <h2 className={`text-3xl font-bold text-center text-indigo-600 tracking-wide ${className}`}>
      {children}
    </h2>
  );
}
