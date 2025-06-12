import React, { useEffect, useState } from 'react';
import StepCategory from './steps/StepCategory';
import StepModel from './steps/StepModel';
import StepCondition from './steps/StepCondition';
import StepPrice from './steps/StepPrice';
import Button from '../../components/ui/Button';
import { FONT_WEIGHTS } from '../../constants/theme';
import { useColorClasses } from '../../theme/useColorClasses';
import Stepper from '../../components/common/Stepper';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuoteForm } from '../../context/QuoteFormContext';
import api from '../../constants/api';
import { toast } from 'react-toastify';
import StepBrand from './steps/StepBrand';
import StepBasePrice from './steps/StepBasePrize';
import LoadingIndicator from "../../common/LoadingIndicator/index"

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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { formState, updateForm, resetForm, categories, setCategories } = useQuoteForm();
  const { step, category, model, condition, price, brand,estimate_price } = formState;
  const selectedCategoryObj = categories.find(cat => cat.id === Number(category));
  const brands = selectedCategoryObj?.brands || [];
  const [loading,setLoading] = useState(false)
  


  const handleNext = () => updateForm({ step: step + 1 });
  const handleBack = () => updateForm({ step: step - 1 });

  const stepConstant = ['Category', 'Brand', 'Model', 'Condition', 'Base Prize', 'Price'];

  const handleSubmit = async() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      try {
        const payload = {
          category,
          brand,
          model,
          condition,
          base_price: Number(price),
          ebay_avg_price: estimate_price
        };
        setLoading(true)
        const response = await api.public.submit(payload);
        setLoading(false);
         if(response){
           toast.success(response.message)
           resetForm();
         }
      } catch (err) {
        setLoading(false)
        toast.error(err?.response?.data?.message);
        return; 
      }
    }
    if (onClose) { onClose(); };
  };

  const fetchCategories = async (currentOffset = 0, append = false) => {
    try {
      const res = await api.getCategories(10, 0);
      if (res.success) {
        setCategories((prev) => append ? [...prev, ...res.data] : res.data);
      } 
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error(err.message);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories()
  }, [])

  const steps = [
    <StepCategory
      category={category}
      setCategory={(val) => {
        updateForm({ category: val, brand: "", model: "" }); 
      }}
      categories={categories}
    />,
    <StepBrand
      brand={brand}
      setBrand={(val) => updateForm({ brand: val })}
      brands={brands}
    />,
    <StepModel
      model={model}
      setModel={(val) => updateForm({ model: val })}
      category={category}
      brand={brand}
      categories={categories}
    />,
    <StepCondition
      condition={condition}
      setCondition={(val) => updateForm({ condition: val })}
      setPrice={(val) => updateForm({ price: val })}
      category={category}
      model={model}
      brand={formState.brand}
    />,
    <StepBasePrice price={price} setPrice={(val) => updateForm({ price: val })} />,
    <StepPrice price={estimate_price} />,
  ];

const handlePrimaryAction = async () => {
  if (step === steps.length - 1) {
    handleSubmit();
  } else {
    if (step === 4) {
      try {
        const payload = {
          // category_id: category,
          // brand_id: brand,
          // model_id: model,
          // condition: condition,
          base_price: Number(price),
        };
        const response = await api.public.getEstimatePrice(payload);
        if (response?.estimated_price) {
          updateForm({ estimate_price: response.estimated_price });
        } else {
          toast.error("Failed to get estimate price");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Error fetching estimate price");
        return; 
      }
    }
    handleNext();
  }
};


  const isNextDisabled = () => {
    if (step === 0) return !category;
    if (step === 1) return !formState.brand;
    if (step === 2) return !model;
    if (step === 2) return !condition;
    return false;
  };

  return (
    <div className={`mx-auto p-10 rounded-2xl w-full max-w-3xl`}>
      <LoadingIndicator  isLoading={loading}/>
      <div className="mb-10">
        <div
          className={`flex justify-between items-center text-sm ${FONT_WEIGHTS.semibold} ${COLOR_CLASSES.textSecondary} relative`}
        >
          <Stepper steps={stepConstant} currentStep={step} />
          <div className="absolute top-4 left-[5.5%] w-[85%] h-1 bg-gray-200 rounded">
            <div
              className={`${COLOR_CLASSES.primaryBg} h-1 rounded transition-all duration-500`}
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[140px]">{steps[step]}</div>

      {/* Controls */}
      <div className="pt-10 flex justify-center items-center gap-4">
        {step === 0 ? (
          <Button type="button" onClick={onClose} variant="secondary" className="px-6 py-2 shadow">
            Cancel
          </Button>
        ) : (
          <Button type="button" onClick={handleBack} variant="secondary" className="px-6 py-2 shadow">
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
          {step === steps.length - 1 ? (!isAuthenticated ? 'Login' : 'Submit') : 'Next'}
        </Button>
      </div>
    </div>
  );
}
