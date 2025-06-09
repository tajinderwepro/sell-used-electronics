import SelectField from "../../../components/ui/SelectField";

export default function StepCategory({ category, setCategory, data }) {
  const handleChange = (e) =>{console.log("ewfwfewf", e); setCategory(e.target.value)};
  const categoryOptions = Object.keys(data).map((cat) => ({
    value: cat,
    label: cat,
  }));
  return (
    <div>
        <SelectField
          label="Select Category"
          id="category"
          value={category}
          onChange={handleChange}
          options={categoryOptions}
        />
    </div>
  );
}
