import { useColorClasses } from "../../theme/useColorClasses";
import { FONT_WEIGHTS } from '../../constants/theme';

const Stepper = ({
  steps = [],
  currentStep = 0,
}) => {
  const COLOR_CLASSES = useColorClasses();
  const percent = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center w-full">
        {steps.map((label, index) => (
          <div key={label} className="flex-1 text-center z-10">
            <div
              className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center ${COLOR_CLASSES.shadowMd} font-bold text-sm transition-all duration-300
                ${
                  currentStep >= index
                    ? `${COLOR_CLASSES.primaryBg} text-white`
                    : `bg-gray-300 text-gray-800`
                }`}
            >
              {index + 1}
            </div>
            <div
              className={`hidden md:block mt-2 ${
                currentStep === index
                  ? `${COLOR_CLASSES.primaryDark} ${FONT_WEIGHTS.semibold}`
                  : ""
              }`}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
