import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import SearchInput from "../../../components/ui/SearchInput";
import Heading from "../../../components/ui/Heading";
import InputField from "../../../components/ui/InputField";
import Popup from "../../../common/Popup";
import api from "../../../constants/api";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/theme";
import { COLOR_CLASSES_DARK } from "../../../theme/colors";
import Button from "../../../components/ui/Button";

export default function Brands() {
  const { categoryId } = useParams();

  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [form, setForm] = useState({ name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const MOBILE_BRANDS = [
    { id: 1, name: "Apple", image_url: "/apple.png" },
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
    // const res = await api.admin.getBrands(categoryId);
    // setBrands(res.brands || []);
    setBrands(MOBILE_BRANDS);
  };

  useEffect(() => {
    fetchBrands();
  }, [categoryId]);

  const handleOpen = () => {
    setForm({ name: "", image: null });
    setPreview(null);
    setPopupOpen(true);
  };

  const handleClose = () => {
    setPopupOpen(false);
    setErrors({});
  };

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

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-[4.5rem]">
        <Heading className={`${FONT_SIZES["2xl"]} ${FONT_WEIGHTS.bold}`}>
          SELL OLD MOBILE PHONES
        </Heading>
        
      </div>

      <div className="flex justify-between items-center mb-3">
        <Heading className={`${FONT_SIZES.xl} ${FONT_WEIGHTS.bold}`}>
          SELECT BRAND
        </Heading>
        <div className="flex gap-3">
          
          <SearchInput
            placeholder="Search brand..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <Button
          className="px-4 py-2 text-white text-sm"
          onClick={handleOpen}
          icon={<Plus size={16} />}
          >
            Create Brand
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 mx-auto">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 flex flex-col items-center p-4"
          >
            <div className="w-20 h-20 mb-4 flex items-center justify-center overflow-hidden">
              <img
                src={brand.image_url}
                alt={brand.name}
                className="object-contain w-full h-full"
                onError={(e) => {
                  e.target.src = "/brands/default.png";
                }}
              />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 text-center">
              {brand.name}
            </h3>
          </div>
        ))}
      </div>

      <Popup
        open={popupOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Create Brand"
        btnCancel="Cancel"
        btnSubmit="Submit"
        isbtnCancel={true}
        isbtnSubmit={true}
        loading={loading}
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <label
              htmlFor="brand-image"
              className="w-24 h-24 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Brand Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-500">Upload Image</span>
              )}
              <input
                type="file"
                id="brand-image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {errors.image && (
              <p className="text-red-500 text-sm text-center mt-1">
                {errors.image}
              </p>
            )}
          </div>

          <InputField
            id="name"
            name="name"
            placeholder="Brand name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm text-left">{errors.name}</p>
          )}
        </div>
      </Popup>
    </div>
  );
}
