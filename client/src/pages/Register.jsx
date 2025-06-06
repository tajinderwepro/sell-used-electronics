import { useState } from "react";
import axios from "axios";
import Heading from "../components/ui/Heading";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useNavigate } from "react-router-dom";

import { COLOR_CLASSES, FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS } from "../constants/theme";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password_hash: "",
    confirmPassword: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password_hash) newErrors.password_hash = "Password is required";
    if (form.password_hash !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
    setMessage(""); // Clear success/error messages on change
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      try {
        await axios.post("http://localhost:8000/api/v1/auth/register", form);
        setMessage("Registration successful! Please login.");
        setForm({ name: "", email: "", password_hash: "", confirmPassword: "", role: "user" });
        setErrors({});
        navigate("/login");
      } catch (error) {
        setMessage("Registration failed. Please try again.");
      }
    } else {
      setErrors(newErrors);
      setMessage("");
    }
  };

  return (
    <div
      className={`${COLOR_CLASSES.bgGradient} min-h-screen flex items-center justify-center p-6 ${FONT_FAMILIES.primary}`}
    >
      <form
        onSubmit={handleRegister}
        className={`${COLOR_CLASSES.bgWhite} bg-opacity-90 backdrop-blur-md p-10 rounded-xl shadow-2xl w-full max-w-md`}
        autoComplete="off"
      >
        <Heading
          className={`mb-6 ${FONT_SIZES["3xl"]} ${FONT_WEIGHTS.extrabold} ${COLOR_CLASSES.primaryDark} ${FONT_FAMILIES.heading}`}
        >
          Create an Account
        </Heading>

        <InputField
          label="Name"
          id="name"
          type="text"
          placeholder="Your full name"
          value={form.name}
          onChange={handleChange}
          required
          error={errors.name}
        />
        <ErrorMessage message={errors.name} />

        <InputField
          label="Email Address"
          id="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
          error={errors.email}
        />
        <ErrorMessage message={errors.email} />

        <InputField
          label="Password"
          id="password_hash"
          type="password"
          placeholder="Enter password"
          value={form.password_hash}
          onChange={handleChange}
          required
          error={errors.password_hash}
        />
        <ErrorMessage message={errors.password_hash} />

        <InputField
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          error={errors.confirmPassword}
        />
        <ErrorMessage message={errors.confirmPassword} />

        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("successful") ? COLOR_CLASSES.primaryDark : "text-red-600"
            } ${FONT_SIZES.base} ${FONT_WEIGHTS.medium}`}
          >
            {message}
          </p>
        )}

        <Button
          type="submit"
        >
          Register
        </Button>
      </form>
    </div>
  );
}
