import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setCurrentUser(parsed);
      } catch (error) {
        console.error("Error reading user data:", error);
        setCurrentUser(null);
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

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Civic<span className="logo-accent">Pulse</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">

          {/* Always visible */}
          <Link to="/" className="nav-link">
            Home
          </Link>

          {/* Citizen navigation - only after login */}
          {currentUser && (
            <>
              <Link to="/citizen/dashboard" className="nav-link">
                Dashboard
              </Link>

              <Link to="/register-complaint" className="nav-link">
                Complaints
              </Link>

              <Link to="/track-complaint" className="nav-link">
                Track Complaint
              </Link>

              <Link to="/notifications" className="nav-link">
                Notifications
              </Link>

              <Link to="/feedback" className="nav-link">
                Feedback
              </Link>

              <Link to="/profile" className="nav-link">
                Profile
              </Link>
            </>
          )}

          {/* Admin navigation */}
          {currentUser?.role === "ADMIN" && (
            <Link
              to="/admin/dashboard"
              className="nav-link"
              style={{
                color: "#0ea5a5",
                fontWeight: "700",
              }}
            >
              🏛️ Admin Portal
            </Link>
          )}

        </div>

        {/* Right-side actions */}
        <div className="navbar-actions">

          {currentUser ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >

              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155",
                }}
              >
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