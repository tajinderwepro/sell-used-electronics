import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ChevronRight, Plus, CircleHelp } from "lucide-react";
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
import { useColorClasses } from "../../../theme/useColorClasses";
import { categorySchema } from "../../../common/Schema";

export default function Brands() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [popupOpen, setPopupOpen] = useState({ open: false, type: "", id: "" });
  const [form, setForm] = useState({ name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [limit] = useState(10); // constant limit
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const breadcrumbItems = [
    { label: 'Category', path: '/admin/devices/categories' },
    { label: 'Brands', path: `/admin/devices/categories/${categoryId}/brand` },
  ];

  const fetchBrands = async (currentOffset = 0, append = false) => {
    setLoading(true);
    try {
      const res = await api.admin.getBrand(categoryId, limit, currentOffset);
      if (res.success) {
        setBrands((prev) => append ? [...prev, ...res.data] : res.data);
        setHasMore(res.data.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchBrands(newOffset, true);
  };

  const handleBrandClick = (brand) => {
    navigate(`/admin/devices/categories/${categoryId}/${brand.name}/${brand.id}`);
  };

  useEffect(() => {
    fetchBrands(0);
  }, [categoryId]);

  const handleOpen = () => {
    setForm({ name: "", image: null });
    setPreview(null);
    setErrors({});
    setPopupOpen({ open: true, type: "create" });
  };

  const handleEdit = (brand) => {
    setForm({ name: brand.name, image: brand.media?.[0]?.path || null });
    setPreview(brand.media?.[0]?.path || null);
    setErrors({});
    setPopupOpen({ open: true, type: "edit", id: brand.id });
  };

  const handleDelete = (brand) => {
    setPopupOpen({ open: true, type: "delete", id: brand.id });
  };

  const handleClose = () => {
    setPopupOpen({ open: false, type: "", id: "" });
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

  const validateForm = async () => {
    try {
      await categorySchema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (popupOpen.type === "delete") {
      try {
        setLoading(true);
        const res = await api.admin.deleteBrand(popupOpen.id);
        if (res.success) {
          toast.success(res.message);
          fetchBrands();
        } else {
          toast.error(res.message);
        }
        handleClose();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!(await validateForm())) return;

    console.log(validateForm(),"validateForm()")
    const formData = new FormData();
    formData.append("name", form.name);
    if (form.image instanceof File) {
      formData.append("file", form.image);
    }
    formData.append("category_id", categoryId);

    setLoading(true);
    try {
      let res;
      if (popupOpen.type === "edit") {
        res = await api.admin.editBrand(popupOpen.id, formData);
      } else {
        res = await api.admin.addBrand(categoryId, formData);
      }

      if (res.success) {
        toast.success(res.message);
        fetchBrands();
        handleClose();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <LoadingIndicator isLoading={loading} />
      <div className="flex justify-between items-center mb-6">
        <CustomBreadcrumbs items={breadcrumbItems} separator={<ChevronRight style={{ fontSize: "12px" }} />} />
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
          <Cards
            key={brand.id}
            brand={brand}
            onClick={handleBrandClick}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      {hasMore && brands.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleLoadMore}
            className="px-6 py-2 text-sm"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
      {(brands.length == 0 && !loading) && <div className="flex justify-center items-center h-[50vh]">No Brands Available!</div>}

      <Popup
        open={popupOpen.open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title={
          popupOpen.type === "edit"
            ? "Edit Brand"
            : popupOpen.type === "delete"
              ? "Delete Brand"
              : "Create Brand"
        }
        btnCancel="Cancel"
        btnSubmit={popupOpen.type === "delete" ? "Delete" : "Submit"}
        isbtnCancel
        isbtnSubmit
        loading={loading}
      >
        {popupOpen.type === "delete" ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
            <CircleHelp className="w-28 h-28" />
            <p className="text-gray-700 text-sm font-medium">
              Are you sure you want to delete this brand?
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <label
                htmlFor="brand-image"
                className={`w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300
            ${errors.image
                    ? "border border-red-500 ring-1 ring-red-300"
                    : "border border-gray-300 hover:ring-2 hover:ring-blue-200"
                  }`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Brand Preview"
                    className="w-full h-full object-contain"
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
              error={errors.name}
            />
          </div>
        )}
      </Popup>

    </div>
  );
}