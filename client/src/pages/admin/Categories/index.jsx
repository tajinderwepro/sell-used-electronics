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
  const breadcrumbItems = [
    { label: 'Category', path: '/admin/categories' },
  ];
export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [popupOpen, setPopupOpen] = useState({open:false,type:" ",id: " "});
  const [form, setForm] = useState({ name: "", image: null , });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate= useNavigate();
  const [limit] = useState(10); // constant limit
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchCategories = async (currentOffset = 0, append = false) => {
    setLoading(true);

    try {
      const res = await api.getCategories(limit, currentOffset);
      if (res && res.length > 0) {
        setCategories((prev) => append ? [...prev, ...res] : res);
        setHasMore(res.length  === limit );
      } else {
        setHasMore(false);
      }

    } catch (err) {
      console.error("Failed to fetch categories:", err);
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

  // const handleOpen = () => {
  //   setForm({ name: "", image: null });
  //   setPreview(null);
  //   setPopupOpen(true);
  // };

  const handleClose = () => {
    setPopupOpen(false);
    setErrors({});
  };
  const handleOpen = () => {
    setForm({ name: "", image: null });
    setPreview(null);
    setErrors({});
    setPopupOpen({ open: true, type: "create" });
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

    // Create or Edit
    if (!validateForm()) return;
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
        if (res.success) {
          toast.success(res.message);
          fetchCategories();
          handleClose();
        } else {
          toast.error(res.message);
        }
      } else {
        res = await api.admin.createCategory(formData);
        if (res.success) {
          toast.success(res.message);
          fetchCategories();
          handleClose();
        } else {
          toast.error(res.message);
        }
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
    navigate(`/admin/categories/${cat.id}/brand`);
  };

  return (
    <div className="min-h-screen">
      <LoadingIndicator isLoading={loading}/>
      <div className="flex justify-between items-center mb-6">
        <CustomBreadcrumbs items={breadcrumbItems} separator={<ChevronRight style={{fontSize:"12px"}}/>} key={""}/>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 mx-auto">
        {filteredCategories.map((cat) => (
           <Cards key={cat.id} brand={cat} onClick={handleCategoryClick} handleEdit={handleEdit} handleDelete={handleDelete}/>
        ))}
      </div>

      {hasMore && categories.length > 0 && (
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
       {categories.length == 0 && <div className="flex justify-center items-center h-[50vh]">No Categories Available!</div>}

      {/* Popup */}
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
            Are you sure you want to delete this category?
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Upload */}
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

          {/* Name Input */}
          <InputField
            id="name"
            name="name"
            placeholder="Category name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm text-left mt-1">
              {errors.name}
            </p>
          )}
        </div>
      )}
     </Popup>

    </div>
  );
}
