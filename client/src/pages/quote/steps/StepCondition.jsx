import SelectField from "../../../components/ui/SelectField";

export default function StepCondition({ condition, setCondition }) {
  const handleChange = (e) => {
    setCondition(e.target.value);
  };

  const conditionOptions = [
    { value: "good", label: "Good" },
    { value: "bad", label: "Bad" },
    { value: "excellent", label: "Excellent" },
  ];

  return (
    <div>
      <SelectField
        label="Select Condition"
        id="condition"
        value={condition}
        onChange={handleChange}
        options={conditionOptions}
      />
    </div>
  );
}
