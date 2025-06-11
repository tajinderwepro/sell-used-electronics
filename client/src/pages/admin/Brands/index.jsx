import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ChevronRight, Plus } from "lucide-react";
import SearchInput from "../../../components/ui/SearchInput";
import Heading from "../../../components/ui/Heading";
import InputField from "../../../components/ui/InputField";
import Popup from "../../../common/Popup";
import api from "../../../constants/api";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/theme";
import { COLOR_CLASSES_DARK } from "../../../theme/colors";
import Button from "../../../components/ui/Button";
import CustomBreadcrumbs from "../../../common/CustomBreadCrumbs";
import Cards from "../../../common/Cards";
import { toast } from "react-toastify";
import LoadingIndicator from "../../../common/LoadingIndicator";

export default function Brands() {
  const { categoryId } = useParams();

  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [form, setForm] = useState({ name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate= useNavigate();

   const breadcrumbItems = [
    { label: 'Category', path: '/admin/categories' },
    { label: 'Brands', path: `/admin/categories/${categoryId}/brand` }, 
  ];

  const fetchBrands = async () => {
    setLoading(true)
    try {
      const limit = 10; 
      const offset = 0;
      const res = await api.admin.getBrand(categoryId, limit, offset);
       setBrands(res || []);
    } catch (error) {
      toast.error(error.message)
    }
    finally{
      setLoading(false)
    }
  };
  

  const handleBrandClick = (brand) => {
    navigate(`/admin/categories/${categoryId}/${brand.name}/${brand.id}`);
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
    formData.append("file", form.image);
    formData.append("category_id", categoryId);
    setLoading(true);
    try {
      const res=await api.admin.addBrand(categoryId,formData);
      await fetchBrands();
      handleClose();
      toast.success(res.message)
    } catch (err) {
      console.error(err);
      toast.error(err.message)
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <LoadingIndicator isLoading={loading}/>
      <div className="flex justify-between items-center mb-6">
      <CustomBreadcrumbs items={breadcrumbItems} separator={<ChevronRight style={{fontSize:"12px"}}/>} key={""}/>
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
           <Cards key={brand.id} brand={brand} onClick={handleBrandClick} />
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
            <p className="text-red-500 text-sm text-left" style={{marginTop:"5px"}}>{errors.name}</p>
          )}
        </div>
      </Popup>
    </div>
  );
}
