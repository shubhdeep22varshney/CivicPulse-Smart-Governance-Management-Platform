import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const mainLinks = [
  { label: "Home", path: "/" },
  { label: "Complaints", path: "/register-complaint" },
  { label: "Track Complaint", path: "/track-complaint" },
  { label: "Notifications", path: "/notifications" },
  { label: "Feedback", path: "/feedback" },
  { label: "Profile", path: "/profile" },
];

function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setCurrentUser(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Civic<span className="logo-accent">Pulse</span>
        </Link>

        <div className="navbar-links">
          {mainLinks.map((link) => (
            <Link to={link.path} className="nav-link" key={link.label}>
              {link.label}
            </Link>
          ))}
          {currentUser?.role === "ADMIN" && (
            <Link to="/admin/dashboard" className="nav-link" style={{ color: "#0ea5a5", fontWeight: "700" }}>
              🏛️ Admin Portal
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {currentUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                👋 {currentUser.name || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ cursor: "pointer" }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/portal" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-filled">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;