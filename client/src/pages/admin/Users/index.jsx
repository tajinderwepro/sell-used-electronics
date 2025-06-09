import { useEffect, useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommonTable from "../../../common/CommonTable";
import api from "../../../constants/api";
import Popup from "../../../common/Popup";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectBox";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupState, setPopupState] = useState({ open: false, isEdit: false, id: null });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password_hash: "",
    confirmPassword: "",
    role: "admin",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getUsers();
      setUsers(response.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await api.admin.deleteUser(id);
      if (response) fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (id) => {
    try {
      setLoading(true);
      const response = await api.admin.getUser(id);
      if (response) {
        setForm({
          name: response.name || "",
          email: response.email || "",
          password_hash: "",
          confirmPassword: "",
          role: response.role || "admin",
        });
        setPopupState({ open: true, isEdit: true, id });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setPopupState({ open: true, isEdit: false, id: null });
    setForm({
      name: "",
      email: "",
      password_hash: "",
      confirmPassword: "",
      role: "admin",
    });
  };

  const handleClose = () => {
    setPopupState({ open: false, isEdit: false, id: null });
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
    if (!popupState.isEdit && !form.password_hash.trim()) newErrors.password_hash = "Password is required";
    if (form.password_hash !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.role || (form.role !== "admin" && form.role !== "user"))
      newErrors.role = "Role must be either admin or user";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async () => {
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    setLoading(true);
    let payload = { ...form };

    // Exclude passwords on update
    if (popupState.isEdit) {
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
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <div className="flex gap-2">
          <button onClick={() => getUser(user.id)}>
            <SquarePen size={18} color="grey" />
          </button>
          <button onClick={() => handleDelete(user.id)}>
            <Trash2 size={18} color="grey" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <CommonTable
        columns={columns}
        data={users}
        loading={loading}
        pageSize={10}
        title={"Users List"}
        onClick={handleOpen}
      />

      <Popup
        open={popupState.open}
        onClose={handleClose}
        onSubmit={handleCreateUser}
        title={popupState.isEdit ? "Edit User" : "Create User"}
        btnCancel="Cancel"
        btnSubmit="Submit"
        isbtnCancel={true}
        isbtnSubmit={true}
        loading={loading}
      >
        <form className="space-y-4">
          <InputField
            id="name"
            name="name"
            placeholder="Enter name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <InputField
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          {!popupState.isEdit && 

            <InputField
            id="password_hash"
            name="password_hash"
            type="password"
            placeholder="Enter password"
            value={form.password_hash}
            onChange={handleChange}
          />
          }
          {!popupState.isEdit ? errors.password_hash && <p className="text-red-500 text-sm">{errors.password_hash}</p>:''}

          {!popupState.isEdit && <InputField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
          />}
          {!popupState.isEdit ? errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>:''}
          <SelectField
            id="role"
            value={form.role}
            onChange={handleChange}
            required={true}
            options={[
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
            ]}
          />
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

          {message && <p className="text-red-500 text-sm">{message}</p>}
        </form>
      </Popup>
    </div>
  );
}
