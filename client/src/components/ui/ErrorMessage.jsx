// components/ui/ErrorMessage.jsx
export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p className="text-red-600 text-center mb-6 font-medium animate-pulse">
      {message}
    </p>
  );
}
