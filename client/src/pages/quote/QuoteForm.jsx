// Full enhanced QuoteForm UI with animated transitions, styled cards, image previews, and step progress

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepCategory from './steps/StepCategory';
import StepBrand from './steps/StepBrand';
import StepModel from './steps/StepModel';
import StepCondition from './steps/StepCondition';
import StepBasePrice from './steps/StepBasePrize';
import StepPrice from './steps/StepPrice';
import Button from '../../components/ui/Button';
import { useColorClasses } from '../../theme/useColorClasses';
import Stepper from '../../components/common/Stepper';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuoteForm } from '../../context/QuoteFormContext';
import api from '../../constants/api';
import { toast } from 'react-toastify';
import LoadingIndicator from '../../common/LoadingIndicator/index';
import { QuoteFormSchema } from '../../common/Schema';
import { validateFormData } from '../../utils/validateUtils';

export default function QuoteForm({ onClose }) {
  const COLOR_CLASSES = useColorClasses();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { formState, updateForm, resetForm, categories, setCategories } = useQuoteForm();
  const { step, category, model, conditions, price, brand, estimate_price } = formState;
  const selectedCategoryObj = categories.find(cat => cat.id === Number(category?.value));
  const brands = selectedCategoryObj?.brands || [];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const stepConstant = ['Category', 'Brand', 'Model', 'Details', 'Base Price', 'Price'];

  const handleNext = () => updateForm({ step: step + 1 });
  const handleBack = () => updateForm({ step: step - 1 });

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('category', category.value);
      formData.append('brand', brand);
      formData.append('model', model);
      formData.append('base_price', Number(price));
      formData.append('ebay_avg_price', estimate_price);
      formData.append('condition', conditions.condition);
      formData.append('specifications', JSON.stringify({ value: conditions.storage }));
      formData.append('imei', conditions.imei);
      conditions.images.forEach(img => formData.append('files', img));
      setLoading(true);
      const response = await api.public.submit(user.id, formData);
      if (response) {
        toast.success(response.message);
        resetForm();
      }
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message || 'Something went wrong.');
    }
    if (onClose) onClose();
  };

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories(10, 0);
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const steps = [
    <StepCategory
      category={category}
      setCategory={val => updateForm({ category: val, brand: '', model: '' })}
      categories={categories}
    />,
    <StepBrand
      brand={brand}
      setBrand={val => updateForm({ brand: val })}
      brands={brands}
    />,
    <StepModel
      model={model}
      setModel={val => updateForm({ model: val })}
      category={category}
      brand={brand}
      categories={categories}
    />,
    <StepCondition
      condition={conditions}
      setCondition={val => updateForm({ conditions: val })}
      category={category}
    />,
    <StepBasePrice
      errors={errors}
      setErrors={setErrors}
      loading={loading}
      price={price}
      setPrice={val => updateForm({ price: val })}
    />,
    <StepPrice price={estimate_price} />,
  ];

  const handlePrimaryAction = async () => {
    if (step === steps.length - 1) {
      handleSubmit();
    } else {
      if (step === 4) {
        setLoading(true);
        try {
          const data = { base_price: price };
          const validationErrors = await validateFormData(data, QuoteFormSchema);
          if (validationErrors) {
            setErrors(validationErrors);
            toast.error('Please fix the errors.');
            return;
          }
          const payload = {
            model_id: model,
            base_price: Number(price),
          };
          const response = await api.public.getEstimatePrice(payload);
          if (response?.estimated_price) {
            updateForm({ estimate_price: response.estimated_price });
          } else {
            toast.error('Failed to get estimate price');
          }
        } catch (err) {
          toast.error(err?.response?.data?.message || 'Error fetching estimate price');
          return;
        } finally {
          setLoading(false);
        }
      }
      handleNext();
    }
  };

  const isNextDisabled = () => {
    if (step === 0) return !category?.value;
    if (step === 1) return !formState.brand;
    if (step === 2) return !model;
    if (step === 3) {
      const isMobile = category.label.toLowerCase() === 'mobile';
      const baseCheck = conditions.condition && conditions.images.length > 0;
      const mobileCheck = isMobile ? conditions.storage.length > 0 && conditions.imei : true;
      return !(baseCheck && mobileCheck);
    }
    return false;
  };

  return (
    <div className="mx-auto px-4 md:px-10 py-8 md:py-10 rounded-xl w-full max-w-3xl relative">
      <LoadingIndicator isLoading={loading && step === steps.length - 1} />

      {/* Stepper */}
      <div className="mb-6 md:mb-10">
        <div className={`relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm md:text-base font-semibold text-gray-500`}>
          <Stepper steps={stepConstant} currentStep={step} />
          <div className="absolute top-4 left-[5.5%] w-[88%] h-1 bg-gray-200 rounded">
            <div
              className={`bg-blue-500 h-1 rounded transition-all duration-500`}
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4 }}
          className="md:min-h-[140px] text-sm md:text-base"
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>

      {/* Buttons */}
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
          className="px-5 py-2 md:px-6 md:py-2 shadow disabled:opacity-50 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white"
        >
          {step === steps.length - 1 ? (!isAuthenticated ? 'Login' : 'Submit') : 'Next'}
        </Button>
      </div>
    </div>
  );
}