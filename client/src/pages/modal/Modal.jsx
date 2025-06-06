export default function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} 
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl min-h-[400px] relative"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-2xl text-center font-bold mb-4">Get a Quote</h2>
        {children}
      </div>
    </div>
  );
}
