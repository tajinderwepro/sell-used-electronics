import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({name:"", email: "", password_hash: "", confirmPassword: "", role:'admin' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(""); // To display success/error message

  const validate = () => {
    let newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password_hash) newErrors.password_hash = "Password is required";
    if (form.password_hash !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:8000/api/v1/auth/register", form);
        console.log("Register success", response.data);
        setMessage("Registration successful! Please login.");
        setForm({ email: "", password_hash: "", confirmPassword: "" }); // Reset form
      } catch (error) {
        setMessage("Registration failed. Please try again.");
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 shadow-lg rounded w-80">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>

        <input
          className="w-full border p-2 mb-4 rounded"
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={form.name}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input
          className="w-full border p-2 mb-4 rounded"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          className="w-full border p-2 mb-4 rounded"
          type="password_hash"
          name="password_hash"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
        />
        {errors.password_hash && <p className="text-red-500 text-sm">{errors.password_hash}</p>}

        <input
          className="w-full border p-2 mb-4 rounded"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          value={form.confirmPassword}
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

        {message && <p className="text-green-500 text-sm">{message}</p>}

        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
}
