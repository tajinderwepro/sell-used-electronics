import { useEffect, useState } from "react";
import InputField from "../../../components/ui/InputField";
import { useColorClasses } from "../../../theme/useColorClasses";
import { formatCurrency } from "../../../components/common/formatCurrency";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function StepBasePrice({ price, setPrice, errors, setErrors, loading }) {
  const [displayValue, setDisplayValue] = useState('');
  const COLOR_CLASSES = useColorClasses();

  const inputBaseClasses = `
    ${
      errors?.base_price
        ? 'border-red-500 ring-red-300 focus:border-red-500 focus:ring-red-300'
        : COLOR_CLASSES.borderPrimary + ' focus:ring-' + COLOR_CLASSES.primaryBg + ' focus:border-' + COLOR_CLASSES.primary
    }
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

      {/* Calculating spinner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4"
            >
              <div className={`w-8 h-8 border-4 ${COLOR_CLASSES.borderPrimary} border-t-transparent rounded-full animate-spin`} />
              <div className={`text-sm font-medium text-gray-700 tracking-wide`}>
                Calculating the best estimate...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
