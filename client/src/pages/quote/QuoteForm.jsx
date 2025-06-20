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
import { QuoteFormSchema } from '../../common/Schema';
import { validateFormData } from '../../utils/validateUtils';

export default function QuoteForm({ onClose }) {
  const COLOR_CLASSES = useColorClasses();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const { formState, updateForm, resetForm, categories, setCategories } = useQuoteForm();
  const { step, category, model, conditions, price, brand, estimate_price } = formState;
  const selectedCategoryObj = categories.find(cat => cat.id === Number(category));
  const brands = selectedCategoryObj?.brands || [];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({})

  const handleNext = () => updateForm({ step: step + 1 });
  const handleBack = () => updateForm({ step: step - 1 });

  const stepConstant = ['Category', 'Brand', 'Model', 'Details', 'Base Prize', 'Price'];

  const handleSubmit = async () => {
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }

  try {
    const formData = new FormData();
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("model", model);
      formData.append("base_price", Number(price));
      formData.append("ebay_avg_price", estimate_price);
      formData.append("condition", conditions.condition); 
      formData.append("specifications", JSON.stringify({ value:conditions.storage}));
      formData.append("imei", conditions.imei);
      conditions.images.forEach((img) => {
        formData.append("files", img); 
      });
    setLoading(true);

    const response = await api.public.submit(user.id, formData);

    setLoading(false);

    if (response) {
      toast.success(response.message);
      resetForm();
    }
  } catch (err) {
    setLoading(false);
    toast.error(err?.response?.data?.message || "Something went wrong.");
  }

  if (onClose) onClose();
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
      condition={conditions}
      setCondition={(val) => updateForm({ conditions: val })}
      setPrice={(val) => updateForm({ price: val })}
      category={category}
      model={model}
      brand={formState.brand}
    />,
    <StepBasePrice errors={errors} setErrors={setErrors} price={price} setPrice={(val) => updateForm({ price: val })} />,
    <StepPrice price={estimate_price} />,
  ];

  const handlePrimaryAction = async () => {

    if (step === steps.length - 1) {
      handleSubmit();
    } else {
      if (step === 4) {
        try {
       
          const data = { base_price: price,
           }
          const validationErrors = await validateFormData(data, QuoteFormSchema);
          console.log(validationErrors,'validationErrors')
          if (validationErrors) {
            setErrors(validationErrors);
            toast.error("Please fix the errors.");
            return;
          }

          const payload = {
            // category_id: category,
            // brand_id: brand,
            model_id: model,
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
    if (step === 3) return !(conditions.condition && conditions.images.length > 0 && conditions.storage.length > 0  && conditions.imei);
    return false;
  };

  return (
    <div className="mx-auto px-4 md:px-10 py-8 md:py-10 rounded-xl w-full max-w-3xl">
      <LoadingIndicator isLoading={loading} />

      {/* Stepper */}
      <div className="mb-6 md:mb-10">
        <div className={`relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm md:text-base ${FONT_WEIGHTS.semibold} ${COLOR_CLASSES.textSecondary}`}>
          <Stepper steps={stepConstant} currentStep={step} />
          <div className="absolute top-4 md:top-4 left-[5.5%] w-[88%] h-1 bg-gray-200 rounded">
            <div
              className={`${COLOR_CLASSES.primaryBg} h-1 rounded transition-all duration-500`}
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="md:min-h-[140px] text-sm md:text-base">
        {steps[step]}
      </div>

      {/* Action Buttons */}
      <div className="pt-8 md:pt-10 flex flex-wrap justify-center items-center gap-4">
        {step === 0 ? (
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="px-5 py-2 md:px-6 md:py-2 shadow text-sm md:text-base"
          >
            Cancel
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleBack}
            variant="secondary"
            className="px-5 py-2 md:px-6 md:py-2 shadow text-sm md:text-base"
          >
            Back
          </Button>
        )}

        <Button
          type="button"
          onClick={handlePrimaryAction}
          disabled={isNextDisabled()}
          variant="primary"
          className="px-5 py-2 md:px-6 md:py-2 shadow disabled:opacity-50 text-sm md:text-base"
        >
          {step === steps.length - 1 ? (!isAuthenticated ? 'Login' : 'Submit') : 'Next'}
        </Button>
      </div>
    </div>

  );
}
