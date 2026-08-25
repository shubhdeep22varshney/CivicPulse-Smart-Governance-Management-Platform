import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import RegisterOfficerModal from "../../components/RegisterOfficerModal";
import "../../styles/DepartmentDashboard.css";

// Initial realistic fallback municipal department dataset
const INITIAL_DEPARTMENTS = [
  {
    id: "swm",
    name: "Sanitation & Waste Management",
    code: "SWM",
    head: "Rajesh Sharma",
    contact: "swm@civicpulse.gov.in",
    pending: 42,
    inProgress: 68,
    resolved: 310,
    highPriority: 18,
    medPriority: 32,
    lowPriority: 60,
    avgResolutionHours: 16.4,
    slaCompliance: 96.2,
    efficiencyRating: "A+",
    recentActivity: "Clearance of main market waste dump completed. 5 new compactor trucks deployed.",
  },
  {
    id: "pwi",
    name: "Public Works & Infrastructure",
    code: "PWI",
    head: "Ananya Deshmukh",
    contact: "pwi@civicpulse.gov.in",
    pending: 89,
    inProgress: 114,
    resolved: 245,
    highPriority: 45,
    medPriority: 52,
    lowPriority: 17,
    avgResolutionHours: 42.8,
    slaCompliance: 88.5,
    efficiencyRating: "B+",
    recentActivity: "Sector 14 pothole resurfacing in progress. Drainage widening ongoing.",
  },
  {
    id: "wss",
    name: "Water Supply & Sewerage",
    code: "WSS",
    head: "Vram Kishor",
    contact: "water@civicpulse.gov.in",
    pending: 31,
    inProgress: 56,
    resolved: 289,
    highPriority: 24,
    medPriority: 40,
    lowPriority: 47,
    avgResolutionHours: 19.2,
    slaCompliance: 94.8,
    efficiencyRating: "A",
    recentActivity: "Pipeline repair near Block C completed. Pressure restored to normal.",
  },
  {
    id: "esl",
    name: "Electricity & Street Lighting",
    code: "ESL",
    head: "Sanjay Verma",
    contact: "power@civicpulse.gov.in",
    pending: 19,
    inProgress: 37,
    resolved: 342,
    highPriority: 12,
    medPriority: 22,
    lowPriority: 65,
    avgResolutionHours: 11.5,
    slaCompliance: 98.1,
    efficiencyRating: "A+",
    recentActivity: "Replaced 120 LED streetlights along Expressway GT road.",
  },
  {
    id: "phh",
    name: "Public Health & Hygiene",
    code: "PHH",
    head: "Dr. Meera Nair",
    contact: "health@civicpulse.gov.in",
    pending: 27,
    inProgress: 41,
    resolved: 198,
    highPriority: 15,
    medPriority: 29,
    lowPriority: 41,
    avgResolutionHours: 21.0,
    slaCompliance: 92.4,
    efficiencyRating: "A",
    recentActivity: "Mosquito fogging campaign completed across 14 residential zones.",
  },
  {
    id: "pe",
    name: "Environment & Parks",
    code: "PE",
    head: "Harpreet Singh",
    contact: "parks@civicpulse.gov.in",
    pending: 14,
    inProgress: 23,
    resolved: 165,
    highPriority: 4,
    medPriority: 18,
    lowPriority: 63,
    avgResolutionHours: 28.6,
    slaCompliance: 95.0,
    efficiencyRating: "A",
    recentActivity: "Overhanging tree trimming in Ward 8. Central Park fountain restored.",
  },
  {
    id: "tt",
    name: "Traffic & Transportation",
    code: "TT",
    head: "Vikram Malhotra",
    contact: "traffic@civicpulse.gov.in",
    pending: 23,
    inProgress: 38,
    resolved: 182,
    highPriority: 16,
    medPriority: 27,
    lowPriority: 35,
    avgResolutionHours: 24.3,
    slaCompliance: 91.7,
    efficiencyRating: "A",
    recentActivity: "Smart signal timer recalibrated at Sector 62 intersection.",
  },
];

// Timeline historical data for trend line diagram
const TIMELINE_DATA = [
  { label: "Mon", incoming: 48, resolved: 42 },
  { label: "Tue", incoming: 62, resolved: 55 },
  { label: "Wed", incoming: 54, resolved: 60 },
  { label: "Thu", incoming: 75, resolved: 68 },
  { label: "Fri", incoming: 82, resolved: 79 },
  { label: "Sat", incoming: 40, resolved: 50 },
  { label: "Sun", incoming: 28, resolved: 34 },
];

const DepartmentDashboard = () => {
  const navigate = useNavigate();

  // State variables
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [selectedDeptId, setSelectedDeptId] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeModalDept, setActiveModalDept] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: "" });

  // Fetch API complaints & department records with fallback to state
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8081/api/departments").then((r) => r.ok ? r.json() : []).catch(() => []),
      fetch("http://localhost:8081/api/complaints").then((r) => r.ok ? r.json() : []).catch(() => []),
    ])
      .then(([apiDepartments, apiComplaints]) => {
        let baseDepts = [...INITIAL_DEPARTMENTS];

        // Merge API departments if returned from backend DB
        if (Array.isArray(apiDepartments) && apiDepartments.length > 0) {
          apiDepartments.forEach((dbDept) => {
            const exists = baseDepts.some(
              (d) => d.name.toLowerCase() === dbDept.departmentName?.toLowerCase() || d.id === String(dbDept.id)
            );
            if (!exists && dbDept.departmentName) {
              const code = dbDept.departmentName.split(" ").map((w) => w[0]).join("").toUpperCase();
              baseDepts.push({
                id: String(dbDept.id),
                name: dbDept.departmentName,
                code: code || "DEPT",
                head: "Department Head",
                contact: dbDept.phone ? `Ph: ${dbDept.phone}` : `${code.toLowerCase()}@civicpulse.gov.in`,
                pending: 0,
                inProgress: 0,
                resolved: 0,
                highPriority: 5,
                medPriority: 10,
                lowPriority: 15,
                avgResolutionHours: 24.0,
                slaCompliance: 90.0,
                efficiencyRating: "A",
                recentActivity: `Active operations at ${dbDept.location || "Central Zone"}`,
              });
            }
          });
        }

        if (Array.isArray(apiComplaints) && apiComplaints.length > 0) {
          const deptMap = {};
          baseDepts.forEach((d) => {
            deptMap[d.name] = { ...d, pending: 0, inProgress: 0, resolved: 0 };
          });

          apiComplaints.forEach((c) => {
            const cat = c.category || "Sanitation & Waste Management";
            const match = Object.keys(deptMap).find(
              (k) => k.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(k.toLowerCase())
            );
            const deptKey = match || baseDepts[0].name;

            const st = (c.status || "").toUpperCase();
            if (st === "RESOLVED") deptMap[deptKey].resolved += 1;
            else if (st === "IN_PROGRESS" || st === "IN PROGRESS") deptMap[deptKey].inProgress += 1;
            else deptMap[deptKey].pending += 1;
          });

          setDepartments(Object.values(deptMap));
        } else {
          setDepartments(baseDepts);
        }
      })
      .catch((err) => {
        console.log("Using dynamic department analytics model:", err.message);
      });
  }, []);

  // Filtered departments list based on selection and search
  const filteredDepartments = useMemo(() => {
    return departments.filter((d) => {
      const matchesDept = selectedDeptId === "all" || d.id === selectedDeptId;
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.head.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [departments, selectedDeptId, searchQuery]);

  // Aggregate KPI Statistics
  const aggregateStats = useMemo(() => {
    const targetDepts = selectedDeptId === "all"
      ? departments
      : departments.filter((d) => d.id === selectedDeptId);

    const pending = targetDepts.reduce((acc, curr) => acc + curr.pending, 0);
    const inProgress = targetDepts.reduce((acc, curr) => acc + curr.inProgress, 0);
    const resolved = targetDepts.reduce((acc, curr) => acc + curr.resolved, 0);
    const total = pending + inProgress + resolved;
    const avgSla = targetDepts.length > 0
      ? (targetDepts.reduce((acc, curr) => acc + curr.slaCompliance, 0) / targetDepts.length).toFixed(1)
      : 0;
    const avgHours = targetDepts.length > 0
      ? (targetDepts.reduce((acc, curr) => acc + curr.avgResolutionHours, 0) / targetDepts.length).toFixed(1)
      : 0;

    return { total, pending, inProgress, resolved, avgSla, avgHours };
  }, [departments, selectedDeptId]);

  // Tooltip handler
  const handleMouseEnter = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      text,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, text: "" });
  };

  // CSV Export functionality
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Department Code,Department Name,Head,Existing (Pending),In Progress,Done (Resolved),Total,SLA Compliance (%),Avg Resolution (Hrs)\n";

    filteredDepartments.forEach((d) => {
      const total = d.pending + d.inProgress + d.resolved;
      csvContent += `"${d.code}","${d.name}","${d.head}",${d.pending},${d.inProgress},${d.resolved},${total},${d.slaCompliance}%,${d.avgResolutionHours}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Department_Complaints_Report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper rating styling class
  const getRatingClass = (rating) => {
    if (rating === "A+") return "rating-tag rating-aplus";
    if (rating === "A") return "rating-tag rating-a";
    return "rating-tag rating-b";
  };

  // Compute Donut SVG Arc paths
  const donutData = useMemo(() => {
    const { pending, inProgress, resolved, total } = aggregateStats;
    if (total === 0) return [];
    
    const items = [
      { label: "Done (Resolved)", value: resolved, color: "#10b981" },
      { label: "In Progress", value: inProgress, color: "#0284c7" },
      { label: "Existing (Pending)", value: pending, color: "#f97316" },
    ];

    let cumulativePercent = 0;
    return items.map((item) => {
      const percent = item.value / total;
      const startAngle = cumulativePercent * 2 * Math.PI;
      cumulativePercent += percent;
      const endAngle = cumulativePercent * 2 * Math.PI;

      // Inner / outer radius
      const rOuter = 85;
      const rInner = 55;
      const cx = 110;
      const cy = 110;

      const x1Outer = cx + rOuter * Math.sin(startAngle);
      const y1Outer = cy - rOuter * Math.cos(startAngle);
      const x2Outer = cx + rOuter * Math.sin(endAngle);
      const y2Outer = cy - rOuter * Math.cos(endAngle);

      const x1Inner = cx + rInner * Math.sin(endAngle);
      const y1Inner = cy - rInner * Math.cos(endAngle);
      const x2Inner = cx + rInner * Math.sin(startAngle);
      const y2Inner = cy - rInner * Math.cos(startAngle);

      const largeArcFlag = percent > 0.5 ? 1 : 0;

      const pathData = [
        `M ${x1Outer} ${y1Outer}`,
        `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
        `L ${x1Inner} ${y1Inner}`,
        `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}`,
        "Z",
      ].join(" ");

      return {
        ...item,
        percent: (percent * 100).toFixed(1),
        pathData,
      };
    });
  }, [aggregateStats]);

  // Compute Timeline Chart SVG points
  const timelineSvg = useMemo(() => {
    const maxVal = Math.max(...TIMELINE_DATA.map((d) => Math.max(d.incoming, d.resolved))) + 10;
    const width = 500;
    const height = 180;
    const padding = 30;

    const dx = (width - padding * 2) / (TIMELINE_DATA.length - 1);

    const incomingPoints = TIMELINE_DATA.map((d, i) => {
      const x = padding + i * dx;
      const y = height - padding - (d.incoming / maxVal) * (height - padding * 2);
      return `${x},${y}`;
    }).join(" ");

    const resolvedPoints = TIMELINE_DATA.map((d, i) => {
      const x = padding + i * dx;
      const y = height - padding - (d.resolved / maxVal) * (height - padding * 2);
      return `${x},${y}`;
    }).join(" ");

    return { incomingPoints, resolvedPoints, width, height, padding, dx, maxVal };
  }, []);

  // Compute Bar Chart Max value
  const maxDeptComplaints = useMemo(() => {
    return Math.max(...departments.map((d) => d.pending + d.inProgress + d.resolved)) || 1;
  }, [departments]);

  return (
    <div>
      <AdminNavbar />
      <div className="department-dashboard">

      {/* Floating Tooltip */}
      {tooltip.show && (
        <div
          className="chart-tooltip"
          style={{ top: tooltip.y, left: tooltip.x, transform: "translate(-50%, -100%)" }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Page Header */}
      <header className="dept-header">
        <div className="dept-title-area">
          <h1>
            Department-Wise Dashboard
            <span className="dept-badge">Analytics & Reports</span>
          </h1>
          <p>Real-time complaint distribution, SLAs, and performance metrics by municipal department</p>
        </div>

        <div className="dept-header-actions">
          {/* Register Officer Button */}
          <button
            className="refresh-btn"
            onClick={() => setIsOfficerModalOpen(true)}
            style={{ background: "#0284c7", color: "#fff", borderColor: "#0284c7", fontWeight: 700 }}
          >
            ➕ Register Officer
          </button>

          {/* Back to Admin Overview */}
          <button className="refresh-btn" onClick={() => navigate("/admin/dashboard")}>
            &larr; General Overview
          </button>

          {/* Department Filter Selector */}
          <select
            className="dept-select-dropdown"
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
          >
            <option value="all">All Departments ({departments.length})</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>

          {/* Time Range Filter */}
          <select
            className="date-filter-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>

          {/* Export Report Action */}
          <button className="export-btn" onClick={() => setShowExportModal(true)}>
            📊 Generate Report
          </button>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <section className="kpi-grid">
        <div className="kpi-card total">
          <div className="kpi-header">
            <span className="kpi-title">Total Complaints</span>
            <div className="kpi-icon">📁</div>
          </div>
          <div className="kpi-value">{aggregateStats.total}</div>
          <div className="kpi-footer">
            <span className="trend-up">&uarr; 8.4%</span> vs previous period
          </div>
        </div>

        <div className="kpi-card pending">
          <div className="kpi-header">
            <span className="kpi-title">Existing / Pending</span>
            <div className="kpi-icon">⏳</div>
          </div>
          <div className="kpi-value">{aggregateStats.pending}</div>
          <div className="kpi-footer">
            <span className="trend-down">&uarr; 3.1%</span> unassigned queue
          </div>
        </div>

        <div className="kpi-card progress">
          <div className="kpi-header">
            <span className="kpi-title">In Progress</span>
            <div className="kpi-icon">⚙️</div>
          </div>
          <div className="kpi-value">{aggregateStats.inProgress}</div>
          <div className="kpi-footer">
            <span className="trend-up">Active</span> field crew work
          </div>
        </div>

        <div className="kpi-card resolved">
          <div className="kpi-header">
            <span className="kpi-title">Done / Resolved</span>
            <div className="kpi-icon">✅</div>
          </div>
          <div className="kpi-value">{aggregateStats.resolved}</div>
          <div className="kpi-footer">
            <span className="trend-up">&uarr; 12.6%</span> closure rate
          </div>
        </div>

        <div className="kpi-card sla">
          <div className="kpi-header">
            <span className="kpi-title">SLA Compliance</span>
            <div className="kpi-icon">🎯</div>
          </div>
          <div className="kpi-value">{aggregateStats.avgSla}%</div>
          <div className="kpi-footer">
            Avg resolution: <strong>{aggregateStats.avgHours} hrs</strong>
          </div>
        </div>
      </section>

      {/* Visual Analytics & Diagrams Grid */}
      <section className="analytics-grid">

        {/* 1. Department Breakdown Bar Chart Diagram */}
        <div className="diagram-card col-8">
          <div className="diagram-header">
            <div className="diagram-title">
              <h3>Department Complaint Breakdown Diagram</h3>
              <p>Comparative volume of Existing (Pending), In Progress, and Resolved complaints per department</p>
            </div>

            <div className="diagram-legend">
              <div className="legend-item">
                <span className="legend-dot dot-pending"></span> Existing (Pending)
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-progress"></span> In Progress
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-resolved"></span> Done (Resolved)
              </div>
            </div>
          </div>

          <div className="bar-chart-container">
            <svg className="svg-bar-chart" viewBox="0 0 700 240" preserveAspectRatio="none">
              {/* Background Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio) => (
                <line
                  key={ratio}
                  x1="40"
                  y1={200 - ratio * 170}
                  x2="680"
                  y2={200 - ratio * 170}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Department Bars */}
              {departments.map((d, index) => {
                const groupWidth = (640 / departments.length);
                const xBase = 50 + index * groupWidth;
                const barW = Math.min(18, groupWidth / 3.5);

                const hPending = (d.pending / maxDeptComplaints) * 160;
                const hProgress = (d.inProgress / maxDeptComplaints) * 160;
                const hResolved = (d.resolved / maxDeptComplaints) * 160;

                return (
                  <g key={d.id} className="bar-group">
                    {/* Existing / Pending Bar */}
                    <rect
                      x={xBase}
                      y={200 - hPending}
                      width={barW}
                      height={hPending}
                      fill="#f97316"
                      rx="3"
                      onMouseEnter={(e) => handleMouseEnter(e, `${d.code}: ${d.pending} Existing/Pending`)}
                      onMouseLeave={handleMouseLeave}
                    />

                    {/* In Progress Bar */}
                    <rect
                      x={xBase + barW + 3}
                      y={200 - hProgress}
                      width={barW}
                      height={hProgress}
                      fill="#0284c7"
                      rx="3"
                      onMouseEnter={(e) => handleMouseEnter(e, `${d.code}: ${d.inProgress} In Progress`)}
                      onMouseLeave={handleMouseLeave}
                    />

                    {/* Done / Resolved Bar */}
                    <rect
                      x={xBase + (barW + 3) * 2}
                      y={200 - hResolved}
                      width={barW}
                      height={hResolved}
                      fill="#10b981"
                      rx="3"
                      onMouseEnter={(e) => handleMouseEnter(e, `${d.code}: ${d.resolved} Done/Resolved`)}
                      onMouseLeave={handleMouseLeave}
                    />

                    {/* Department Code Label */}
                    <text
                      x={xBase + barW * 1.5 + 3}
                      y="218"
                      textAnchor="middle"
                      fill="#475569"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {d.code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 2. Complaint Status Distribution Donut Diagram */}
        <div className="diagram-card col-4">
          <div className="diagram-header">
            <div className="diagram-title">
              <h3>Status Distribution</h3>
              <p>Overall status proportions</p>
            </div>
          </div>

          <div className="donut-container">
            <svg className="svg-donut" viewBox="0 0 220 220">
              {donutData.map((slice, i) => (
                <path
                  key={i}
                  d={slice.pathData}
                  fill={slice.color}
                  onMouseEnter={(e) => handleMouseEnter(e, `${slice.label}: ${slice.value} (${slice.percent}%)`)}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                />
              ))}

              <text x="110" y="105" className="donut-center-text donut-center-value">
                {aggregateStats.total}
              </text>
              <text x="110" y="125" className="donut-center-text donut-center-label">
                Complaints
              </text>
            </svg>

            <div className="donut-legend-list">
              {donutData.map((slice, i) => (
                <div key={i} className="donut-legend-row">
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="legend-dot" style={{ background: slice.color }}></span>
                    {slice.label}
                  </span>
                  <strong>{slice.value} ({slice.percent}%)</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Complaint Volume & Resolution Timeline Curve */}
        <div className="diagram-card col-8">
          <div className="diagram-header">
            <div className="diagram-title">
              <h3>Complaint Reception vs Resolution Trend</h3>
              <p>Daily complaint volume received vs successfully resolved over time</p>
            </div>

            <div className="diagram-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#3b82f6" }}></span> Incoming
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#10b981" }}></span> Resolved
              </div>
            </div>
          </div>

          <svg className="svg-timeline-chart" viewBox="0 0 500 180" preserveAspectRatio="none">
            {/* Horizontal Grid */}
            {[0.2, 0.5, 0.8].map((ratio) => (
              <line
                key={ratio}
                x1="30"
                y1={180 * ratio}
                x2="470"
                y2={180 * ratio}
                stroke="#f1f5f9"
              />
            ))}

            {/* Polyline for Incoming Complaints */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              points={timelineSvg.incomingPoints}
            />

            {/* Polyline for Resolved Complaints */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              points={timelineSvg.resolvedPoints}
            />

            {/* Data Points */}
            {TIMELINE_DATA.map((d, i) => {
              const x = timelineSvg.padding + i * timelineSvg.dx;
              const yIn = timelineSvg.height - timelineSvg.padding - (d.incoming / timelineSvg.maxVal) * (timelineSvg.height - timelineSvg.padding * 2);
              const yRes = timelineSvg.height - timelineSvg.padding - (d.resolved / timelineSvg.maxVal) * (timelineSvg.height - timelineSvg.padding * 2);

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={yIn}
                    r="4"
                    fill="#3b82f6"
                    onMouseEnter={(e) => handleMouseEnter(e, `${d.label} Incoming: ${d.incoming}`)}
                    onMouseLeave={handleMouseLeave}
                  />
                  <circle
                    cx={x}
                    cy={yRes}
                    r="4"
                    fill="#10b981"
                    onMouseEnter={(e) => handleMouseEnter(e, `${d.label} Resolved: ${d.resolved}`)}
                    onMouseLeave={handleMouseLeave}
                  />
                  <text x={x} y="172" textAnchor="middle" fontSize="11" fill="#64748b">
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 4. SLA Efficiency Semi-Circle Gauge */}
        <div className="diagram-card col-4">
          <div className="diagram-header">
            <div className="diagram-title">
              <h3>Resolution Efficiency Gauge</h3>
              <p>Overall SLA performance index</p>
            </div>
          </div>

          <div className="gauge-container">
            <svg className="svg-gauge" viewBox="0 0 200 110">
              {/* Background Arch */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* SLA Colored Gauge Arch (Calculated dynamically) */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#10b981"
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray={`${(aggregateStats.avgSla / 100) * 251.2} 251.2`}
              />
            </svg>

            <div className="gauge-score-value">{aggregateStats.avgSla}%</div>
            <div className="gauge-score-label">SLA Compliance Rate</div>

            <div className="gauge-stats-row">
              <div className="gauge-stat-item">
                <small>Avg Speed</small>
                <strong>{aggregateStats.avgHours}h</strong>
              </div>
              <div className="gauge-stat-item">
                <small>Target SLA</small>
                <strong>&lt; 24.0h</strong>
              </div>
              <div className="gauge-stat-item">
                <small>Grade</small>
                <strong>Exemplary</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Department Urgency & Priority Breakdown */}
        <div className="diagram-card col-12">
          <div className="diagram-header">
            <div className="diagram-title">
              <h3>Department Urgency & Priority Distribution</h3>
              <p>Breakdown of High, Medium, and Low urgency complaints across departments</p>
            </div>

            <div className="diagram-legend">
              <div className="legend-item"><span className="legend-dot dot-high"></span> High Urgency</div>
              <div className="legend-item"><span className="legend-dot dot-medium"></span> Medium Urgency</div>
              <div className="legend-item"><span className="legend-dot dot-low"></span> Low Urgency</div>
            </div>
          </div>

          <div className="priority-list">
            {filteredDepartments.map((d) => {
              const totalP = d.highPriority + d.medPriority + d.lowPriority || 1;
              const pctHigh = ((d.highPriority / totalP) * 100).toFixed(1);
              const pctMed = ((d.medPriority / totalP) * 100).toFixed(1);
              const pctLow = ((d.lowPriority / totalP) * 100).toFixed(1);

              return (
                <div key={d.id} className="priority-item">
                  <div className="priority-item-header">
                    <span><strong>{d.name}</strong> ({d.code})</span>
                    <span>High: {d.highPriority} | Med: {d.medPriority} | Low: {d.lowPriority}</span>
                  </div>

                  <div className="priority-bar-track">
                    <div
                      className="priority-segment segment-high"
                      style={{ width: `${pctHigh}%` }}
                      onMouseEnter={(e) => handleMouseEnter(e, `High Urgency: ${d.highPriority} (${pctHigh}%)`)}
                      onMouseLeave={handleMouseLeave}
                    ></div>
                    <div
                      className="priority-segment segment-med"
                      style={{ width: `${pctMed}%` }}
                      onMouseEnter={(e) => handleMouseEnter(e, `Medium Urgency: ${d.medPriority} (${pctMed}%)`)}
                      onMouseLeave={handleMouseLeave}
                    ></div>
                    <div
                      className="priority-segment segment-low"
                      style={{ width: `${pctLow}%` }}
                      onMouseEnter={(e) => handleMouseEnter(e, `Low Urgency: ${d.lowPriority} (${pctLow}%)`)}
                      onMouseLeave={handleMouseLeave}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* Detailed Department Performance Table */}
      <section className="table-section">
        <div className="table-controls">
          <div className="diagram-title">
            <h3>Departmental Performance Matrix</h3>
            <p>Complete status register and resolution metrics</p>
          </div>

          <div className="table-search-box">
            <svg className="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search department or head..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="dept-table-wrapper">
          <table className="dept-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Head of Dept</th>
                <th>Existing (Pending)</th>
                <th>In Progress</th>
                <th>Done (Resolved)</th>
                <th>Total Volume</th>
                <th>SLA Compliance</th>
                <th>Efficiency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((d) => {
                const totalComp = d.pending + d.inProgress + d.resolved;
                return (
                  <tr key={d.id}>
                    <td>
                      <div className="dept-name-cell">
                        <div className="dept-avatar">{d.code}</div>
                        <div className="dept-name-text">
                          <strong>{d.name}</strong>
                          <small>{d.contact}</small>
                        </div>
                      </div>
                    </td>
                    <td>{d.head}</td>
                    <td>
                      <span className="badge-count badge-pending">{d.pending}</span>
                    </td>
                    <td>
                      <span className="badge-count badge-progress">{d.inProgress}</span>
                    </td>
                    <td>
                      <span className="badge-count badge-resolved">{d.resolved}</span>
                    </td>
                    <td><strong>{totalComp}</strong></td>
                    <td>
                      <div className="sla-progress-wrap">
                        <div className="sla-bar-bg">
                          <div className="sla-bar-fill" style={{ width: `${d.slaCompliance}%` }}></div>
                        </div>
                        <small><strong>{d.slaCompliance}%</strong></small>
                      </div>
                    </td>
                    <td>
                      <span className={getRatingClass(d.efficiencyRating)}>
                        {d.efficiencyRating}
                      </span>
                    </td>
                    <td>
                      <button
                        className="table-action-btn"
                        onClick={() => setActiveModalDept(d)}
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal 1: Department Detail Report Modal */}
      {activeModalDept && (
        <div className="modal-overlay" onClick={() => setActiveModalDept(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{activeModalDept.name} ({activeModalDept.code})</h2>
              <button className="modal-close-btn" onClick={() => setActiveModalDept(null)}>&times;</button>
            </div>

            <div className="modal-body">
              <div className="modal-stats-row">
                <div className="modal-stat-box">
                  <small>Existing (Pending)</small>
                  <strong style={{ color: "#ea580c" }}>{activeModalDept.pending}</strong>
                </div>
                <div className="modal-stat-box">
                  <small>In Progress</small>
                  <strong style={{ color: "#0284c7" }}>{activeModalDept.inProgress}</strong>
                </div>
                <div className="modal-stat-box">
                  <small>Done (Resolved)</small>
                  <strong style={{ color: "#10b981" }}>{activeModalDept.resolved}</strong>
                </div>
                <div className="modal-stat-box">
                  <small>SLA Compliance</small>
                  <strong style={{ color: "#8b5cf6" }}>{activeModalDept.slaCompliance}%</strong>
                </div>
              </div>

              <div>
                <h4>Department Overview & Contacts</h4>
                <p><strong>Department Head:</strong> {activeModalDept.head}</p>
                <p><strong>Support Contact:</strong> {activeModalDept.contact}</p>
                <p><strong>Average Resolution Time:</strong> {activeModalDept.avgResolutionHours} hours</p>
                <p><strong>Efficiency Rating:</strong> {activeModalDept.efficiencyRating}</p>
              </div>

              <div>
                <h4>Recent Field Activity & Logs</h4>
                <p style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", borderLeft: "4px solid #0ea5a5" }}>
                  {activeModalDept.recentActivity}
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="table-action-btn" onClick={() => setActiveModalDept(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Printable Report Summary Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal-card printable-report-area" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>CivicPulse Departmental Analytical Report</h2>
              <button className="modal-close-btn" onClick={() => setShowExportModal(false)}>&times;</button>
            </div>

            <div className="modal-body">
              <div style={{ textAlign: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                <h3>Municipal Governance Performance Summary</h3>
                <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
                  Report Generated On: {new Date().toLocaleDateString()} | Filter Range: {dateRange.toUpperCase()}
                </p>
              </div>

              <div className="modal-stats-row">
                <div className="modal-stat-box">
                  <small>Total Complaints</small>
                  <strong>{aggregateStats.total}</strong>
                </div>
                <div className="modal-stat-box">
                  <small>Existing (Pending)</small>
                  <strong>{aggregateStats.pending}</strong>
                </div>
                <div className="modal-stat-box">
                  <small>In Progress</small>
                  <strong>{aggregateStats.inProgress}</strong>
                </div>
                <div className="modal-stat-box">
                  <small>Done (Resolved)</small>
                  <strong>{aggregateStats.resolved}</strong>
                </div>
              </div>

              <table className="dept-table" style={{ fontSize: "12px" }}>
                <thead>
                  <tr>
                    <th>Dept Code</th>
                    <th>Department Name</th>
                    <th>Existing</th>
                    <th>In Progress</th>
                    <th>Done</th>
                    <th>SLA %</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((d) => (
                    <tr key={d.id}>
                      <td><strong>{d.code}</strong></td>
                      <td>{d.name}</td>
                      <td>{d.pending}</td>
                      <td>{d.inProgress}</td>
                      <td>{d.resolved}</td>
                      <td>{d.slaCompliance}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-footer">
              <button className="table-action-btn" onClick={handleExportCSV}>
                📥 Download CSV
              </button>
              <button className="export-btn" onClick={() => window.print()}>
                🖨️ Print Report
              </button>
              <button className="table-action-btn" onClick={() => setShowExportModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Department Officer Modal */}
      <RegisterOfficerModal
        isOpen={isOfficerModalOpen}
        onClose={() => setIsOfficerModalOpen(false)}
      />

    </div>
    </div>
  );
};

export default DepartmentDashboard;
