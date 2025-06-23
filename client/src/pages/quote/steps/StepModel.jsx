import SelectField from "../../../components/ui/SelectField";

export default function StepModel({ model, setModel, brand, category, categories }) {
  const handleChange = (e) => setModel(e.target.value);

  const selectedCategory = categories.find((cat) => cat.id === Number(category.value));

  const filteredModels = selectedCategory?.models?.filter((m) => m.brand_id === Number(brand)) || [];

  const modelOptions = filteredModels.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  return (
    <div>
      <SelectField
        label="Select Model"
        id="model"
        value={model}
        onChange={handleChange}
        options={modelOptions}
      />
    </div>
  );
}
