import React, { useEffect, useState } from "react";
import "../../styles/ComplaintManagement.css";

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/api/complaints")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch complaints");
        }
        return response.json();
      })
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Complaint API error:", error);
        setError("Unable to load complaints");
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

  if (loading) {
    return (
      <div className="complaint-management">
        <h2>Loading complaints...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="complaint-management">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="complaint-management">
      <div className="page-header">
        <div>
          <h1>Complaint Management</h1>
          <p>View and manage citizen complaints</p>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search complaints..."
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
                        : "-"}
                    </td>
                    <td>
                      <span className={getStatusClass(complaint.status)}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>
                      <button className="view-btn">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplaintManagement;