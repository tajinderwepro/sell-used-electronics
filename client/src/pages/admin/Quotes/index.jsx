import { useEffect, useState } from "react";
import { Trash2, SquarePen, CircleHelp, CircleCheckBig, Eye } from "lucide-react";
import CommonTable from "../../../common/CommonTable";
import Popup from "../../../common/Popup";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";
import api from "../../../constants/api";
import CustomSelectField from "../../../components/ui/CustomSelectField";
import CustomBreadcrumbs from "../../../common/CustomBreadCrumbs";
import { toast } from "react-toastify";
import { useColorClasses } from "../../../theme/useColorClasses";
import { validateFormData } from "../../../utils/validateUtils";
import { quoteSchema } from "../../../common/Schema";
import { useFilters } from "../../../context/FilterContext";
import { useAuth } from "../../../context/AuthContext";
import { formatCurrency } from "../../../components/ui/CurrencyFormatter";
import { Navigate, useNavigate } from "react-router-dom";

const breadcrumbItems = [
  { label: 'Categories', path: '/admin/categories' },
];

export default function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupState, setPopupState] = useState({ open: false, type: "form", isEdit: false, id: null });
  const [categories, setCategories] = useState([]);
  const COLOR_CLASSES = useColorClasses();
  const {user}=useAuth();

  const [form, setForm] = useState({
    category_name: "",
    brand_name: "",
    model_name: "",
    condition: "new",
    offered_price: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const {filters} = useFilters();
  const navigate = useNavigate();
  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await api.admin.quotes.getList(filters);
      setTotalItems(response.total);
      setQuotes(response.data);
    } catch (err) {
      console.error("Failed to fetch quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await api.admin.deleteQuote(id);
      toast.success(res.message);
      await fetchQuotes();
    } catch (err) {
      toast.error(err.message);
      console.error("Failed to delete quote:", err);
    } finally {
      setLoading(false);
    }
  };


  // const getQuote = async (id) => {
  //     try {
  //       setLoading(true);
  //       const quote = await api.admin.getQuote(id);
  //       setForm({
  //         category: quote.data.category?.toString() || "",
  //         brand: quote.data.brand?.toString() || "",
  //         model: quote.data.model?.toString() || "",
  //         condition: quote.data.condition || "new",
  //         base_price: formatCurrency(quote.data.base_price?.toString() || ""),
  //         ebay_avg_price:formatCurrency(quote.data.ebay_avg_price?.toString() || ""),
  //         status:quote.data.status?.toString() || "",
  //         user_id:quote.data.user_id
  //       });
  //       setPopupState({ open: true, isEdit: true, id });
  //     } catch (err) {
  //       console.error("Failed to fetch quote:", err);
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
    const validationErrors = await validateFormData(form, quoteSchema);

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
        const res = await api.admin.updateQuote(popupState.id, payload);
        if (res) toast.success(res.message);
      } else {
        const res = await api.admin.submit(user.id,payload);
        if (res) toast.success(res.message);
      }

      await fetchQuotes();
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
    { key: "category_name", label: "Category", sortable: true },
    { key: "brand_name", label: "Brand", sortable: true },
    { key: "model_name", label: "Model", sortable: true },
    { key: "condition", label: "Condition", sortable: true },
    { key: "offered_price", label: "Offered Price", sortable: true },
    { key: "risk_score", label: "Risk Score", sortable: true },
    { key: "status", label: "Status", sortable: true },
    {
      key: "actions",
      label: "Actions",
      render: (quote) => (
        <div className="flex gap-2">
          <button onClick={() => navigate(`/admin/quotes/${quote.id}`)}>
            <Eye size={18} color="gray" />
          </button>

          <button onClick={() => handleDeletePopup(quote.id)}>
            <Trash2 size={18} color="gray" />
          </button>
          <button
            onClick={() => handleApprovedPopup(quote.id)}
            disabled={quote.status === "approved"}
            className={`transition-opacity ${
              quote.status === "approved"
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-80"
            }`}
          >
            <CircleCheckBig size={18} color={`${quote.status === "approved"?"green":"gray"}`} />
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
      const res = await api.admin.quotes.updateStatus(popupState.id,formData);
      toast.success(res.message);
      await fetchQuotes();
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
        columns={columns}
        data={quotes}
        loading={loading}
        pageSize={10}
        title="Quotes List"
        onClick={handleOpen}
        totalItems={totalItems}
        onFetch={fetchQuotes} 
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
              ? "Edit Quote"
              :popupState.type === "approved"?"Aproved Quote": "Create Quote"
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
             {` Are you sure you want to ${popupState.type === "approved" ?"approved":"delete"} this quote?`}
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
              label="Offered Price"
               type="text"
              id="offered_price"
              name="offered_price"
              placeholder="Offered Price"
              value={form.offered_price}
              error={errors.offered_price}
              onChange={handleChange}
            />
          </form>
        )}
      </Popup>

    </div>
  );
}
