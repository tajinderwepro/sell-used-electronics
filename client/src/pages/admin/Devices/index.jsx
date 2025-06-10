import { useEffect, useState } from "react";
import { Trash2, SquarePen } from "lucide-react";
import CommonTable from "../../../common/CommonTable";
import Popup from "../../../common/Popup";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";
import api from "../../../constants/api";
import CustomSelectField from "../../../components/ui/CustomSelectField";
import CustomBreadcrumbs from "../../../common/CustomBreadCrumbs";

const breadcrumbItems = [
  { label: 'Categories', path: '/admin/categories' },
];

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupState, setPopupState] = useState({ open: false, isEdit: false, id: null });
  const [categories, setCategories] = useState([
    { label: "Mobile", value: "mobile" },
    { label: "Laptop", value: "laptop" }
  ]);
  const [brands, setBrands] = useState([
    { label: "Apple", value: "apple" },
    { label: "Vivo", value: "vivo" }
  ]);
  const [models, setModels] = useState([
    { label: "I phon 15", value: "i_phone_15" },
    { label: "Vivo 80X", value: "vivo_80x" }
  ]);


  const [form, setForm] = useState({
    category: "",
    brand: "",
    model: "",
    condition: "new",
    base_price: "",
    ebay_avg_price: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getDevices();
      setDevices(response.data);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.admin.deleteDevice(id);
      await fetchDevices();
    } catch (err) {
      console.error("Failed to delete device:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDevice = async (id) => {
    try {
      setLoading(true);
      const device = await api.admin.getDevice(id);
      setForm({
        category: device.category || "",
        brand: device.brand || "",
        model: device.model || "",
        condition: device.condition || "new",
        base_price: device.base_price || "",
        ebay_avg_price: device.ebay_avg_price || "",
      });
      setPopupState({ open: true, isEdit: true, id });
    } catch (err) {
      console.error("Failed to fetch device:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setForm({
      category: "",
      brand: "",
      model: "",
      condition: "new",
      base_price: "",
      ebay_avg_price: "",
    });
    setErrors({});
    setMessage("");
    setPopupState({ open: true, isEdit: false, id: null });
  };

  const handleClose = () => {
    setPopupState({ open: false, isEdit: false, id: null });
    setForm({
      category: "",
      brand: "",
      model: "",
      condition: "new",
      base_price: "",
      ebay_avg_price: "",
    });
    setErrors({});
    setMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.brand.trim()) newErrors.brand = "Brand is required";
    if (!form.model.trim()) newErrors.model = "Model is required";
    if (!form.condition.trim()) newErrors.condition = "Condition is required";
    if (!form.base_price.trim()) newErrors.base_price = "Base price is required";
    if (!form.ebay_avg_price.trim()) newErrors.ebay_avg_price = "Ebay average price is required";
    return newErrors;
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any existing errors for this field
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleCreateOrUpdate = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      if (popupState.isEdit && popupState.id) {
        await api.admin.updateDevice(popupState.id, form);
      } else {
        await api.admin.createDevice(form);
      }
      await fetchDevices();
      handleClose();
    } catch (err) {
      console.error("Submit failed:", err);
      setMessage("Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "category", label: "Category" },
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "condition", label: "Condition" },
    { key: "base_price", label: "Base Price" },
    { key: "ebay_avg_price", label: "Ebay Avg Price" },
    {
      key: "actions",
      label: "Actions",
      render: (device) => (
        <div className="flex gap-2">
          <button onClick={() => getDevice(device.id)}>
            <SquarePen size={18} color="gray" />
          </button>
          <button onClick={() => handleDelete(device.id)}>
            <Trash2 size={18} color="gray" />
          </button>
        </div>
      ),
    },
  ];
  console.log(form, 'form')
  return (
    <div className="min-h-screen">
      <CustomBreadcrumbs items={breadcrumbItems} separator=">" />
      <CommonTable
        columns={columns}
        data={devices}
        loading={loading}
        pageSize={10}
        title="Devices List"
        onClick={handleOpen}
      />

      <Popup
        open={popupState.open}
        onClose={handleClose}
        onSubmit={handleCreateOrUpdate}
        title={popupState.isEdit ? "Edit Device" : "Create Device"}
        btnCancel="Cancel"
        btnSubmit="Submit"
        isbtnCancel={true}
        isbtnSubmit={true}
        loading={loading}
      >
        <form className="space-y-4">
          <CustomSelectField
            label="Category"
            id="category"
            value={form.category}
            onChange={handleChange}
            options={categories}
            setOptions={setCategories}
            apiUrl="/api/categories"
          />
          {/* <InputField id="category" name="category" placeholder="Category" value={form.category} onChange={handleChange} /> */}
          {errors.category && <p className="text-red-500 text-sm text-left" style={{marginTop:"5px"}}>{errors.category}</p>}
           <CustomSelectField
            label="Brand"
            id="brand"
            value={form.brand}
            onChange={handleChange}
            options={brands}
            setOptions={setBrands}
            apiUrl="/api/brands"
          />
          {/* <InputField id="brand" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} /> */}
          {errors.brand && <p className="text-red-500 text-sm  text-left" style={{marginTop:"5px"}}>{errors.brand}</p>}
          
          <CustomSelectField
            label="Model"
            id="model"
            value={form.model}
            onChange={handleChange}
            options={models}
            setOptions={setModels}
            apiUrl="/api/brands"
          />
          {/* <InputField id="model" name="model" placeholder="Model" value={form.model} onChange={handleChange} /> */}
          {errors.model && <p className="text-red-500 text-sm  text-left" style={{marginTop:"5px"}}>{errors.model}</p>}

          <SelectField
            name="condition"
            value={form.condition}
            onChange={handleChange}
            options={[
              { label: "New", value: "new" },
              { label: "Used", value: "used" },
              { label: "Refurbished", value: "refurbished" },
            ]}
          />

          {errors.condition && <p className="text-red-500 text-sm  text-left" style={{marginTop:"5px"}}>{errors.condition}</p>}

          <InputField type="number" id="base_price" name="base_price" placeholder="Base Price" value={form.base_price} onChange={handleChange} />
          {errors.base_price && <p className="text-red-500 text-sm  text-left" style={{marginTop:"5px"}}>{errors.base_price}</p>}

          <InputField type="number" id="ebay_avg_price" name="ebay_avg_price" placeholder="eBay Avg Price" value={form.ebay_avg_price} onChange={handleChange} />
          {errors.ebay_avg_price && <p className="text-red-500 text-sm  text-left" style={{marginTop:"5px"}}>{errors.ebay_avg_price}</p>}

          {message && <p className="text-red-500 text-sm">{message}</p>}
        </form>
      </Popup>
    </div>
  );
}
