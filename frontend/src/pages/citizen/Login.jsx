import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
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

    setLoginMessage("");
  };

  // Validate form
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

  // Login with Spring Boot backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginMessage("");
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

      console.log("Login successful:", data);

      // Store JWT token
      localStorage.setItem("token", data.token);

      // Store logged-in user information
      localStorage.setItem("user", JSON.stringify(data));

      // Store Remember Me preference
      localStorage.setItem(
        "rememberMe",
        rememberMe.toString()
      );

      setLoginMessage("Login successful!");

      // Redirect based on user role
      if (data.role === "CITIZEN") {
        navigate("/citizen/dashboard");
      } else if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);

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
    <div>
      <Navbar />

      <section className="auth-section">
        <div className="auth-card">

          <span className="portal-badge">
            👤 Citizen Portal
          </span>

          <h1>Citizen Login</h1>

          <p className="auth-subtitle">
            Login to report issues and track your complaints.
          </p>

          {/* Success message */}
          {loginMessage && (
            <div className="success-box">
              {loginMessage}
            </div>
          )}

          {/* Backend error message */}
          {errors.submit && (
            <div className="error-text">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />

              {errors.email && (
                <span className="error-text">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="toggle-password"
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

            {/* Remember Me / Forgot Password */}
            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />
                Remember Me
              </label>

              <Link
                to="/"
                className="forgot-link"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          {/* Register link */}
          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/register">
              Register here
            </Link>
          </p>

          {/* Home link */}
          <p className="auth-footer-text">
            <Link to="/">
              ← Back to Home
            </Link>
          </p>

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Login;