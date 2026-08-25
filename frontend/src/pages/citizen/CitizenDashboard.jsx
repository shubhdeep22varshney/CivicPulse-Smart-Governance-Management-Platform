import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/CitizenDashboard.css";

function CitizenDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
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
            <p className="card-number">0</p>
            <span>Your registered complaints</span>
          </div>

          <div className="dashboard-card">
            <h3>Submitted</h3>
            <p className="card-number">0</p>
            <span>Complaints submitted</span>
          </div>

          <div className="dashboard-card">
            <h3>In Progress</h3>
            <p className="card-number">0</p>
            <span>Complaints being processed</span>
          </div>

          <div className="dashboard-card">
            <h3>Resolved</h3>
            <p className="card-number">0</p>
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