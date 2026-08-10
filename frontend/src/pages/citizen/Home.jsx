import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/Home.css";

// ---- Static demo data (clearly labeled as demo, not real backend data) ----
const stats = [
  { label: "Complaints Registered", value: "1,250+" },
  { label: "Complaints Resolved", value: "850+" },
  { label: "Resolution Rate", value: "95%" },
  { label: "Citizen Support", value: "24/7" },
];

const steps = [
  {
    title: "Register as a Citizen",
    desc: "Create your CivicPulse account with basic details in under 2 minutes.",
  },
  {
    title: "Report an Issue",
    desc: "Submit a civic complaint with a category, location, and description.",
  },
  {
    title: "Track Progress",
    desc: "Follow your complaint status: Submitted → In Review → Resolved.",
  },
  {
    title: "Get Notified",
    desc: "Receive updates as local administration acts on your complaint.",
  },
];

const features = [
  {
    title: "Easy Complaint Filing",
    desc: "Report civic issues like roads, water, or sanitation in a few clicks.",
  },
  {
    title: "Real-Time Status Tracking",
    desc: "Know exactly where your complaint stands, at every stage.",
  },
  {
    title: "Direct Communication",
    desc: "Stay in the loop with updates from local administration.",
  },
  {
    title: "Transparency Dashboard",
    desc: "See resolution rates and response times openly, not hidden away.",
  },
];

function Home() {
  const [noticeVisible, setNoticeVisible] = useState(true);

  return (
    <div>
      {/* Important civic notice banner — dismissible */}
      {noticeVisible && (
        <div className="notice-banner">
          <p>
            📢 <strong>Notice:</strong> CivicPulse is currently a student
            project (demo). No real complaints are being processed.
          </p>
          <button
            className="notice-close"
            onClick={() => setNoticeVisible(false)}
            aria-label="Close notice"
          >
            ✕
          </button>
        </div>
      )}

      <Navbar />

      {/* ---------- Hero Section ---------- */}
      <section className="hero">
        <div className="hero-content">
          <h1>Empowering Citizens. Enabling Governance.</h1>
          <p>
            CivicPulse connects citizens with local administration —
            report issues, track resolutions, and hold governance
            accountable, all in one platform.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary-large">
              Report an Issue
            </Link>
            <Link to="/login" className="btn btn-secondary-large">
              Track Complaint
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Stats Section ---------- */}
      <section className="stats-section">
        <p className="demo-label">Demo Data — for project illustration only</p>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <h2>{stat.value}</h2>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- How It Works ---------- */}
      <section className="how-it-works" id="how-it-works">
        <h2 className="section-title">How CivicPulse Works</h2>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-card" key={step.title}>
              <div className="step-number">{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Features Section ---------- */}
      <section className="features-section" id="features">
        <h2 className="section-title">Platform Features</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Transparency Section ---------- */}
      <section className="transparency-section">
        <div className="transparency-content">
          <h2 className="section-title">Transparency Score</h2>
          <p>
            A demo indicator showing how openly complaint resolution is
            tracked on this platform.
          </p>
          <div className="progress-bar-wrapper">
            <div className="progress-bar-fill" style={{ width: "95%" }}>
              95%
            </div>
          </div>
          <p className="demo-label">Demo value — not connected to a live backend</p>
        </div>
      </section>

      {/* ---------- About Section ---------- */}
      <section className="about-section" id="about">
        <h2 className="section-title">About CivicPulse</h2>
        <p>
          CivicPulse is a smart governance management platform built to
          bridge the gap between citizens and local administration. It
          allows citizens to report civic issues, track their resolution,
          and communicate directly with authorities — bringing
          transparency and accountability to local governance.
        </p>
      </section>

      {/* ---------- CTA Section ---------- */}
      <section className="cta-section">
        <h2>Ready to make your voice heard?</h2>
        <p>Join CivicPulse today and start reporting civic issues.</p>
        <Link to="/register" className="btn btn-primary-large">
          Get Started
        </Link>
      </section>

      <Footer />
    </div>
  );
}

export default Home;