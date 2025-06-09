import SelectField from "../../../components/ui/SelectField";

export default function StepCondition({ condition, setCondition, setPrice, data, category, model, onNext, onBack }) {
  const handleChange = (e) => {
    const cond = e.target.value;
    setCondition(cond);
    const p = data[category][model].condition[cond];
    setPrice(p);
  };

  return (
    <div>
      <SelectField
        label="Select Condition"
        id="condition"
        value={condition}
        onChange={handleChange}
        options={Object.keys(data[category][model].condition).map((cond) => ({
          value: cond,
          label: cond,
        }))}
      />
    </div>
  );
}
