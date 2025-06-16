import {  FONT_SIZES, FONT_WEIGHTS } from '../../constants/theme';
import { useColorClasses } from '../../theme/useColorClasses';

export default function Modal({ title, children, onClose,customWidth=false }) {
    const COLOR_CLASSES = useColorClasses();
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={` w-full ${customWidth ? 'w-[95%]' : ''} border ${COLOR_CLASSES.borderGray200} rounded-lg ${COLOR_CLASSES.shadowMd} ${COLOR_CLASSES.bgGradient} p-6 max-w-3xl min-h-[400px] relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-2 right-3 ${FONT_SIZES['3xl']} ${FONT_WEIGHTS.bold}`}
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
