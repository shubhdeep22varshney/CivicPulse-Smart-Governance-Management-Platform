import React, { useState } from "react";
import "../../styles/ComplaintTracking.css";

const ComplaintTracking = () => {
  const [searchId, setSearchId] = useState("");
  const [complaint, setComplaint] = useState(null);

  const complaints = {
    "CMP-001": {
      id: "CMP-001",
      citizen: "Rahul Sharma",
      category: "Road",
      location: "Ghaziabad",
      date: "10 Aug 2026",
      status: "In Progress",
      description: "Road damage reported near the main market.",
    },
    "CMP-002": {
      id: "CMP-002",
      citizen: "Priya Singh",
      category: "Water",
      location: "Noida",
      date: "09 Aug 2026",
      status: "Pending",
      description: "Water supply issue reported in the residential area.",
    },
    "CMP-003": {
      id: "CMP-003",
      citizen: "Aman Verma",
      category: "Garbage",
      location: "Delhi",
      date: "08 Aug 2026",
      status: "Resolved",
      description: "Garbage collection issue reported.",
    },
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const id = searchId.trim().toUpperCase();

    if (complaints[id]) {
      setComplaint(complaints[id]);
    } else {
      setComplaint(null);
    }
  };

  const getStepClass = (step) => {
    if (!complaint) return "";

    const statusOrder = {
      Pending: 1,
      "In Progress": 2,
      Resolved: 3,
    };

    const currentStep = statusOrder[complaint.status] || 1;

    return step <= currentStep ? "completed" : "";
  };

  return (
    <div className="complaint-tracking">
      <div className="tracking-header">
        <h1>Complaint Tracking</h1>
        <p>Track the current status of a citizen complaint</p>
      </div>

      <form className="tracking-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter Complaint ID (e.g. CMP-001)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <button type="submit">Track Complaint</button>
      </form>

      {searchId && !complaint && (
        <div className="not-found">
          Complaint not found. Please check the Complaint ID.
        </div>
      )}

      {complaint && (
        <div className="tracking-card">
          <div className="complaint-info">
            <h2>{complaint.id}</h2>

            <div className="info-grid">
              <div>
                <span>Citizen</span>
                <strong>{complaint.citizen}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{complaint.category}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{complaint.location}</strong>
              </div>

              <div>
                <span>Date Submitted</span>
                <strong>{complaint.date}</strong>
              </div>
            </div>

            <div className="description">
              <span>Description</span>
              <p>{complaint.description}</p>
            </div>
          </div>

          <div className="current-status">
            <span>Current Status</span>
            <strong>{complaint.status}</strong>
          </div>

          <div className="timeline">
            <div className={`timeline-step ${getStepClass(1)}`}>
              <div className="timeline-dot">1</div>
              <div>
                <h3>Complaint Submitted</h3>
                <p>Complaint has been received.</p>
              </div>
            </div>

            <div className={`timeline-step ${getStepClass(2)}`}>
              <div className="timeline-dot">2</div>
              <div>
                <h3>In Progress</h3>
                <p>Complaint is being handled by the department.</p>
              </div>
            </div>

            <div className={`timeline-step ${getStepClass(3)}`}>
              <div className="timeline-dot">3</div>
              <div>
                <h3>Resolved</h3>
                <p>Complaint has been successfully resolved.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintTracking;