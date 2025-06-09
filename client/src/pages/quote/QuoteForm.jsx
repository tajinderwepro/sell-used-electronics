import React, { useState } from 'react';
import StepCategory from './steps/StepCategory';
import StepModel from './steps/StepModel';
import StepCondition from './steps/StepCondition';
import StepPrice from './steps/StepPrice';
import Button from '../../components/ui/Button';
import { FONT_WEIGHTS } from '../../constants/theme';
import { useColorClasses } from '../../theme/useColorClasses';
import Stepper from '../../components/common/Stepper';

const data = {
  Mobiles: {
    iPhone: { condition: { New: 1000, Used: 800 } },
    Samsung: { condition: { New: 800, Refurbished: 600 } },
    Redmi: { condition: { New: 300, Used: 200 } },
    Motorola: { condition: { New: 400, Refurbished: 250 } },
  },
  Laptops: {
    Acer: { condition: { New: 15000, Used: 10000 } },
    Mac: { condition: { Used: 17000 } },
    Asus: { condition: { New: 11000, Used: 8000 } },
    Hp: { condition: { Used: 17000 } },
  },
};

export default function QuoteForm({ onClose }) {
  const COLOR_CLASSES = useColorClasses();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const stepConstant = ['Category', 'Model', 'Condition', 'Price'];

  const handleSubmit = () => {
    alert(`Submitted: ${category} > ${model} > ${condition} > $${price}`);
    if (onClose) onClose();
  };

  const steps = [
    <StepCategory category={category} setCategory={setCategory} data={data} />,
    <StepModel model={model} setModel={setModel} data={data} category={category} />,
    <StepCondition
      condition={condition}
      setCondition={setCondition}
      setPrice={setPrice}
      data={data}
      category={category}
      model={model}
    />,
    <StepPrice price={price} />,
  ];

  const handlePrimaryAction = () => {
    if (step === steps.length - 1) {
      handleSubmit();
    } else {
      handleNext();
    }
  };

  const isNextDisabled = () => {
    if (step === 0) return !category;
    if (step === 1) return !model;
    if (step === 2) return !condition;
    return false;
  };

  return (
    <div className={`mx-auto ${COLOR_CLASSES.bgWhite} p-10 rounded-2xl w-full max-w-3xl`}>
      <div className="mb-10">
        <div className={`flex justify-between items-center text-sm ${FONT_WEIGHTS.semibold} ${COLOR_CLASSES.textSecondary} relative`}>
          <Stepper
            steps={stepConstant}
            currentStep={step}
          />
         <div className="absolute top-4 left-[12.5%] w-[75%] h-1 bg-gray-200 rounded">
          <div
            className={`${COLOR_CLASSES.primaryBg} h-1 rounded transition-all duration-500`}
            style={{ width: `${(step / 3) * 100}%` }} 
          />
        </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[140px]">{steps[step]}</div>

      {/* Controls */}
      <div className="pt-10 flex justify-center items-center gap-4">
        {step === 0 ? (
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="px-6 py-2 shadow"
          >
            Cancel
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleBack}
            variant="secondary"
            className="px-6 py-2 shadow"
          >
            Back
          </Button>
        )}

        <Button
          type="button"
          onClick={handlePrimaryAction}
          disabled={isNextDisabled()}
          variant="primary"
          className="px-6 py-2 shadow disabled:opacity-50"
        >
          {step === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
