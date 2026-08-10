import React, { useState } from "react";
import "../../styles/StatusUpdates.css";

const StatusUpdates = () => {
  const [complaintId, setComplaintId] = useState("");
  const [status, setStatus] = useState("Pending");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!complaintId) {
      setMessage("Please enter a complaint ID.");
      return;
    }

    setMessage(`Status updated successfully for ${complaintId}.`);
  };

  return (
    <div className="status-updates">
      <div className="status-header">
        <h1>Status Updates</h1>
        <p>Update the status of citizen complaints</p>
      </div>

      <div className="status-card">
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Complaint ID</label>
            <input
              type="text"
              placeholder="Enter complaint ID (e.g. CMP-001)"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>New Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label>Comment</label>
            <textarea
              placeholder="Add an update or comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="5"
            />
          </div>

          <button type="submit" className="update-btn">
            Update Status
          </button>

          {message && <p className="update-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default StatusUpdates;