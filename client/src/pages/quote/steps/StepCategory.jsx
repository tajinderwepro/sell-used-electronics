import SelectField from "../../../components/ui/SelectField";

export default function StepCategory({ category, setCategory, categories }) {
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = categories.find(cat => cat.id.toString() === selectedValue);
    setCategory({
      value: selectedValue,
      label: selectedOption?.name || ""
    });
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
        value={category.value }
        onChange={handleChange}
        options={categoryOptions}
      />
    </div>
  );
}
