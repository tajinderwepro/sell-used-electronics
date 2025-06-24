import { useEffect, useState } from "react";
import { ChevronRight, CircleHelp, Plus } from "lucide-react";
import Popup from "../../../common/Popup";
import InputField from "../../../components/ui/InputField";
import api from "../../../constants/api";
import { Link, useNavigate } from "react-router-dom";
import Heading from "../../../components/ui/Heading";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/theme";
import { PROJECT_NAME } from "../../../constants";
import Button from "../../../components/ui/Button";
import SearchInput from "../../../components/ui/SearchInput";
import { toast } from "react-toastify";
import CustomBreadcrumbs from "../../../common/CustomBreadCrumbs";
import Cards from "../../../common/Cards";
import LoadingIndicator from "../../../common/LoadingIndicator";
import * as Yup from "yup";
import { useColorClasses } from "../../../theme/useColorClasses";
import { categorySchema } from "../../../common/Schema";

const breadcrumbItems = [{ label: "Category", path: "/admin/devices/categories" }];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [popupOpen, setPopupOpen] = useState({ open: false, type: "", id: "" });
  const [form, setForm] = useState({ name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const COLOR_CLASSES = useColorClasses();
    const inputBaseClasses = `
    ${errors.image ? 'border-red-500 ring-red-300 focus:border-red-500 focus:ring-red-300' : COLOR_CLASSES.borderPrimary + ' focus:ring-' + COLOR_CLASSES.primaryBg + ' focus:border-' + COLOR_CLASSES.primary}
  `;


  const fetchCategories = async (currentOffset = 0, append = false) => {
    setLoading(true);
    try {
      const res = await api.getCategories(limit, currentOffset);
      if (res.success) {
        setCategories((prev) => (append ? [...prev, ...res.data] : res.data));
        setHasMore(res.data.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(0);
  }, []);

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchCategories(newOffset, true);
  };

  const handleClose = () => {
    setPopupOpen({ open: false, type: "", id: "" });
    setErrors({});
  };

  const handleOpen = () => {
    setForm({ name: "", image: null });
    setPreview(null);
    setErrors({});
    setPopupOpen({ open: true, type: "create", id: "" });
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, image: cat.media?.[0]?.path || null });
    setPreview(cat.media?.[0]?.path || null);
    setErrors({});
    setPopupOpen({ open: true, type: "edit", id: cat.id });
  };

  const handleDelete = (cat) => {
    setPopupOpen({ open: true, type: "delete", id: cat.id });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
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
        const res = await api.admin.deleteCategory(popupOpen.id);
        if (res.success) {
          toast.success(res.message);
          fetchCategories();
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

    const formData = new FormData();
    formData.append("name", form.name);
    if (form.image instanceof File) {
      formData.append("file", form.image);
    }

    setLoading(true);
    try {
      let res;
      if (popupOpen.type === "edit") {
        res = await api.admin.editCategory(popupOpen.id, formData);
      } else {
        res = await api.admin.createCategory(formData);
      }

      if (res.success) {
        toast.success(res.message);
        fetchCategories();
        handleClose();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (cat) => {
    navigate(`/admin/devices/categories/${cat.id}/brand`);
  };

  return (
    <div className="min-h-screen">
      <LoadingIndicator isLoading={loading} />
      <div className="flex justify-between items-center mb-6">
        <CustomBreadcrumbs items={breadcrumbItems} separator={<ChevronRight size={14} />} />
        <div className="flex gap-3">
          <SearchInput
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleOpen} className="px-4 py-2 text-white text-sm" icon={<Plus size={16} />}>
            Create Category
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 mx-auto">
        {filteredCategories.map((cat) => (
          <Cards
            key={cat.id}
            brand={cat}
            onClick={handleCategoryClick}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      {hasMore && categories.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button onClick={handleLoadMore} className="px-6 py-2 text-sm" disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {categories.length === 0 && !loading && (
        <div className="flex justify-center items-center h-[50vh]">No Categories Available!</div>
      )}

      <Popup
        open={popupOpen.open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title={
          popupOpen.type === "edit"
            ? "Edit Category"
            : popupOpen.type === "delete"
            ? "Delete Category"
            : "Create Category"
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
              Are you sure you want to delete this category?
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <label
                htmlFor="category-image"
                className={`${inputBaseClasses} w-24 h-24 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Category Preview"
                    className="w-full h-full object-container"
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
              error={errors.name}
            />
            {/* {errors.name && (
              <p className="text-red-500 text-sm text-left mt-1">{errors.name}</p>
            )} */}
          </div>
        )}
      </Popup>
    </div>
  );
}
