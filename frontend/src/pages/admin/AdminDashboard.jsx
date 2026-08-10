import React from "react";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Complaints",
      value: "248",
      description: "All complaints received",
    },
    {
      title: "Pending",
      value: "72",
      description: "Waiting for action",
    },
    {
      title: "In Progress",
      value: "96",
      description: "Currently being handled",
    },
    {
      title: "Resolved",
      value: "80",
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

  return (
    <div className="admin-dashboard">
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

      <section className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <h3>{stat.title}</h3>
            <div className="stat-value">{stat.value}</div>
            <p>{stat.description}</p>
          </div>
        ))}
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Recent Complaints</h2>
            <p>Latest complaints submitted by citizens</p>
          </div>

          <button className="view-all-btn">View All</button>
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

      <section className="quick-actions">
        <h2>Quick Actions</h2>

        <div className="action-grid">
          <button>Manage Complaints</button>
          <button>Update Status</button>
          <button>Track Complaints</button>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;