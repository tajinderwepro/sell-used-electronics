import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); 
  const { login } = useAuth();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
       await login(form.email, form.password, form.role);
        setError(" ")
        navigate('/admin/dashboard');
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 shadow-lg rounded w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
        <input
          className="w-full border p-2 mb-4 rounded"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          className="w-full border p-2 mb-4 rounded"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}
