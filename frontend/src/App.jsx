import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/citizen/Home";
import Registration from "./pages/citizen/Registration";
import Login from "./pages/citizen/Login";
import ComingSoon from "./pages/citizen/ComingSoon";
import RoleSelect from "./pages/RoleSelect";
import AdminLoginPlaceholder from "./pages/admin/AdminLoginPlaceholder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        {/* Role selection screen — reached via the navbar "Login" button */}
        <Route path="/portal" element={<RoleSelect />} />

        {/* Admin module — placeholder only, teammate builds the real page */}
        <Route path="/admin/login" element={<AdminLoginPlaceholder />} />

        {/* Placeholder routes for upcoming citizen features */}
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
        <Route path="/feedback" element={<ComingSoon title="Feedback" />} />
        <Route path="/profile" element={<ComingSoon title="Profile" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;