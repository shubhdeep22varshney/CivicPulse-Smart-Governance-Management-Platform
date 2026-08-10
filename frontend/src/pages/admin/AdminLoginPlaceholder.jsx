import { Link } from "react-router-dom";
import "../../styles/AdminLogin.css";

function AdminLoginPlaceholder() {
  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-icon">🛡️</div>

        <p className="portal-label">ADMINISTRATION PORTAL</p>

        <h1>Admin Login</h1>

        <p>
          The administration login is currently under development.
          This portal will be used by authorized personnel to manage
          civic complaints and services.
        </p>

        <Link to="/" className="back-home-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default AdminLoginPlaceholder;