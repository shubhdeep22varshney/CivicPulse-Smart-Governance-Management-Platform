import { BrowserRouter, Routes, Route } from "react-router-dom";

// Citizen pages
import Home from "./pages/citizen/Home";
import Registration from "./pages/citizen/Registration";
import Login from "./pages/citizen/Login";
import ComingSoon from "./pages/citizen/ComingSoon";

// Role selection
import RoleSelect from "./pages/RoleSelect";

// Department Officer pages
import DepartmentLogin from "./pages/department/DepartmentLogin";

// Admin pages
import AdminLoginPlaceholder from "./pages/admin/AdminLoginPlaceholder";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComplaintManagement from "./pages/admin/ComplaintManagement";
import StatusUpdates from "./pages/admin/StatusUpdates";
import ComplaintTracking from "./pages/admin/ComplaintTracking";
import DepartmentDashboard from "./pages/admin/DepartmentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================== CITIZEN MODULE ==================== */}

        {/* Citizen Home */}
        <Route path="/" element={<Home />} />

        {/* Citizen Registration */}
        <Route path="/register" element={<Registration />} />

        {/* Citizen Login */}
        <Route path="/login" element={<Login />} />

        {/* ==================== ROLE SELECTION ==================== */}

        <Route path="/portal" element={<RoleSelect />} />

        {/* ==================== DEPARTMENT OFFICER MODULE ==================== */}

        {/* Department Officer Login */}
        <Route
          path="/department/login"
          element={<DepartmentLogin />}
        />
        <Route
          path="/officer/login"
          element={<DepartmentLogin />}
        />

        {/* Department Officer Dashboard */}
        <Route
          path="/department/dashboard"
          element={<DepartmentDashboard />}
        />

        {/* ==================== ADMIN MODULE ==================== */}

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={<AdminLoginPlaceholder />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* Department Dashboard & Reports */}
        <Route
          path="/admin/departments"
          element={<DepartmentDashboard />}
        />
        <Route
          path="/admin/department-dashboard"
          element={<DepartmentDashboard />}
        />

        {/* Complaint Management */}
        <Route
          path="/admin/complaints"
          element={<ComplaintManagement />}
        />

        {/* Status Updates */}
        <Route
          path="/admin/status"
          element={<StatusUpdates />}
        />

        {/* Complaint Tracking */}
        <Route
          path="/admin/tracking"
          element={<ComplaintTracking />}
        />

        {/* ==================== CITIZEN FEATURES ==================== */}

        {/* Register Complaint */}
        <Route
          path="/register-complaint"
          element={<ComingSoon title="Complaints" />}
        />

        {/* Track Complaint */}
        <Route
          path="/track-complaint"
          element={<ComingSoon title="Track Complaint" />}
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={<ComingSoon title="Notifications" />}
        />

        {/* Feedback */}
        <Route
          path="/feedback"
          element={<ComingSoon title="Feedback" />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={<ComingSoon title="Profile" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;