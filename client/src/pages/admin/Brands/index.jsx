import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Brands() {
  const { categoryId } = useParams();
  
  // Normalized brand list matching your image
   const MOBILE_BRANDS = [
    { id: 1, name: "Apple", image_url: "/iphone.jpg" },
    { id: 2, name: "Samsung", image_url: "/iphone.jpg" },
    { id: 3, name: "Xiaomi", image_url: "/iphone.jpg" },
    { id: 4, name: "OnePlus", image_url: "/iphone.jpg" },
    { id: 5, name: "Realme", image_url: "/iphone.jpg" },
    { id: 6, name: "Oppo", image_url: "/iphone.jpg" },
    { id: 7, name: "Vivo", image_url: "/iphone.jpg" },
    { id: 8, name: "Motorola", image_url: "/iphone.jpg" },
    { id: 9, name: "Nokia", image_url: "/iphone.jpg" },
    { id: 10, name: "Sony", image_url: "/iphone.jpg" },
    { id: 11, name: "Asus", image_url: "/iphone.jpg" },
    { id: 12, name: "Google Pixel", image_url: "/iphone.jpg" },
    { id: 13, name: "Honor", image_url: "/iphone.jpg" },
    { id: 14, name: "Infinix", image_url: "/iphone.jpg" },
    { id: 15, name: "Tecno", image_url: "/iphone.jpg" },
    { id: 16, name: "Lenovo", image_url: "/iphone.jpg" },
    { id: 17, name: "Micromax", image_url: "/iphone.jpg" },
    { id: 18, name: "Lava", image_url: "/iphone.jpg" },
    { id: 19, name: "iQOO", image_url: "/iphone.jpg" },
    { id: 20, name: "Nothing", image_url: "/iphone.jpg" },
  ];

  useEffect(() => {
    console.log("Selected Category ID:", categoryId);
  }, [categoryId]);

  return (
    <div className=" min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">SELECT BRAND</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
        {MOBILE_BRANDS.map((brand) => (
          <div 
            key={brand.id} 
            className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center"
          >
            <div className="w-20 h-20 mb-3 flex items-center justify-center">
              <img
                src={brand.image_url}
                alt={brand.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src = '/brands/default.png'; // Fallback image
                }}
              />
            </div>
            <h3 className="text-center font-medium text-gray-800">{brand.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}