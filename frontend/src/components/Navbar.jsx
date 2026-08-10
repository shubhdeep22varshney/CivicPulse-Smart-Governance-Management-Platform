import { Link } from "react-router-dom";
import "../styles/Navbar.css";

// Links that go to fully-built pages
const mainLinks = [
  { label: "Home", path: "/" },
  { label: "Complaints", path: "/register-complaint" },
  { label: "Track Complaint", path: "/track-complaint" },
  { label: "Notifications", path: "/notifications" },
  { label: "Feedback", path: "/feedback" },
  { label: "Profile", path: "/profile" },
];

function Navbar() {
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
        </div>

        <div className="navbar-actions">
          <Link to="/portal" className="btn btn-outline">
            Login
          </Link>
          <Link to="/register" className="btn btn-filled">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;