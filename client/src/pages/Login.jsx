import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import ErrorMessage from "../components/ui/ErrorMessage";
import Heading from "../components/ui/Heading";

import { FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS } from "../constants/theme";
import { useColorClasses } from "../theme/useColorClasses";

export default function Login() {
  const COLOR_CLASSES = useColorClasses();

  const [form, setForm] = useState({ email: "", password: "", role: "user" });
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
      navigate("/dashboard");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${COLOR_CLASSES.bgGradient} ${COLOR_CLASSES.bgWhite}  ${FONT_FAMILIES.primary}`}
    >
      <form
        onSubmit={handleLogin}
        className={`${COLOR_CLASSES.bgWhite} bg-opacity-90 backdrop-blur-xl p-10 rounded-xl shadow-2xl w-full max-w-md`}
        autoComplete="off"
      >
        <Heading
          className={`mb-6 ${FONT_SIZES["3xl"]} ${FONT_WEIGHTS.extrabold} ${COLOR_CLASSES.primaryDark} ${FONT_FAMILIES.heading}`}
        >
          User Login
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

        <Button
          type="submit"
          className="w-full"
        >
          Login
        </Button>

        <p
          className={`text-center mt-6 ${COLOR_CLASSES.textSecondary} ${FONT_SIZES.sm}`}
        >
          Forgot your password?{" "}
          <a
            href="#"
            className={`underline ${COLOR_CLASSES.textHoverPrimary}`}
          >
            Reset here
          </a>
        </p>
      </form>
    </div>
  );
}
