import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Popup from "../../../common/Popup";
import InputField from "../../../components/ui/InputField";
import api from "../../../constants/api";
import { Link } from "react-router-dom";
import Heading from "../../../components/ui/Heading";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/theme";
import { PROJECT_NAME } from "../../../constants";
import Button from "../../../components/ui/Button";
import SearchInput from "../../../components/ui/SearchInput";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [form, setForm] = useState({ name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const CATEGORIES = [
  {
    id: 1,
    name: "Mobile Phones",
    image_url: "/iphone.jpg", 
  },
  {
    id: 2,
    name: "Laptops",
    image_url: "/iphone.jpg",
  },
  {
    id: 3,
    name: "Tablets",
    image_url: "/apple.png",
  },
  {
    id: 4,
    name: "Accessories",
    image_url: "/iphone.jpg",
  },
  {
    id: 5,
    name: "Cameras",
    image_url: "/iphone.jpg",
  },
];

  const fetchCategories = async () => {
    setLoading(true); 
    try {
      const res = await api.admin.getCategories();
      setCategories(res || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false); 
    }
  };


  useEffect(() => {
    fetchCategories();
  }, []);

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
    if (!form.name.trim()) newErrors.name = "Category name is required";
    if (!form.image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append("name", form.name);
     if (form.image instanceof File) {
      formData.append("file", form.image);
    }
    setLoading(true);
    try {
      await api.admin.createCategory(formData);
      await fetchCategories();
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between mb-6">
        
          <Heading className={`${FONT_SIZES.xl} ${FONT_WEIGHTS.bold}`}>
            SELECT CATEGORY
          </Heading>
          <div className="flex gap-3">
          
          <SearchInput
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="px-4 py-2 text-white text-sm"
            onClick={handleOpen}
            icon={<Plus size={16} />}
          >
            Create Category
          </Button>
        </div>
      </div>


      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredCategories.map((cat) => (
          <Link
            to={`/admin/categories/${cat.id}/brand`}
            key={cat.id}
            className="border p-4 rounded shadow bg-white hover:shadow-lg transition"
          >
            <div className="w-full h-40 flex items-center justify-center overflow-hidden  mb-2 ">
              <img
                src={`/storage/${cat.image_url}`}
                alt={cat.name}
                className="object-contain w-full h-full bg-transparent"
              />
            </div>
            <h3 className="text-lg font-semibold text-center">{cat.name}</h3>
          </Link>
        ))}
      </div>

      {/* Popup */}
      <Popup
        open={popupOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Create Category"
        btnCancel="Cancel"
        btnSubmit="Submit"
        isbtnCancel={true}
        isbtnSubmit={true}
        loading={loading}
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <label
              htmlFor="category-image"
              className="w-24 h-24 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Category Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-500">Upload Image</span>
              )}
              <input
                type="file"
                id="category-image"
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
            placeholder="Category name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm text-left " style={{marginTop:"5px"}}>{errors.name}</p>
          )}
        </div>
      </Popup>
    </div>
  );
}
