import React, { useState } from "react";
import "../../styles/ComplaintManagement.css";

const ComplaintManagement = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const complaints = [
    {
      id: "CMP-001",
      citizen: "Rahul Sharma",
      category: "Road",
      location: "Ghaziabad",
      date: "10 Aug 2026",
      status: "Pending",
    },
    {
      id: "CMP-002",
      citizen: "Priya Singh",
      category: "Water",
      location: "Noida",
      date: "09 Aug 2026",
      status: "In Progress",
    },
    {
      id: "CMP-003",
      citizen: "Aman Verma",
      category: "Garbage",
      location: "Delhi",
      date: "08 Aug 2026",
      status: "Resolved",
    },
    {
      id: "CMP-004",
      citizen: "Neha Gupta",
      category: "Street Light",
      location: "Ghaziabad",
      date: "07 Aug 2026",
      status: "Pending",
    },
  ];

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.id.toLowerCase().includes(search.toLowerCase()) ||
      complaint.citizen.toLowerCase().includes(search.toLowerCase()) ||
      complaint.category.toLowerCase().includes(search.toLowerCase()) ||
      complaint.location.toLowerCase().includes(search.toLowerCase());

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
                <th>Citizen</th>
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
                    <td>{complaint.citizen}</td>
                    <td>{complaint.category}</td>
                    <td>{complaint.location}</td>
                    <td>{complaint.date}</td>
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
                  <td colSpan="7" className="no-results">
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