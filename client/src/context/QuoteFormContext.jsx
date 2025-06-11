import React, { createContext, useContext, useState } from 'react';

const QuoteFormContext = createContext();

const defaultState = {
  step: 0,
  category: '',
  model: '',
  condition: '',
  price: '',
};

export const QuoteFormProvider = ({ children }) => {
  const [formState, setFormState] = useState(defaultState);

  const updateForm = (updates) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormState(defaultState);
  };

  return (
    <QuoteFormContext.Provider value={{ formState, updateForm, resetForm }}>
      {children}
    </QuoteFormContext.Provider>
  );
};

export const useQuoteForm = () => useContext(QuoteFormContext);
