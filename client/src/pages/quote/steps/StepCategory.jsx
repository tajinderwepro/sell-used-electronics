import SelectField from "../../../components/ui/SelectField";

export default function StepCategory({ category, setCategory, categories }) {
  const handleChange = (e) => {
    setCategory(e.target.value);
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.name,
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
