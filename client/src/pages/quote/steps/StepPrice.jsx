export default function StepPrice({ price, onBack, onSubmit }) {
  return (
    <div className="text-center">
      <p className="text-lg font-medium mb-4">Estimated Price:</p>
      <p className="text-3xl font-bold text-green-600 mb-6">${price}</p>
    </div>
  );
}
