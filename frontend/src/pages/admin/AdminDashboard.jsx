import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import RegisterOfficerModal from "../../components/RegisterOfficerModal";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
   const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalComplaints: 1420,
    pendingComplaints: 245,
    inProgressComplaints: 371,
    resolvedComplaints: 804,
  });
  const [feedbackStats, setFeedbackStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/reports/summary")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return fetch("http://localhost:8081/api/dashboard/stats").then((r) => r.ok ? r.json() : null);
      })
      .then((data) => {
        if (data) {
          setDashboardData(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Report API error (using local mock analytics):", error);
        setLoading(false);
      });

    fetch("http://localhost:8081/api/feedback/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setFeedbackStats(d))
      .catch(() => {});
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "status resolved";
      case "In Progress":
        return "status progress";
      default:
        return "status pending";
    }
  };

  const stats = [
    {
      title: "Total Complaints",
      value: dashboardData?.totalComplaints ?? 1420,
      description: "All complaints received",
    },
    {
      title: "Pending",
      value: dashboardData?.pendingComplaints ?? 245,
      description: "Waiting for action",
    },
    {
      title: "In Progress",
      value: dashboardData?.inProgressComplaints ?? 371,
      description: "Currently being handled",
    },
    {
      title: "Resolved",
      value: dashboardData?.resolvedComplaints ?? 804,
      description: "Successfully resolved",
    },
    {
      title: "Customer Rating",
      value: feedbackStats?.averageRating ? `${feedbackStats.averageRating} ★` : "4.8 ★",
      description: `From ${feedbackStats?.totalFeedbacks ?? 12} citizen reviews`,
    },
  ];

  const departmentHighlights = [
    { code: "SWM", name: "Sanitation & Waste Management", pending: 42, inProgress: 68, resolved: 310, sla: "96.2%" },
    { code: "PWI", name: "Public Works & Infrastructure", pending: 89, inProgress: 114, resolved: 245, sla: "88.5%" },
    { code: "WSS", name: "Water Supply & Sewerage", pending: 31, inProgress: 56, resolved: 289, sla: "94.8%" },
    { code: "ESL", name: "Electricity & Street Lighting", pending: 19, inProgress: 37, resolved: 342, sla: "98.1%" },
  ];

  const recentComplaints = [
    {
      id: "CMP-001",
      category: "Road & Infrastructure",
      location: "Ghaziabad",
      status: "Pending",
    },
    {
      id: "CMP-002",
      category: "Water Supply",
      location: "Noida",
      status: "In Progress",
    },
    {
      id: "CMP-003",
      category: "Sanitation & Waste",
      location: "Delhi",
      status: "Resolved",
    },
    {
      id: "CMP-004",
      category: "Street Light",
      location: "Ghaziabad",
      status: "Pending",
    },
  ];

  return (
    <div>
      <AdminNavbar />

      <div className="admin-dashboard">

        {/* Header Banner */}
        <div className="dashboard-header">
          <div>
            <h1>Admin Overview</h1>
            <p>Smart Governance Platform & Municipal Department Operations</p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => setIsOfficerModalOpen(true)}
              style={{
                background: "linear-gradient(135deg, #0284c7, #0369a1)",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)",
                display: "flex",
                alignItems: "center",
              }}
            >
              ➕ Register Department Officer
            </button>
          </div>
        </div>

        <RegisterOfficerModal
          isOpen={isOfficerModalOpen}
          onClose={() => setIsOfficerModalOpen(false)}
        />

        {/* Overall Stats */}
        <section className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.title}>
              <h3>{stat.title}</h3>

              <div className="stat-value">
                {loading ? "..." : stat.value}
              </div>

              <p>{stat.description}</p>
            </div>
          ))}
        </section>

        {/* Department Wise Summary Banner */}
        <section className="dashboard-section" style={{ borderLeft: "5px solid #0ea5a5" }}>
          <div className="section-header">
            <div>
              <h2>Department-Wise Performance Summary</h2>
              <p>Key operational metrics across active municipal departments</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginTop: "16px" }}>
            {departmentHighlights.map((dept) => (
              <div key={dept.code} style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "800", color: "#0369a1", background: "#e0f2fe", padding: "2px 8px", borderRadius: "6px", fontSize: "12px" }}>
                    {dept.code}
                  </span>
                  <small style={{ color: "#10b981", fontWeight: "700" }}>SLA {dept.sla}</small>
                </div>
                <strong style={{ display: "block", fontSize: "14px", color: "#0f172a", marginBottom: "10px" }}>
                  {dept.name}
                </strong>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
                  <span>Pending: <strong style={{ color: "#ea580c" }}>{dept.pending}</strong></span>
                  <span>Active: <strong style={{ color: "#0284c7" }}>{dept.inProgress}</strong></span>
                  <span>Done: <strong style={{ color: "#10b981" }}>{dept.resolved}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Complaints */}
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Recent Complaints</h2>
              <p>Latest complaints submitted by citizens</p>
            </div>

            <button
              className="view-all-btn"
              onClick={() => navigate("/admin/complaints")}
            >
              View All Complaints
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>{complaint.id}</td>
                    <td>{complaint.category}</td>
                    <td>{complaint.location}</td>
                    <td>
                      <span className={getStatusClass(complaint.status)}>
                        {complaint.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Governance Actions</h2>

          <div className="action-grid">

            <button
              onClick={() => navigate("/admin/departments")}
              style={{ background: "#0ea5a5" }}
            >
              📊 Department Dashboard & Diagrams
            </button>

            <button
              onClick={() => navigate("/admin/complaints")}
            >
              Manage Complaints
            </button>

            <button
              onClick={() => navigate("/admin/status")}
            >
              Update Status
            </button>

            <button
              onClick={() => navigate("/admin/tracking")}
            >
              Track Complaints
            </button>

          </div>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;