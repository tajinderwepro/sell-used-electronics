import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";

import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Heading from "../../components/ui/Heading";

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
      setError("");
      navigate('/admin/dashboard');
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-500 p-6">
      <form 
        onSubmit={handleLogin} 
        className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-xl shadow-2xl w-full max-w-md"
        autoComplete="off"
      >
        <Heading className="mb-6">Admin Login</Heading>

        <InputField
          label="Email Address"
          id="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <InputField
          label="Password"
          id="password"
          type="password"
          placeholder="Your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <ErrorMessage message={error} />

        <Button type="submit">Sign In</Button>

        <p className="text-center text-indigo-700 mt-6 text-sm">
          Forgot your password? <a href="#" className="underline hover:text-indigo-900">Reset here</a>
        </p>
      </form>
    </div>
  );
}
