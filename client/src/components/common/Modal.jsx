import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/theme';
import { useColorClasses } from '../../theme/useColorClasses';

export default function Modal({ title, children, onClose, customWidth = false }) {
  const COLOR_CLASSES = useColorClasses();

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-2">
      <div
        className={`relative w-full max-w-3xl ${customWidth ? 'w-[95%]' : ''} 
        bg-white rounded-2xl shadow-xl border ${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.shadowMd} ${COLOR_CLASSES.bgGradient}  overflow-hidden h-[600px] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 z-10">
          <h2 className={`${FONT_SIZES['2xl']} ${FONT_WEIGHTS.semibold} ${COLOR_CLASSES.primaryDark}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Scrollable content */}
        <div className={`${FONT_WEIGHTS.bold} ${COLOR_CLASSES.primaryDark} flex-1 px-6 py-4`}>
          {children}
        </div>
      </div>
    </div>
  );
}
