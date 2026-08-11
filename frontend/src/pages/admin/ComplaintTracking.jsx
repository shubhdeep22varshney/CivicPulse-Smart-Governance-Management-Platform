import React, { useState } from "react";
import "../../styles/ComplaintTracking.css";

const ComplaintTracking = () => {
  const [searchId, setSearchId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    const id = searchId.trim();

    if (!id) {
      setError("Please enter a Complaint ID.");
      setComplaint(null);
      return;
    }

    setLoading(true);
    setError("");
    setComplaint(null);

    try {
      const response = await fetch(
        `http://localhost:8081/api/complaints/${id}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Complaint not found.");
        }

        throw new Error("Failed to fetch complaint.");
      }

      const data = await response.json();

      setComplaint(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load complaint.");
    } finally {
      setLoading(false);
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
          placeholder="Enter Complaint ID (e.g. 1)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Track Complaint"}
        </button>
      </form>

      {error && <div className="not-found">{error}</div>}

      {complaint && (
        <div className="tracking-card">
          <div className="complaint-info">
            <h2>Complaint #{complaint.id}</h2>

            <div className="info-grid">
              <div>
                <span>Category</span>
                <strong>{complaint.category}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{complaint.location}</strong>
              </div>

              <div>
                <span>Priority</span>
                <strong>{complaint.priority}</strong>
              </div>

              <div>
                <span>Citizen ID</span>
                <strong>{complaint.citizenId}</strong>
              </div>
            </div>

            <div className="description">
              <span>Title</span>
              <p>{complaint.title}</p>
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