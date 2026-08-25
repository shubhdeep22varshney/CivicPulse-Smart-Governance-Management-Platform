import { BrowserRouter, Routes, Route } from "react-router-dom";

// Citizen pages
import Home from "./pages/citizen/Home";
import Registration from "./pages/citizen/Registration";
import Login from "./pages/citizen/Login";
import ComingSoon from "./pages/citizen/ComingSoon";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";

// Role selection
import RoleSelect from "./pages/RoleSelect";

// Admin pages
import AdminLoginPlaceholder from "./pages/admin/AdminLoginPlaceholder";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComplaintManagement from "./pages/admin/ComplaintManagement";
import StatusUpdates from "./pages/admin/StatusUpdates";
import ComplaintTracking from "./pages/admin/ComplaintTracking";

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

        <Route
          path="/citizen/dashboard"
          element={<CitizenDashboard />}
        />

        {/* ==================== ROLE SELECTION ==================== */}

        <Route path="/portal" element={<RoleSelect />} />

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