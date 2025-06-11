import SelectField from "../../../components/ui/SelectField";

export default function StepBrand({ brand, setBrand, brands }) {
  const handleChange = (e) => {
    setBrand(e.target.value);
  };

  const brandOptions = brands.map((b) => ({
    value: b.id.toString(),
    label: b.name,
  }));

  

  return (
    <div>
      <SelectField
        label="Select Brand"
        id="brand"
        value={brand}
        onChange={handleChange}
        options={brandOptions}
      />
    </div>
  );
}
