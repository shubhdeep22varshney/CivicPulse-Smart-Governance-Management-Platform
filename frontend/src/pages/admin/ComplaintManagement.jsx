import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/ComplaintManagement.css";

const INITIAL_MOCK_COMPLAINTS = [
  { id: "CMP-1001", category: "Sanitation & Waste", location: "Sector 18, Noida", createdAt: "2026-08-10", status: "Pending", citizenId: 101 },
  { id: "CMP-1002", category: "Public Works", location: "Indirapuram, Ghaziabad", createdAt: "2026-08-11", status: "In Progress", citizenId: 102 },
  { id: "CMP-1003", category: "Water Supply", location: "Raj Nagar, Ghaziabad", createdAt: "2026-08-12", status: "Resolved", citizenId: 103 },
  { id: "CMP-1004", category: "Electricity & Lights", location: "Connaught Place, Delhi", createdAt: "2026-08-14", status: "Pending", citizenId: 104 },
  { id: "CMP-1005", category: "Public Health", location: "Vaishali, Ghaziabad", createdAt: "2026-08-15", status: "In Progress", citizenId: 105 },
  { id: "CMP-1006", category: "Parks & Environment", location: "Sector 62, Noida", createdAt: "2026-08-16", status: "Resolved", citizenId: 106 },
];

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState(INITIAL_MOCK_COMPLAINTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/api/complaints")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch complaints");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setComplaints(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Complaint API error (using local dataset):", error);
        setLoading(false);
      });
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      String(complaint.id ?? "").toLowerCase().includes(searchText) ||
      String(complaint.category ?? "").toLowerCase().includes(searchText) ||
      String(complaint.location ?? "").toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All" || complaint.status === filter;

    return matchesSearch && matchesFilter;
  });

  const getStatusClass = (status) => {
    if (status === "Resolved") return "status resolved";
    if (status === "In Progress") return "status progress";
    return "status pending";
  };

  return (
    <div>
      <AdminNavbar />

      <div className="complaint-management">
        <div className="page-header">
          <div>
            <h1>Complaint Management</h1>
            <p>View and manage all citizen complaints by category and department</p>
          </div>
        </div>

        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by ID, Category, or Location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="complaint-card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint.id}>
                      <td>{complaint.id}</td>
                      <td>{complaint.category}</td>
                      <td>{complaint.location}</td>
                      <td>
                        {complaint.createdAt
                          ? new Date(complaint.createdAt).toLocaleDateString()
                          : "2026-08-16"}
                      </td>
                      <td>
                        <span className={getStatusClass(complaint.status)}>
                          {complaint.status}
                        </span>
                      </td>
                      <td>
                        <button className="view-btn">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-results">
                      No complaints found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintManagement;