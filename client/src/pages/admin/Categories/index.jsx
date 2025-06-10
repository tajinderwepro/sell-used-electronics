import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Popup from "../../../common/Popup";
import InputField from "../../../components/ui/InputField";
import api from "../../../constants/api";
import { Link } from "react-router-dom";
import Heading from "../../../components/ui/Heading";
import { COLOR_CLASSES_DARK } from "../../../theme/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/theme";
import { PROJECT_NAME } from "../../../constants";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [form, setForm] = useState({ name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  

  const fetchCategories = async () => {
    const res = await api.admin.getCategories(); 
    setCategories(res.categories || []);
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error for name on change
    if (name === "name" && value.trim()) {
        setErrors((prev) => ({ ...prev, name: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));

    // Clear image error on file select
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
    if (form.image) formData.append("image", form.image);

    setLoading(true);
    try {
      await api.admin.createCategory(formData);
      await fetchCategories();
      handleClose();
      setErrors({});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    image_url: "/iphone.jpg",
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

  return (
    <div className="p-6">

        <div>
            <Heading
                    className={`${FONT_SIZES.xl} ${FONT_WEIGHTS.bold} ${COLOR_CLASSES_DARK.primary}`}
                >
                  {PROJECT_NAME}
            </Heading>
            <button
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded"
                onClick={handleOpen}
            >
                <Plus size={16} /> Create Category
            </button>
        </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {CATEGORIES.map((cat) => (
        <Link
            // to={`/admin/categories/brands?category=${cat.id}`}
            to={`/admin/categories/brand/${cat.id}`}
            key={cat.id}
            className="border p-4 rounded shadow bg-white hover:shadow-lg transition"
        >
            <img
            src={cat.image_url}
            alt={cat.name}
            className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-semibold text-center">{cat.name}</h3>
        </Link>
        ))}

      </div>

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
          {/* Custom Image Upload */}
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
            <p className="text-red-500 text-sm text-left">{errors.name}</p>
          )}
        </div>
      </Popup>
    </div>
  );
}
