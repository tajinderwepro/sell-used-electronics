import React, { useState } from 'react';

export default function QouteForm({ onClose }) {
  const [category, setCategory] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');

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

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    setModel('');
    setCondition('');
    setPrice('');
  };

  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    setModel(selectedModel);
    setCondition('');
    setPrice('');
  };

  const handleConditionChange = (e) => {
    const selectedCondition = e.target.value;
    setCondition(selectedCondition);
    const priceValue = data[category]?.[model]?.condition?.[selectedCondition] || '';
    setPrice(priceValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category || !model || !condition) {
      alert('Please select category, model, and condition before submitting.');
      return;
    }

    alert(`Submitted: ${category} > ${model} > ${condition} > $${price}`);
    if (onClose) onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-3xl mx-auto bg-white p-6 rounded-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="" disabled>Select Category</option>
            {Object.keys(data).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        {category && (
          <div>
            <label className="block text-sm font-medium mb-1">Model</label>
            <select
              value={model}
              onChange={handleModelChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="" disabled>Select Model</option>
              {Object.keys(data[category]).map((mod) => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>
        )}

        {/* Condition */}
        {model && (
          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select
              value={condition}
              onChange={handleConditionChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="" disabled>Select Condition</option>
              {Object.keys(data[category][model].condition).map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>
        )}

        {/* Price */}
        {condition && price && (
          <div className="flex items-end">
            <div className="text-gray-700 text-lg font-semibold">
              Price: <span className="text-green-600">${price}</span>
            </div>
          </div>
        )}
      </div>

      {/* Submit and Cancel */}
      <div className="pt-8 flex justify-center gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>


    </form>
  );
}
