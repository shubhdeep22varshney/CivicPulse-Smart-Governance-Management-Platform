import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/TrackComplaint.css";

function TrackComplaint() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setIsLoading(true);
    setError("");

    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        throw new Error("Please login again.");
      }

      const user = JSON.parse(storedUser);

      const citizenId = user.citizenId || user.id;

      if (!citizenId) {
        throw new Error("Citizen ID not found. Please login again.");
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8081/api/complaints/citizen/${citizenId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        }
      );

      let data = [];

      try {
        data = await response.json();
      } catch {
        data = [];
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch complaints."
        );
      }

      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch complaints error:", err);

      if (err instanceof TypeError) {
        setError(
          "Unable to connect to the server. Please make sure the Spring Boot backend is running on port 8081."
        );
      } else {
        setError(err.message || "Unable to fetch complaints.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const normalizedStatus = status?.toUpperCase();

    if (normalizedStatus === "RESOLVED") {
      return "status-resolved";
    }

    if (
      normalizedStatus === "IN_PROGRESS" ||
      normalizedStatus === "IN PROGRESS"
    ) {
      return "status-progress";
    }

    if (normalizedStatus === "REJECTED") {
      return "status-rejected";
    }

    return "status-pending";
  };

  const formatStatus = (status) => {
    if (!status) {
      return "PENDING";
    }

    return status.replace(/_/g, " ");
  };

  return (
    <div className="track-complaint-page">
      <Navbar />

      <main className="track-complaint-container">

        {/* Header */}
        <section className="track-header">
          <span className="track-badge">
            🔎 Citizen Portal
          </span>

          <h1>Track Your Complaint</h1>

          <p>
            View your submitted complaints and check their
            current status.
          </p>
        </section>

        {/* Back Button */}
        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/citizen/dashboard")}
        >
          ← Back to Dashboard
        </button>

        {/* Loading */}
        {isLoading && (
          <div className="track-message">
            <div className="loading-spinner"></div>
            <p>Loading your complaints...</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="track-error-box">
            <p>{error}</p>

            <button
              onClick={fetchComplaints}
              className="retry-btn"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No complaints */}
        {!isLoading &&
          !error &&
          complaints.length === 0 && (
            <div className="no-complaints-card">
              <div className="no-complaints-icon">
                📋
              </div>

              <h2>No Complaints Found</h2>

              <p>
                You have not registered any complaints yet.
              </p>

              <button
                className="register-now-btn"
                onClick={() =>
                  navigate("/register-complaint")
                }
              >
                Register a Complaint
              </button>
            </div>
          )}

        {/* Complaint List */}
        {!isLoading &&
          !error &&
          complaints.length > 0 && (
            <section className="complaints-list">

              <div className="complaints-list-header">
                <h2>Your Complaints</h2>

                <span>
                  {complaints.length} Complaint
                  {complaints.length !== 1 ? "s" : ""}
                </span>
              </div>

              {complaints.map((complaint, index) => (
                <div
                  className="complaint-track-card"
                  key={
                    complaint.id ||
                    complaint.complaintId ||
                    index
                  }
                >

                  {/* Top */}
                  <div className="complaint-card-top">

                    <div>
                      <span className="complaint-id">
                        Complaint #
                        {complaint.id ||
                          complaint.complaintId ||
                          index + 1}
                      </span>

                      <h3>
                        {complaint.title ||
                          "Untitled Complaint"}
                      </h3>
                    </div>

                    <span
                      className={`status-badge ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {formatStatus(
                        complaint.status
                      )}
                    </span>

                  </div>

                  {/* Description */}
                  <p className="complaint-description">
                    {complaint.description ||
                      "No description available."}
                  </p>

                  {/* Details */}
                  <div className="complaint-details">

                    <div className="detail-item">
                      <span className="detail-label">
                        Category
                      </span>

                      <span className="detail-value">
                        {complaint.category || "-"}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">
                        Location
                      </span>

                      <span className="detail-value">
                        {complaint.location || "-"}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">
                        Priority
                      </span>

                      <span
                        className={`priority-value priority-${(
                          complaint.priority || "low"
                        ).toLowerCase()}`}
                      >
                        {complaint.priority || "-"}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">
                        Department
                      </span>

                      <span className="detail-value">
                        {complaint.departmentId || "-"}
                      </span>
                    </div>

                  </div>

                </div>
              ))}

            </section>
          )}

      </main>

      <Footer />
    </div>
  );
}

export default TrackComplaint;