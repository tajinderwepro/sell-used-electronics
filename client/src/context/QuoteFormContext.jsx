import React, { createContext, useContext, useState } from "react";

const QuoteFormContext = createContext();

export const QuoteFormProvider = ({ children }) => {
  const [formState, setFormState] = useState({
    step: 0,
    category: "",
    brand: "",
    model: "",
    conditions: {
      condition:"",
      images:[],
    },
    price: 0,
    estimate_price:''
  });

  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [categories, setCategories] = useState([]); 

  const updateForm = (updates) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormState({
      step: 0,
      category: "",
      brand: "",
      model: "",
      conditions: {
        condition:"",
        images:[],
      },
      price: 0,
    });
    setCategories([]);
  };

  return (
    <QuoteFormContext.Provider
      value={{
        formState,
        updateForm,
        resetForm,
        showQuoteForm,
        setShowQuoteForm,
        categories,
        setCategories,
      }}
    >
      {children}
    </QuoteFormContext.Provider>
  );
};

export const useQuoteForm = () => useContext(QuoteFormContext);
