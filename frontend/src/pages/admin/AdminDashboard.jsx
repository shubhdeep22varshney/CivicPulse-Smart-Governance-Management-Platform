import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/api/dashboard/stats")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        return response.json();
      })
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Dashboard API error:", error);
        setError("Unable to load dashboard data");
        setLoading(false);
      });
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

  if (loading) {
    return <div className="admin-dashboard">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="admin-dashboard">{error}</div>;
  }

  const stats = [
    {
      title: "Total Complaints",
      value: dashboardData?.totalComplaints ?? 0,
      description: "All complaints received",
    },
    {
      title: "Pending",
      value: dashboardData?.pendingComplaints ?? 0,
      description: "Waiting for action",
    },
    {
      title: "In Progress",
      value: dashboardData?.inProgressComplaints ?? 0,
      description: "Currently being handled",
    },
    {
      title: "Resolved",
      value: dashboardData?.resolvedComplaints ?? 0,
      description: "Successfully resolved",
    },
  ];

  const recentComplaints = [
    {
      id: "CMP-001",
      category: "Road",
      location: "Ghaziabad",
      status: "Pending",
    },
    {
      id: "CMP-002",
      category: "Water",
      location: "Noida",
      status: "In Progress",
    },
    {
      id: "CMP-003",
      category: "Garbage",
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
    <div className="admin-dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Smart Governance Management Overview</p>
        </div>

        <div className="admin-profile">
          <span className="profile-icon">A</span>

          <div>
            <strong>Administrator</strong>
            <small>Admin</small>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <h3>{stat.title}</h3>

            <div className="stat-value">
              {stat.value}
            </div>

            <p>{stat.description}</p>
          </div>
        ))}
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
            View All
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
        <h2>Quick Actions</h2>

        <div className="action-grid">

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
  );
};

export default AdminDashboard;