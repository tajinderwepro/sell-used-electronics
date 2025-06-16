import SelectField from "../../../components/ui/SelectField";

export default function StepCondition({ condition, setCondition }) {
  const handleChange = (e) => {
    setCondition(e.target.value);
  };

  const conditionOptions = [
    { label: "Excellent", value: "excellent" },
    { label: "Good", value: "good" },
    { label: "Fair", value: "fair" },
    { label: "Bad", value: "bad" },           
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
