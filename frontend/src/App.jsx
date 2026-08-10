import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/citizen/Home";
import Registration from "./pages/citizen/Registration";
import Login from "./pages/citizen/Login";
import ComingSoon from "./pages/citizen/ComingSoon";
import RoleSelect from "./pages/RoleSelect";

import AdminLoginPlaceholder from "./pages/admin/AdminLoginPlaceholder";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComplaintManagement from "./pages/admin/ComplaintManagement";
import StatusUpdates from "./pages/admin/StatusUpdates";
import ComplaintTracking from "./pages/admin/ComplaintTracking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Citizen module */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        {/* Role selection */}
        <Route path="/portal" element={<RoleSelect />} />

        {/* Admin module */}
        <Route path="/admin/login" element={<AdminLoginPlaceholder />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/complaints"
          element={<ComplaintManagement />}
        />
        <Route path="/admin/status" element={<StatusUpdates />} />
        <Route
          path="/admin/tracking"
          element={<ComplaintTracking />}
        />

        {/* Citizen features */}
        <Route
          path="/register-complaint"
          element={<ComingSoon title="Complaints" />}
        />

        <Route
          path="/track-complaint"
          element={<ComingSoon title="Track Complaint" />}
        />

        <Route
          path="/notifications"
          element={<ComingSoon title="Notifications" />}
        />

        <Route
          path="/feedback"
          element={<ComingSoon title="Feedback" />}
        />

        <Route
          path="/profile"
          element={<ComingSoon title="Profile" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;