import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";
import SearchInput from "../../../components/ui/SearchInput";
import Heading from "../../../components/ui/Heading";
import InputField from "../../../components/ui/InputField";
import Popup from "../../../common/Popup";
import api from "../../../constants/api";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/theme";
import Button from "../../../components/ui/Button";
import CustomBreadcrumbs from "../../../common/CustomBreadCrumbs";
import Cards from "../../../common/Cards";
import { toast } from "react-toastify";
import LoadingIndicator from "../../../common/LoadingIndicator";
import { useColorClasses } from "../../../theme/useColorClasses";

export default function Models() {
  const { categoryId, brand, brandId } = useParams();
  const navigate = useNavigate();

  const [models, setModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [form, setForm] = useState({ name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [limit] = useState(10); // constant limit
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const breadcrumbItems = [
    { label: 'Device', path: '/admin/categories' },
    { label: 'Brands', path: `/admin/categories/${categoryId}/brand` },
    { label: 'Models', path: `/admin/categories/${categoryId}/${brand}/${brandId}` },
  ];

  const MODELS = [
    { id: 1, name: "iPhone 13", image_url: "/iphone.png" },
    { id: 2, name: "Galaxy S21", image_url: "/iphone.jpg" },
    { id: 3, name: "Redmi Note 10", image_url: "/iphone.jpg" },
    { id: 4, name: "OnePlus 9", image_url: "/iphone.jpg" },
    { id: 5, name: "Realme 8", image_url: "/iphone.jpg" },
    { id: 6, name: "Oppo Reno 6", image_url: "/iphone.jpg" },
    { id: 7, name: "Vivo V21", image_url: "/iphone.jpg" },
    { id: 8, name: "Moto G60", image_url: "/iphone.jpg" },
    { id: 9, name: "Nokia 5.4", image_url: "/iphone.jpg" },
    { id: 10, name: "Xperia 5 III", image_url: "/iphone.jpg" },
  ];

  const fetchModels = async () => {
    setLoading(true)
    try {
      const limit = 10; 
      const offset = 0;
      const res = await api.admin.getModel(brandId, limit, offset);
      console.log(res, "model response");
      setModels(res); 
    } catch (error) {
      toast.error(error.message)
    }
    finally{
      setLoading(false)
    }
  };

  const handleModelClick = (model) => {
    navigate(`/admin/categories/${categoryId}/${brand}/${brandId}/${model.name}/${model.id}`);
  };

  useEffect(() => {
    fetchModels();
  }, [brandId]);

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
    if (!form.name.trim()) newErrors.name = "Model name is required";
    if (!form.image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("file", form.image);
    formData.append("brand_id", brandId);
    formData.append("category_id", categoryId);

    setLoading(true);
    try {
      const res=await api.admin.createModel(brandId,formData);
      await fetchModels();
      handleClose();
      toast.success(res.message)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false);
    }
  };

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen">
      <LoadingIndicator isLoading={loading}/>
      <div className="flex justify-between items-center mb-6">
       <CustomBreadcrumbs 
        items={breadcrumbItems} 
        separator={<ChevronRight style={{ fontSize: "12px" }} />} 
      />
        <div className="flex gap-3">
          <SearchInput
            placeholder="Search model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="px-4 py-2 text-white text-sm"
            onClick={handleOpen}
            icon={<Plus size={16} />}
          >
            Create Model
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 mx-auto">
        {filteredModels.map((model) => (
          <Cards key={model.id} brand={model} onClick={handleModelClick} />
         
        ))}
      </div>

      <Popup
        open={popupOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Create Model"
        btnCancel="Cancel"
        btnSubmit="Submit"
        isbtnCancel={true}
        isbtnSubmit={true}
        loading={loading}
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <label
              htmlFor="model-image"
              className="w-24 h-24 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Model Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-500">Upload Image</span>
              )}
              <input
                type="file"
                id="model-image"
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
            placeholder="Model name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm text-left" style={{ marginTop: "5px" }}>
              {errors.name}
            </p>
          )}
        </div>
      </Popup>
    </div>
  );
}