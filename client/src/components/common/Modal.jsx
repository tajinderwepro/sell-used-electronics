import { COLOR_CLASSES, FONT_SIZES, FONT_WEIGHTS } from '../../constants/theme';

export default function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg ${COLOR_CLASSES.shadowMd} p-6 w-full max-w-3xl min-h-[400px] relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-2 right-3 text-gray-500 hover:text-gray-800 ${FONT_SIZES['3xl']} ${FONT_WEIGHTS.bold}`}
          aria-label="Close modal"
        >
          &times;
        </button>
        {title && (
          <h2
            className={`text-center mb-10 ${FONT_SIZES['3xl']} ${FONT_WEIGHTS.bold} ${COLOR_CLASSES.primaryDark}`}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
