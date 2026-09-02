import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/CitizenDashboard.css";

function CitizenDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        console.log("Logged-in user:", parsedUser);

        // For the current Riya account:
        // user ID 4 -> citizen ID 5
        const citizenId = parsedUser.citizenId || 5;

        fetch(`http://localhost:8081/api/citizens/${citizenId}/dashboard`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch dashboard statistics");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Dashboard statistics:", data);

            setStats({
              totalComplaints: data.totalComplaints || 0,
              pendingComplaints: data.pendingComplaints || 0,
              inProgressComplaints: data.inProgressComplaints || 0,
              resolvedComplaints: data.resolvedComplaints || 0,
            });
          })
          .catch((error) => {
            console.error("Dashboard API error:", error);
          });

      } catch (error) {
        console.error("Error reading user data:", error);
      }
    }
  }, []);

  const handleRegisterComplaint = () => {
    navigate("/register-complaint");
  };

  const handleTrackComplaint = () => {
    navigate("/track-complaint");
  };

  return (
    <div className="citizen-dashboard">
      <Navbar />

      <main className="dashboard-container">

        {/* Welcome Section */}
        <section className="dashboard-header">
          <h1>
            Welcome, {user?.name || user?.fullName || "Citizen"} 👋
          </h1>

          <p>
            Manage your complaints and track their status from here.
          </p>
        </section>

        {/* Dashboard Cards */}
        <section className="dashboard-cards">

          <div className="dashboard-card">
            <h3>Total Complaints</h3>
            <p className="card-number">
              {stats.totalComplaints}
            </p>
            <span>Your registered complaints</span>
          </div>

          <div className="dashboard-card">
            <h3>Submitted</h3>
            <p className="card-number">
              {stats.pendingComplaints}
            </p>
            <span>Complaints submitted</span>
          </div>

          <div className="dashboard-card">
            <h3>In Progress</h3>
            <p className="card-number">
              {stats.inProgressComplaints}
            </p>
            <span>Complaints being processed</span>
          </div>

          <div className="dashboard-card">
            <h3>Resolved</h3>
            <p className="card-number">
              {stats.resolvedComplaints}
            </p>
            <span>Complaints resolved</span>
          </div>

        </section>

        {/* Actions */}
        <section className="dashboard-actions">

          <div className="action-card">
            <h2>Register a Complaint</h2>

            <p>
              Report a civic issue and submit it to the concerned
              department.
            </p>

            <button onClick={handleRegisterComplaint}>
              Register Complaint
            </button>
          </div>

          <div className="action-card">
            <h2>Track Your Complaint</h2>

            <p>
              Check the current status and details of your submitted
              complaints.
            </p>

            <button onClick={handleTrackComplaint}>
              Track Complaint
            </button>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}

export default CitizenDashboard;