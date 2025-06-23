import { useEffect, useState } from "react";
import InputField from "../../../components/ui/InputField";
import { useColorClasses } from "../../../theme/useColorClasses";
import { formatCurrency } from "../../../components/common/formatCurrency";
import LoadingIndicator from "../../../common/LoadingIndicator";

export default function StepBasePrice({ price, setPrice,errors,setErrors }) {
  const [displayValue, setDisplayValue] = useState('');
  const COLOR_CLASSES = useColorClasses();

  const inputBaseClasses = `
  ${errors?.base_price ? 'border-red-500 ring-red-300 focus:border-red-500 focus:ring-red-300' : COLOR_CLASSES.borderPrimary + ' focus:ring-' + COLOR_CLASSES.primaryBg + ' focus:border-' + COLOR_CLASSES.primary}
  `;

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setPrice(raw);
    setDisplayValue(formatCurrency(raw)); 
     setErrors((prev) => ({
        ...prev,
        ['base_price']: "",
      }));
  };

  useEffect(() => {
    setDisplayValue(formatCurrency(price));
  }, [price]);

  return (
    <div className="text-center relative">
      <InputField
        label="Base Price"
        id="base_price"
        type="text"
        placeholder="Enter base price"
        value={displayValue}
        className={inputBaseClasses}
        onChange={handleChange}
        required
      />
      {/* Animated error message */}
      <div
        className={`absolute bottom-[-20px] text-left text-red-500 text-sm mt-1 transition-all duration-300 transform ${
          errors?.base_price ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 h-0'
        }`}
      >
        {errors?.base_price || <>&nbsp;</>}
      </div>
    </div>
  );
}
