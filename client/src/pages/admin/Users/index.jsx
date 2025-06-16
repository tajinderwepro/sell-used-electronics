import { useEffect, useState } from "react";
import { CircleHelp, SquarePen, Trash2 } from "lucide-react";
import CommonTable from "../../../common/CommonTable";
import api from "../../../constants/api";
import Popup from "../../../common/Popup";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";
import { useColorClasses } from "../../../theme/useColorClasses";
import { validateFormData } from "../../../utils/validateUtils";
import { toast } from "react-toastify";
import { CreateuserSchema, EditUserSchema } from "../../../common/Schema";
import { useFilters } from "../../../context/FilterContext";
import validatePhone from "../../../components/ui/ValidPhoneFormat";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupState, setPopupState] = useState({ open: false, type: "create", id: null });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password_hash: "",
    confirmPassword: "",
    role: "admin",
    phone: ""

  });
  const [errors, setErrors] = useState({});
  // const errors = await validateFormData(form, userSchema, { isCreate: popupState.type === "create" });
  const {filters} = useFilters();
  const [message, setMessage] = useState("");
  const COLOR_CLASSES = useColorClasses();
  const [totalItems, setTotalItems] = useState(0);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getUsers(filters);
      setUsers(response.data);
      setTotalItems(response.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setPopupState({ open: true, type: "create", id: null });
    setForm({
      name: "",
      email: "",
      password_hash: "",
      confirmPassword: "",
      role: "admin",
      phone :" ",
    });
  };

  const handleDeleteOpen = (id) => {
    setPopupState({ open: true, type: "delete", id });
  };

  const getUser = async (id) => {
    try {
      setLoading(true);
      const response = await api.admin.getUser(id);
      if (response) {
        setForm({
          name: response.user.name || "",
          email: response.user.email || "",
          password_hash: "",
          confirmPassword: "",
          role: response.user.role || "admin",
          phone:validatePhone(response.user.phone || ""),
        });
        setPopupState({ open: true, type: "edit", id });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPopupState({ open: false, type: "create", id: null });
    setForm({
      name: "",
      email: "",
      password_hash: "",
      confirmPassword: "",
      role: "admin",
    });
    setErrors({});
    setMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (popupState.type === "create" && !form.password_hash.trim()) newErrors.password_hash = "Password is required";
    if (form.password_hash !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.role || (form.role !== "admin" && form.role !== "user"))
      newErrors.role = "Role must be either admin or user";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name=='phone'){
       const formatted = validatePhone(value);
       setForm((prev) => ({
      ...prev,
      [name]: formatted,
    }));
    }else{
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    } 
  };

  const handleSubmit = async (e) => {

    if (popupState.type === "delete") {
      try {
        setLoading(true);
        await api.admin.deleteUser(popupState.id);
        await fetchUsers();
        handleClose();
      } catch (err) {
        console.error(err);
        setMessage("Failed to delete user.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // const newErrors = validate();
    // if (Object.keys(newErrors).length > 0) {
    //   setErrors(newErrors);
    //   return;
    // }
    e.preventDefault();
    const isCreate = popupState.type === "create";
    const validationErrors = await validateFormData(form, isCreate ? CreateuserSchema : EditUserSchema, { isCreate });
    console.log(form,'form')
    if (validationErrors) {
      setErrors(validationErrors);
      toast.error("Please fix the errors");
      return;
    }


    try {
      setLoading(true);

      const payload = { 
        ...form,
        phone: form.phone.replace(/\D/g, '')  
      };

      if (popupState.type === "edit") {
        delete payload.password_hash;
        delete payload.confirmPassword;
        await api.admin.updateUser(popupState.id, payload);
      } else {
        await api.admin.createUser(payload);
      }
      await fetchUsers();
      handleClose();
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "ID", sortable: true  },
    { key: "name", label: "Name", sortable: true,render: (row) =>  row?.name.charAt(0).toUpperCase() + row?.name.slice(1) || "-" },
    
    { key: "email", label: "Email", sortable: true  },
    { key: "phone", label: "Phone Number", sortable: true ,render: (row) =>  validatePhone(row.phone) },
    
    { key: "role", label: "Role", sortable: true  },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <div className="flex gap-2">
          <button onClick={() => getUser(user.id)}>
            <SquarePen size={18} color="grey" />
          </button>
          <button onClick={() => handleDeleteOpen(user.id)}>
            <Trash2 size={18} color="grey" />
          </button>
        </div>
      ), 
      sortable: false 
    },
  ];
  return (
    <div className="min-h-screen mt-2">
      <CommonTable
        columns={columns}
        data={users}
        loading={loading}
        pageSize={10}
        title="Users List"
        onClick={handleOpen}
        onFetch={fetchUsers}
        totalItems={totalItems}
      />
      <Popup
        open={popupState.open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title={
          popupState.type === "edit"
            ? "Edit User"
            : popupState.type === "delete"
              ? "Delete User"
              : "Create User"
        }
        btnCancel="Cancel"
        btnSubmit={popupState.type === "delete" ? "Delete" : "Submit"}
        isbtnSubmit={popupState.type !== "delete"}
        isbtnDelete={popupState.type === "delete"}
        loading={loading}
      >
        {popupState.type === "delete" ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
            <CircleHelp className={`w-28 h-28 ${COLOR_CLASSES.primary}`} />
            <p className={`text-sm font-medium ${COLOR_CLASSES.primary}`}>
              Are you sure you want to delete this category?
            </p>
          </div>
        ) : (
          <form className="space-y-4">
            <InputField
              id="name"
              name="name"
              label={"Name"}
              placeholder="Enter name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <InputField
              error={errors.email}
              label={"Email"}
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
             <InputField
                  label={"Phone Number"}
                  id="phone"
                  name="phone"
                  type="text"
                  error={errors.phone}
                  placeholder="Enter Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                />

            {popupState.type === "create" && (
              <>
                <InputField
                  label={"Password"}
                  id="password_hash"
                  name="password_hash"
                  type="password"
                  error={errors.password_hash}
                  placeholder="Enter password"
                  value={form.password_hash}
                  onChange={handleChange}
                />

                <InputField
                  label={"Confirm Password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </>
            )}
            <SelectField
              id="role"
              label="Role"
              value={form.role}
              onChange={handleChange}
              error={errors.role}
              options={[
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
              ]}
            />
            {message && <p className="text-red-500 text-sm">{message}</p>}
          </form>
        )}
      </Popup>
    </div>
  );
}
