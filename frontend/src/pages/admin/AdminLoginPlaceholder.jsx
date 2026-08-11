import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/AdminLogin.css";

function AdminLoginPlaceholder() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8081/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      console.log("Admin login response:", data);

      // Check whether the logged-in user is actually an admin
      if (data.role !== "ADMIN") {
        throw new Error(
          "Access denied. This account is not an admin account."
        );
      }

      // Store JWT
      localStorage.setItem("token", data.token);

      // Store user information
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect to Admin Dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);

      setErrors({
        submit:
          error.message ||
          "Unable to connect to the server. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-icon">🛡️</div>

        <p className="portal-label">
          ADMINISTRATION PORTAL
        </p>

        <h1>Admin Login</h1>

        <p>
          Login with your authorized administrator
          account to manage civic complaints and services.
        </p>

        {errors.submit && (
          <div className="error-message">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="admin-form-group">
            <label htmlFor="admin-email">
              Email
            </label>

            <input
              type="email"
              id="admin-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
            />

            {errors.email && (
              <span className="error-text">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="admin-form-group">
            <label htmlFor="admin-password">
              Password
            </label>

            <div className="admin-password-wrapper">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                id="admin-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />

              <button
                type="button"
                className="admin-toggle-password"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <span className="error-text">
                {errors.password}
              </span>
            )}
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="admin-login-btn"
            disabled={isLoading}
          >
            {isLoading
              ? "Logging in..."
              : "Admin Login"}
          </button>
        </form>

        <Link
          to="/"
          className="back-home-btn"
        >
          Back to Home
        </Link>

      </div>
    </div>
  );
}

export default AdminLoginPlaceholder;