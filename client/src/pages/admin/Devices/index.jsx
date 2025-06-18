import { useEffect, useState } from "react";
import { Trash2, SquarePen, CircleHelp, CircleCheckBig, Eye } from "lucide-react";
import CommonTable from "../../../common/CommonTable";
import Popup from "../../../common/Popup";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";
import api from "../../../constants/api";
import { toast } from "react-toastify";
import { useColorClasses } from "../../../theme/useColorClasses";
import { validateFormData } from "../../../utils/validateUtils";
import { deviceSchema } from "../../../common/Schema";
import { useFilters } from "../../../context/FilterContext";
import { useAuth } from "../../../context/AuthContext";
import { formatCurrency } from "../../../components/ui/CurrencyFormatter";
import { Navigate, useNavigate } from "react-router-dom";

const breadcrumbItems = [
  { label: 'Categories', path: '/admin/categories' },
];

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupState, setPopupState] = useState({ open: false, type: "form", isEdit: false, id: null });
  const [categories, setCategories] = useState([]);
  const COLOR_CLASSES = useColorClasses();
  const {user}=useAuth();

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
  const [totalItems, setTotalItems] = useState(0);
  const {filters} = useFilters();
  const navigate = useNavigate();
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getDevices(filters);
      setTotalItems(response.total);
      setDevices(response.data);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await api.admin.deleteDevice(id);
      toast.success(res.message);
      await fetchDevices();
    } catch (err) {
      toast.error(err.message);
      console.error("Failed to delete device:", err);
    } finally {
      setLoading(false);
    }
  };


  // const getDevice = async (id) => {
  //     try {
  //       setLoading(true);
  //       const device = await api.admin.getDevice(id);
  //       setForm({
  //         category: device.data.category?.toString() || "",
  //         brand: device.data.brand?.toString() || "",
  //         model: device.data.model?.toString() || "",
  //         condition: device.data.condition || "new",
  //         base_price: formatCurrency(device.data.base_price?.toString() || ""),
  //         ebay_avg_price:formatCurrency(device.data.ebay_avg_price?.toString() || ""),
  //         status:device.data.status?.toString() || "",
  //         user_id:device.data.user_id
  //       });
  //       setPopupState({ open: true, isEdit: true, id });
  //     } catch (err) {
  //       console.error("Failed to fetch device:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  // };


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
    setPopupState({ open: false, type: "form", isEdit: false, id: null });
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ebay_avg_price" || name === "base_price") {
      const rawValue = value.replace(/\D/g, "");
      const formattedValue = formatCurrency(rawValue);

      setForm((prev) => ({
        ...prev,
        [name]: formattedValue, 
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));

    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };


  const handleCreateOrUpdate = async () => {
    const validationErrors = await validateFormData(form, deviceSchema);

    if (validationErrors) {
      setErrors(validationErrors);
      toast.error("Please fix the validation errors.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        category_id: parseInt(form.category),
        brand_id: parseInt(form.brand),
        model_id: parseInt(form.model),
        base_price: parseInt(form.base_price.replace(/\D/g, ""), 10),
        ebay_avg_price: parseInt(form.ebay_avg_price.replace(/\D/g, ""), 10),
      };

      if (popupState.isEdit && popupState.id) {
        const res = await api.admin.updateDevice(popupState.id, payload);
        if (res) toast.success(res.message);
      } else {
        const res = await api.admin.submit(user.id,payload);
        if (res) toast.success(res.message);
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

  const handleDeletePopup = (id) => {
    setPopupState({ open: true, type: "delete", id });
  };



  const columns = [
    { key: "id", label: "ID", sortable: true },
    {
      key: "user",
      label: "User",
      sortable: true,
      render: (row) =>  row.user?.name.charAt(0).toUpperCase() + row.user?.name.slice(1) || "-"
    },
    { key: "category", label: "Category", sortable: true },
    { key: "brand", label: "Brand", sortable: true },
    { key: "model", label: "Model", sortable: true },
    { key: "condition", label: "Condition", sortable: true },
    { key: "base_price", label: "Base Price", sortable: true },
    { key: "ebay_avg_price", label: "Ebay Avg Price", sortable: true },
    // { key: "risk", label: "Risk", sortable: true },
    { key: "status", label: "Status", sortable: true },
    {
      key: "actions",
      label: "Actions",
      render: (device) => (
        <div className="flex gap-2">
          <button onClick={() => navigate(`/admin/devices/${device.id}`)}>
            <Eye size={18} color="gray" />
          </button>

          <button onClick={() => handleDeletePopup(device.id)}>
            <Trash2 size={18} color="gray" />
          </button>
          <button
            onClick={() => handleApprovedPopup(device.id)}
            disabled={device.status === "approved"}
            className={`transition-opacity ${
              device.status === "approved"
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-80"
            }`}
          >
            <CircleCheckBig size={18} color={`${device.status === "approved"?"green":"gray"}`} />
          </button>

         
        </div>
      ),
    },
  ];
  const fetchCategories = async () => {
    try {
      const res = await api.getCategories()
      if (res?.data) {
        setCategories(res?.data);
      }
    
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleApprovedPopup = (id) => {
    setPopupState({ open: true, type: "approved", id });
  };

  const handleApproved =async( )=>{
   
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("status", "approved");
      const res = await api.admin.updateDeviceStatus(popupState.id,formData);
      toast.success(res.message);
      await fetchDevices();
      handleClose()
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
    
  }

  useEffect(() => {
    fetchCategories()
  }, []);

  return (
    <div className="min-h-screen mt-2">
      <CommonTable
        isDownloadCSV={true}
        columns={columns}
        data={devices}
        loading={loading}
        pageSize={10}
        title="Devices List"
        onClick={handleOpen}
        totalItems={totalItems}
        onFetch={fetchDevices} 
      />
      <Popup
        open={popupState.open}
        onClose={handleClose}
        onSubmit={
          popupState.type === "delete"
            ? () => {
              handleDelete(popupState.id);
              handleClose();
            }
            : popupState.type === "approved"?handleApproved: handleCreateOrUpdate
        }
        onDelete={() => {
          handleDelete(popupState.id);
          handleClose();
        }}
        title={
          popupState.type === "delete"
            ? "Delete Confirmation"
            : popupState.isEdit
              ? "Edit Device"
              :popupState.type === "approved"?"approved Device": "Create Device"
        }
        btnCancel="Cancel"
        btnSubmit="Submit"
        btnDelete="Delete"
        isbtnCancel={true}
        isbtnSubmit={popupState.type !== "delete"}
        isbtnDelete={popupState.type === "delete"}
        loading={loading}
      >
        {popupState.type === "delete" || popupState.type === "approved" ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
            <CircleHelp className={`w-28 h-28 ${COLOR_CLASSES.primary}`} />
            <p className={`text-sm font-medium ${COLOR_CLASSES.primary}`}>
             {` Are you sure you want to ${popupState.type === "approved" ?"approved":"delete"} this device?`}
            </p>
          </div>
        ) : (
          <form>
            <SelectField
              label="Category"
              name="category"
              id="category"
              error={errors.category}
              value={form.category}
              onChange={(e) => {
                handleChange(e);
                setForm((prev) => ({ ...prev, brand: "", model: "" }));
              }}
              options={categories.map((cat) => ({
                label: cat.name,
                value: String(cat.id),
              }))}
            />
            <SelectField
              label="Brand"
              name="brand"
              id="brand"
              error={errors.brand}
              value={form.brand}
              onChange={(e) => {
                handleChange(e);
                setForm((prev) => ({ ...prev, model: "" }));
              }}
              options={
                (categories.find((c) => String(c.id) === form.category)?.brands || []).map(
                  (brand) => ({
                    label: brand.name,
                    value: String(brand.id),
                  })
                )
              }
              disabled={!form.category}
            />
            <SelectField
              error={errors.model}
              label="Model"
              name="model"
              id="model"
              value={form.model}
              onChange={handleChange}
              options={
                (categories.find((c) => String(c.id) === form.category)?.models || [])
                  .filter((m) => String(m.brand_id) === form.brand)
                  .map((model) => ({
                    label: model.name,
                    value: String(model.id),
                  }))
              }
              disabled={!form.brand}
            />
            <SelectField
              error={errors.condition}
              label={"Condition"}
              name="condition"
              id={"condition"}
              value={form.condition}
              onChange={handleChange}
              options={[
                { label: "Excellent", value: "excellent" },
                { label: "Good", value: "good" },
                { label: "Fair", value: "fair" },
                { label: "Bad", value: "bad" },
                
              ]}
            />
            <InputField
              label="Base Price"
               type="text"
              id="base_price"
              name="base_price"
              placeholder="Base Price"
              value={form.base_price}
              error={errors.base_price}
              onChange={handleChange}
            />

            <InputField
              error={errors.ebay_avg_price}
              label="Ebay Avg Price"
              type="text"
              id="ebay_avg_price"
              name="ebay_avg_price"
              placeholder="eBay Avg Price"
              value={form.ebay_avg_price}
              onChange={handleChange}
            />
            {message && <p className="text-red-500 text-sm">{message}</p>}
          </form>
        )}
      </Popup>

    </div>
  );
}
