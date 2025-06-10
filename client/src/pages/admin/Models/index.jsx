import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";
import SearchInput from "../../../components/ui/SearchInput";
import Heading from "../../../components/ui/Heading";
import InputField from "../../../components/ui/InputField";
import Popup from "../../../common/Popup";
import api from "../../../constants/api";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/theme";
import { COLOR_CLASSES_DARK } from "../../../theme/colors";
import Button from "../../../components/ui/Button";
import CustomBreadcrumbs from "../../../common/CustomBreadCrumbs";

export default function Models() {
  const { categoryId,brand,brandId } = useParams();

   const breadcrumbItems = [
    { label: 'Device', path: '/admin/categories' },
    { label: 'Brands', path: `/admin/categories/${categoryId}/brand` }, 
    { label: 'Models', path: `/admin/categories/${categoryId}/${brand}/${brandId}`}, 
   ];
 
  const [models, setModels] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [form, setForm] = useState({ name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
 
    const MODELS = [
    { id: 1, name: "Apple", image_url: "/iphone.png" },
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
 
  const fetchBrands = async () => {
    // Replace with actual API call
    const res = await api.admin.getModel();
    console.log(res,"model response")
    setModels(MODELS);
  };
 
  useEffect(() => {
    fetchBrands();
  }, [categoryId]);
 
  const handleOpen = () => {
    setForm({ name: "", image: null });
    setPreview(null);
    setPopupOpen(true);
  };
 
  const handleClose = () => setPopupOpen(false);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
 
    if (name === "name" && value.trim()) {
      setErrors((prev) => ({ ...prev, name: null }));
    }
  };
 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
 
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: null }));
  };
 
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Brand name is required";
    if (!form.image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async () => {
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("image", form.image);
    formData.append("category_id", categoryId); 
 
    setLoading(true);
    try {
      await api.admin.createBrand(formData);
      await fetchBrands();
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  return (
     <div className="min-h-screen">
     <CustomBreadcrumbs items={breadcrumbItems} separator={<ChevronRight style={{fontSize:"12px"}}/>} />
      <h2 className="text-2xl font-bold mb-6 text-center">SELECT MODEL</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
        {MODELS.map((model) => (
          <div 
            key={model.id} 
            // onClick={() => handleBrandClick(model)}
            className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center"
          >
            <div className="w-20 h-20 mb-3 flex items-center justify-center">
              <img
                src={model.image_url}
                alt={model.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src = '/brand/default.png'; 
                }}
              />
            </div>
            <h3 className="text-center font-medium text-gray-800">{model.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
 