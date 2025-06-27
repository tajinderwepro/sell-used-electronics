import { useColorClasses } from "../../../theme/useColorClasses";

export default function StepModel({ model, setModel, category, brand, categories }) {
  const selectedCategory = categories.find(cat => cat.id.toString() === category?.value);
  const models = selectedCategory?.models.filter(m => m.brand_id.toString() === brand) || [];
  const COLOR_CLASSES = useColorClasses();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {models.map((m) => {
        const isSelected = model === m.id.toString();
        return (
          <div
            key={m.id}
            onClick={() => setModel(m.id.toString())}
            className={`cursor-pointer p-4 rounded-xl border ${COLOR_CLASSES.borderHoverPrimary} ${
              isSelected ? COLOR_CLASSES.borderPrimary : 'border-gray-200'
            } hover:shadow-lg`}
          >
            <img
              src={m.media?.[0]?.path}
              alt={m.name}
              className="w-full h-32 object-contain mb-2"
            />
            <p className="text-center font-medium">{m.name}</p>
          </div>
        );
      })}
    </div>
  );
}
