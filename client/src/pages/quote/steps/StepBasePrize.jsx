import InputField from "../../../components/ui/InputField";

export default function StepBasePrice({ price, setPrice }) {
  const handleChange = (e) => {
    setPrice(e.target.value);
  };

  return (
    <div className="text-center">
      {/* <p className="text-lg font-medium mb-4">Base Price:</p> */}
      <InputField
        label="Base Price"
        id="base_price"
        type="text"
        placeholder="Enter base price"
        value={price}
        onChange={handleChange}
        required
      />
    </div>
  );
}
