import SelectField from "../../../components/ui/SelectField";

export default function StepModel({ model, setModel, data, category, onNext, onBack }) {
  const handleChange = (e) => setModel(e.target.value);
  return (
    <div>
      <SelectField
        label="Select Model"
        id="model"
        value={model}
        onChange={handleChange}
        options={Object.keys(data[category]).map((mod) => ({
          value: mod,
          label: mod,
        }))}
      />
    </div>
  );
}
