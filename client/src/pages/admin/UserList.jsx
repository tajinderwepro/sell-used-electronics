import { useEffect, useState } from "react";
import CommonTable from "../../common/CommonTable";
import api from "../../constants/api";
import { Trash2 } from "lucide-react";
import Popup from "../../common/Popup";
import InputField from "../../components/ui/InputField";
// import SelectField from "../../components/ui/SelectBox";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupState, setPopupState] = useState({ open: false });

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

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleOpen = () => {
    console.log("CLLLC")
   setPopupState({ open: true })
  };


  const handleClose = () => {
    setPopupState({ open: false });
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
    if (!form.password_hash.trim()) newErrors.password_hash = "Password is required";
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
      await api.admin.createUser(form); 
      await fetchUsers();
      handleClose();
    } catch (err) {
      console.error(err);
      setMessage("Failed to register user.");
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
        <button onClick={() => handleDelete(user.id)}>
          <Trash2 size={18} color="grey" />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <CommonTable
        columns={columns}
        data={users}
        loading={loading}
        searchable={true}
        pageSize={10}
        title={"Users List"}
        handleOpen={handleOpen}
      />

      <Popup
        open={popupState.open}
        onClose={handleClose}
        onSubmit={handleCreateUser}
        title={"Create User"}
        btnCancel="Cancel"
        btnSubmit="Submit"
        isbtnCancel={true}
        isbtnSubmit={true}
        loading={loading}
      >
        <form className="space-y-4">
          <InputField
            // label="Name"
            id="name"
            name="name"
            placeholder="Enter name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm text-left" style={{marginTop:"5px"}}>{errors.name}</p>}

          <InputField
            // label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm text-left" style={{marginTop:"5px"}}>{errors.email}</p>}

          <InputField
            // label="Password"
            id="password_hash"
            name="password_hash"
            type="password"
            placeholder="Enter password"
            value={form.password_hash}
            onChange={handleChange}
          />
          {errors.password_hash && <p className="text-red-500 text-sm text-left" style={{marginTop:"5px"}}>{errors.password_hash}</p>}

          <InputField
            // label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm text-left" style={{marginTop:"5px"}}>{errors.confirmPassword}</p>}
{/* 
          <div>
            <SelectField
            // label="Role"
            id="role"
            value={form.role}
            onChange={handleChange}
            required={true}
            options={[
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
            ]}
           />
            {errors.role && <p className="text-red-500 text-sm text-left" style={{marginTop:"5px"}}>{errors.role}</p>}
          </div> */}

          {message && <p className="text-red-500 text-sm text-left" style={{marginTop:"5px"}}>{message}</p>}
        </form>
      </Popup>
    </div>
  );
}
