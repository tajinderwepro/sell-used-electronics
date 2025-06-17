import { TagIcon } from '@heroicons/react/24/solid'; // Optional icon

export default function StepPrice({ price, onBack, onSubmit }) {
  return (
    <div className="flex justify-center items-center ">
      <div className=" p-6 text-center w-full max-w-md ">
        <div className="flex items-center justify-center mb-2">
          <TagIcon className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Estimated Price</h2>
        </div>
        <p className="text-4xl font-extrabold text-green-600 tracking-tight">${price}</p>
        <p className="text-sm text-gray-500 mt-2">This is your device's best estimated market value</p>
      </div>
    </div>
  );
}
