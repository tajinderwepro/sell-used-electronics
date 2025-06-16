import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Plus, CircleHelp } from "lucide-react";
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
import { categorySchema } from "../../../common/Schema";

export default function Models() {
  const { categoryId, brand, brandId } = useParams();
  const navigate = useNavigate();


  const [models, setModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [popupOpen, setPopupOpen] = useState({ open: false, type: "", id: "" });
  const [form, setForm] = useState({ name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [limit] = useState(10); // constant limit
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const COLOR_CLASSES = useColorClasses();

  const inputBaseClasses = `
    ${errors.image ? 'border-red-500 ring-red-300 focus:border-red-500 focus:ring-red-300' : COLOR_CLASSES.borderPrimary + ' focus:ring-' + COLOR_CLASSES.primaryBg + ' focus:border-' + COLOR_CLASSES.primary}
  `;
  const breadcrumbItems = [
    { label: 'Device', path: '/admin/categories' },
    { label: 'Brands', path: `/admin/categories/${categoryId}/brand` },
    { label: 'Models', path: `/admin/categories/${categoryId}/${brand}/${brandId}` },
  ];

  const fetchModels = async (currentOffset = 0, append = false) => {
    setLoading(true)
    try {
      const res = await api.admin.getModel(brandId, limit, currentOffset);
      if (res.success) {
        setModels((prev) => append ? [...prev, ...res.data] : res.data);
        setHasMore(res.data.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      toast.error(error.message)
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchModels(0);
  }, [brandId]);

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchModels(newOffset, true);
  };

  const handleOpen = () => {
    setForm({ name: "", image: null });
    setPreview(null);
    setErrors({});
    setPopupOpen({ open: true, type: "create" });
  };

  const handleEdit = (model) => {
    setForm({ name: model.name, image: model.media?.[0]?.path || null });
    setPreview(model.media?.[0]?.path || null);
    setErrors({});
    setPopupOpen({ open: true, type: "edit", id: model.id });
  };

  const handleDelete = (model) => {
    setPopupOpen({ open: true, type: "delete", id: model.id });
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
      const newErrors = {}
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
        const res = await api.admin.deleteModel(popupOpen.id);
        if (res.success) {
          toast.success(res.message);
          fetchModels();
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
    formData.append("brand_id", brandId);
    formData.append("category_id", categoryId);

    setLoading(true);
    try {
      let res;
      if (popupOpen.type === "edit") {
        res = await api.admin.editModel(popupOpen.id, formData);
      } else {
        res = await api.admin.createModel(brandId, formData);
      }

      if (res.success) {
        toast.success(res.message);
        fetchModels();
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

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <LoadingIndicator isLoading={loading} />
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
          <Cards
            key={model.id}
            brand={model}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      {hasMore && models.length > 0 && (
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
      {(models.length == 0 && !loading) && <div className="flex justify-center items-center h-[50vh]">No Models Available!</div>}

      <Popup
        open={popupOpen.open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title={
          popupOpen.type === "edit"
            ? "Edit Model"
            : popupOpen.type === "delete"
              ? "Delete Model"
              : "Create Model"
        }
        btnCancel="Cancel"
        btnSubmit={
          popupOpen.type === "delete" ? "Delete" : "Submit"
        }
        isbtnCancel={true}
        isbtnSubmit={true}
        loading={loading}
      >
        {popupOpen.type === "delete" ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
            <CircleHelp className="w-28 h-28" />
            <p className="text-gray-700 text-sm font-medium">
              Are you sure you want to delete this model?
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
                    alt="Model Preview"
                    className="w-full h-full object-contain"
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