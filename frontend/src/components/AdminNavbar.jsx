import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/AdminNavbar.css";

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  let loggedInUser = null;
  try {
    if (userString) {
      loggedInUser = JSON.parse(userString);
    }
  } catch (e) {
    console.error("Error parsing loggedInUser", e);
  }

  const isDepartmentOfficer =
    loggedInUser &&
    (loggedInUser.role === "DEPARTMENT_OFFICER" || loggedInUser.role === "DEPARTMENT");

  const navItems = [
    { label: "Overview", path: "/admin/dashboard", icon: "📊" },
    { label: "Department Dashboard & Reports", path: "/admin/departments", icon: "🏛️" },
    { label: "Manage Complaints", path: "/admin/complaints", icon: "📁" },
    { label: "Update Status", path: "/admin/status", icon: "✏️" },
    { label: "Track Complaints", path: "/admin/tracking", icon: "🔍" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/portal");
  };

  const displayName = loggedInUser?.name || (isDepartmentOfficer ? "Department Officer" : "Administrator");
  const displayRole = isDepartmentOfficer
    ? (loggedInUser?.departmentCode ? `${loggedInUser.departmentCode} Officer` : "Department Officer")
    : "Super Admin";
  const avatarLetter = isDepartmentOfficer ? "O" : "A";
  const brandBadge = isDepartmentOfficer ? "Department Portal" : "Admin Console";

  return (
    <nav className="admin-nav">
      <div className="admin-nav-container">
        <div
          className="admin-nav-brand"
          onClick={() => navigate(isDepartmentOfficer ? "/department/dashboard" : "/admin/dashboard")}
        >
          <span className="brand-logo">Civic<strong>Pulse</strong></span>
          <span className="brand-badge">{brandBadge}</span>
        </div>

        <div className="admin-nav-links">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/admin/departments" &&
                (location.pathname === "/admin/department-dashboard" ||
                 location.pathname === "/department/dashboard"));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="admin-nav-user">
          <span className="user-avatar" style={isDepartmentOfficer ? { background: "#0284c7" } : {}}>
            {avatarLetter}
          </span>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <small className="user-role">{displayRole}</small>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            Exit
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
