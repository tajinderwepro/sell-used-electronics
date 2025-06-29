import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Heading from "../../components/ui/Heading";

import {
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../../constants/theme";
import { useColorClasses } from "../../theme/useColorClasses";
import { toast } from "react-toastify";


export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, userRole, isAuthenticated } = useAuth();
  const COLOR_CLASSES = useColorClasses();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password, form.role);
      setError("");
      navigate("/admin/dashboard");
      toast.success("Logged in successfully");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      toast.error("Login failed. Please check your credentials.");
    }
  };

  if (userRole === "admin" && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div
      className={` 
      min-h-[70vh] md:min-h-[80vh]
      flex items-center justify-center
      md:px-4 sm:px-0
      ${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.bgGradient} ${FONT_FAMILIES.primary}
    `}
    >
      <form
        onSubmit={handleLogin}
        className={`
          ${COLOR_CLASSES.bgWhite} bg-opacity-90 backdrop-blur-md 
          p-6 sm:p-10 rounded-xl shadow-2xl 
          w-full max-w-md
        `}
        autoComplete="off"
      >
        <Heading
          className={`mb-6 text-center ${FONT_SIZES["3xl"]} ${FONT_WEIGHTS.extrabold} ${COLOR_CLASSES.primaryDark} ${FONT_FAMILIES.heading}`}
        >
          Admin Login
        </Heading>

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

        <Button type="submit" className="w-full mt-4">
          Sign In
        </Button>

        <p
          className={`text-center mt-6 ${COLOR_CLASSES.primaryDark} ${FONT_SIZES.sm}`}
        >
          Forgot your password?{" "}
          <a href="#" className={`underline ${COLOR_CLASSES.textHoverPrimary}`}>
            Reset here
          </a>
        </p>
      </form>
    </div>
  );
}