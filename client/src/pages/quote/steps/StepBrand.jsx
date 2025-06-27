import { useColorClasses } from "../../../theme/useColorClasses";

export default function StepBrand({ brand, setBrand, brands }) {
  const COLOR_CLASSES = useColorClasses();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {brands.map((b) => {
        const isSelected = brand === b.id.toString();
        return (
          <div
            key={b.id}
            onClick={() => setBrand(b.id.toString())}
            className={`cursor-pointer p-4 rounded-xl border ${COLOR_CLASSES.borderHoverPrimary} ${
              isSelected ? COLOR_CLASSES.borderPrimary : 'border-gray-200'
            } hover:shadow-lg`}
          >
            <img
              src={b.media?.[0]?.path}
              alt={b.name}
              className="w-full h-32 object-contain mb-2"
            />
            <p className="text-center font-medium">{b.name}</p>
          </div>
        );
      })}
    </div>
  );
}
