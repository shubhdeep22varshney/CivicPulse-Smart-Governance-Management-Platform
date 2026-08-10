import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/Login.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginMessage("");

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // NOTE: Demo only. Later this becomes a POST request to
      // a Spring Boot endpoint like /api/citizens/login, which
      // returns a real auth token instead of this fake message.
      console.log("Demo login attempt:", formData, "Remember me:", rememberMe);
      setLoginMessage("Login successful! (Demo only — no backend connected yet.)");
    }
  };

  return (
    <div>
      <Navbar />

      <section className="auth-section">
        <div className="auth-card">
          <span className="portal-badge">👤 Citizen Portal</span>
          <h1>Citizen Login</h1>
          <p className="auth-subtitle">
            Login to report issues and track your complaints.
          </p>

          {loginMessage && <div className="success-box">{loginMessage}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <Link to="/" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-submit">
              Login
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <p className="auth-footer-text">
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Login;