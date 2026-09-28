import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import "./Home.css";

/* ── tiny clock hook ── */
function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function Home(props) {
  const navigate = useNavigate();
  const time = useClock();
  const [admin, setAdmin] = useState(props.isAdmin);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openModel, setOpenModel] = useState(false);
  const [outwardModel, setoutwarModel] = useState(false);
  const [reportModel, setReportModel] = useState(false);
  const showName = props.userName || localStorage.getItem("EMP_NAME") || "User";
  const [activeNav, setActiveNav] = useState("dashboard");
  const [gateEntryExpanded, setGateEntryExpanded] = useState(false);
  const [gateEntryTab, setGateEntryTab] = useState("inward"); // "inward" | "outward"

  const formatTime = (d) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  /* ── Navigation items ── */
  const navItems = [
    {
      id: "dashboard",
      label: "Operations Dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      action: () => { setActiveNav("dashboard"); },
    },
    {
      id: "register",
      label: "Gate Pass Register",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      action: () => { setActiveNav("register"); navigate("/Reports/Register"); },
    },
    {
      id: "vehicle",
      label: "Vehicle Reporting",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v4h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      action: () => { setActiveNav("vehicle"); navigate("/VehicleReport"); },
    },
    {
      id: "newgate",
      label: "New Gate Entry",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
      action: () => { setActiveNav("newgate"); setGateEntryExpanded(!gateEntryExpanded); },
    },
    {
      id: "plant",
      label: "User Access",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      action: () => { setActiveNav("plant"); navigate("/UserAccess"); },
    },
  ];

  /* ── Stats ── */
  const stats = [
    {
      label: "TODAY'S GATE PASSES",
      value: "148",
      color: "#1e293b",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
      ),
      sub: [
        { label: "IN: 86", color: "#22c55e" },
        { label: "OUT: 62", color: "#f59e0b" },
        { label: "↑+12% vs y'day", color: "#22c55e" },
      ],
    },
    {
      label: "ACTIVE IN YARD / LOADING",
      value: "19",
      color: "#1e293b",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v4h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      sub: [
        { label: "⏱ Avg Dwell: 42 mins", color: "#64748b" },
        { label: "7 Bays Active", color: "#3b82f6" },
      ],
    },
    {
      label: "PENDING VEHICLE REPORTING",
      value: "07",
      color: "#dc2626",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      sub: [
        { label: "● At Outer Barrier", color: "#ef4444" },
        { label: "Queue: ~11m", color: "#f59e0b", pill: true },
      ],
    },
    {
      label: "CLEARED / OUTWARD TODAY",
      value: "122",
      color: "#16a34a",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      sub: [
        { label: "✓ 100% e-Way Validated", color: "#22c55e" },
        { label: "Gate 02 Exit", color: "#64748b" },
      ],
    },
  ];

  /* ── Dispatch cards ── */
  const dispatchCards = [
    {
      step: "Step 01",
      title: "Vehicle Reporting",
      desc: "Capture incoming chassis number, driver license, and tare weighbridge snapshot.",
      btnLabel: "+ Check-in Vehicle",
      btnStyle: "btn-outline",
      action: () => navigate("/VehicleReport"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v4h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      step: "Step 02",
      title: "Inward Gate Entry",
      desc: "Record goods receipt, match vendor PO / Invoice, assign unloading bay and safety pass.",
      btnLabel: "Create Inward Pass →",
      btnStyle: "btn-dark",
      action: () => { if (!admin.includes("1")) setOpenModel(!openModel); },
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
          <polyline points="8 17 12 21 16 17" /><line x1="12" y1="3" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      step: "Step 03",
      title: "Outward Gate Entry",
      desc: "Inspect outbound cargo seals, check gross weighment, and print dispatch challan.",
      btnLabel: "Create Outward Pass →",
      btnStyle: "btn-dark",
      action: () => { if (!admin.includes("1")) setoutwarModel(!outwardModel); },
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
          <polyline points="16 7 12 3 8 7" /><line x1="12" y1="21" x2="12" y2="3" />
        </svg>
      ),
    },
    {
      step: "Audit",
      title: "Reports & Logs",
      desc: "Verify gate override logs, operator actions, gross tare discrepancies and shift records.",
      btnLabel: "View Security Logs ↺",
      btnStyle: "btn-outline",
      action: () => navigate("/Reports/Register"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
  ];

  /* ── Live movements (mock) ── */
  const movements = [
    { plate: "MH-04-GP-8401", type: "INWARD", time: "10:38 IST", status: "Weighed", weight: "32.4 MT" },
    { plate: "GJ-01-AA-9921", type: "OUTWARD", time: "10:35 IST", status: "Gate Cleared", weight: "18.2 MT" },
    { plate: "RJ-14-CB-1122", type: "INWARD", time: "10:31 IST", status: "At Bay 03", weight: "24.0 MT" },
    { plate: "MH-12-AF-5503", type: "OUTWARD", time: "10:28 IST", status: "Gate Cleared", weight: "11.7 MT" },
  ];

  const bays = [
    { id: "Bay 01", status: "occupied", vehicle: "MH-04-GP-8401" },
    { id: "Bay 02", status: "occupied", vehicle: "GJ-01-AA-9921" },
    { id: "Bay 03", status: "occupied", vehicle: "RJ-14-CB-1122" },
    { id: "Bay 04", status: "free" },
    { id: "Bay 05", status: "occupied", vehicle: "MH-09-ZZ-4411" },
    { id: "Bay 06", status: "free" },
    { id: "Bay 07", status: "occupied", vehicle: "UP-78-GH-2200" },
    { id: "Bay 08", status: "free" },
  ];

  return (
    <div className="hm-root">
      {/* ════════════════════════════════
          TOP NAV BAR
      ════════════════════════════════ */}
      <header className="hm-topbar">
        {/* Left */}
        <div className="hm-topbar-left">
          <button className="hm-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="hm-brand">
            <img src="/Images/Frame_logo.png" alt="Logo" className="hm-brand-logo" />
            <div>
              <div className="hm-brand-name">GateAccess Pro</div>
              <div className="hm-brand-sub">YARD LOGISTICS OS</div>
            </div>
          </div>
          <div className="hm-plant-selector">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
            </svg>
            1100 – Ram Ratna Infrastructure – Mum HO
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        {/* Right */}
        <div className="hm-topbar-right">
          <div className="hm-topbar-time">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {formatTime(time)} IST
          </div>
          <div className="hm-shift-badge">Shift A (06:00 – 14:00)</div>
          <button className="hm-quick-pass-btn" onClick={() => setOpenModel(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Quick Gate Pass
          </button>
          <div className="hm-notif-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="hm-notif-dot"></span>
          </div>
          <div className="hm-user-chip">
            <div className="hm-avatar">{showName.charAt(0).toUpperCase()}</div>
            <div>
              <div className="hm-user-name">{showName}</div>
              <div className="hm-user-role">Admin Dispatcher</div>
            </div>
            <button className="hm-logout-btn" title="Logout" onClick={() => props.dispatch && props.dispatch({ type: "PROFILE", payload: { isAdmin: 1, isAuth: false, details: [] } })}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </header>

      <div className="hm-body">
        {/* ════════════════════════════════
            SIDEBAR
        ════════════════════════════════ */}
        <aside className={`hm-sidebar${sidebarOpen ? "" : " hm-sidebar-collapsed"}`}>
          <div className="hm-sidebar-section-label">OPERATIONS COMMAND</div>
          <nav className="hm-sidebar-nav">
            {navItems.map((item) => (
              <React.Fragment key={item.id}>
                <button
                  className={`hm-nav-item${activeNav === item.id ? " active" : ""}`}
                  onClick={item.action}
                >
                  <span className="hm-nav-icon">{item.icon}</span>
                  {sidebarOpen && <span className="hm-nav-label">{item.label}</span>}
                  {sidebarOpen && item.id === "newgate" && (
                    <span className="hm-nav-chevron" style={{ marginLeft: "auto", transition: "transform 0.2s", transform: gateEntryExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </span>
                  )}
                </button>

                {/* Gate Entry Sub-Tabs */}
                {item.id === "newgate" && gateEntryExpanded && sidebarOpen && (
                  <div className="hm-gate-subtabs">
                    {/* Tab switcher */}
                    <div className="hm-gate-tab-row">
                      <button
                        className={`hm-gate-tab${gateEntryTab === "inward" ? " hm-gate-tab-active" : ""}`}
                        onClick={() => setGateEntryTab("inward")}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
                        Inward
                      </button>
                      <button
                        className={`hm-gate-tab${gateEntryTab === "outward" ? " hm-gate-tab-active hm-gate-tab-outward-active" : ""}`}
                        onClick={() => setGateEntryTab("outward")}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 7 12 3 8 7"/><line x1="12" y1="21" x2="12" y2="3"/></svg>
                        Outward
                      </button>
                    </div>

                    {/* Inward options */}
                    {gateEntryTab === "inward" && (
                      <div className="hm-gate-options">
                        <button className="hm-gate-option hm-gate-option-inward" onClick={() => navigate("/Inward/WithPO")}>
                          <span className="hm-gate-opt-dot"></span>With PO / ASN
                        </button>
                        <button className="hm-gate-option hm-gate-option-inward" onClick={() => navigate("/Inward/WithoutPO")}>
                          <span className="hm-gate-opt-dot"></span>Without PO / NRGP
                        </button>
                        <button className="hm-gate-option hm-gate-option-inward" onClick={() => navigate("/Inward/STO")}>
                          <span className="hm-gate-opt-dot"></span>Against STO Invoice
                        </button>
                      </div>
                    )}

                    {/* Outward options */}
                    {gateEntryTab === "outward" && (
                      <div className="hm-gate-options">
                        <button className="hm-gate-option hm-gate-option-outward" onClick={() => navigate("/Outward/NRGP")}>
                          <span className="hm-gate-opt-dot"></span>Invoice / Challan
                        </button>
                        <button className="hm-gate-option hm-gate-option-outward" onClick={() => navigate("/Outward/STO")}>
                          <span className="hm-gate-opt-dot"></span>With Return PO
                        </button>
                        <button className="hm-gate-option hm-gate-option-outward" onClick={() => navigate("/Outward/RGP-RFA-Issue")}>
                          <span className="hm-gate-opt-dot"></span>RGP / NRGP
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="hm-sidebar-footer">
            <div className="hm-terminal-info">
              <div className="hm-terminal-dot"></div>
              {sidebarOpen && (
                <div>
                  <div className="hm-terminal-label">Active Terminal</div>
                  <div className="hm-terminal-name">GATEWAY #02</div>
                  <span className="hm-terminal-badge">INBOUND</span>
                </div>
              )}
            </div>
            {sidebarOpen && <div className="hm-version">v2.8.4-R3</div>}
            {sidebarOpen && (
              <button className="hm-help-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Help Desk
              </button>
            )}
          </div>
        </aside>

        {/* ════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════ */}
        <main className="hm-main" onClick={() => { setOpenModel(false); setoutwarModel(false); setReportModel(false); }}>

          {/* Welcome Banner */}
          <div className="hm-banner">
            <div className="hm-banner-top-row">
              <div className="hm-live-badge">
                <span className="hm-live-dot"></span>
                LIVE CONTROL ROOM
              </div>
              <span className="hm-banner-breadcrumb">Plant 1102 • Khopoli Heavy Yard</span>
              <span className="hm-banner-sep">›</span>
              <span className="hm-banner-bays">Bays 01-08 Operational</span>
            </div>
            <div className="hm-banner-body">
              <div className="hm-banner-left">
                <h1 className="hm-banner-title">
                  Welcome back, <span className="hm-banner-name">{showName}</span>
                  <span className="hm-banner-role"> (Plant Admin)</span>
                </h1>
                <p className="hm-banner-desc">
                  Real-time material flow dispatch, gate security validation, and yard weighbridge monitoring
                  system. All automated optical ANPR cameras reporting synchronized telemetry.
                </p>
              </div>
              <div className="hm-banner-actions">
                <button className="hm-action-btn" onClick={(e) => { e.stopPropagation(); navigate("/UserAccess"); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  Add New User
                </button>
                <button className="hm-action-btn" onClick={(e) => { e.stopPropagation(); navigate("/Reports/Register"); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Daily Gate Sheet
                </button>
                <button className="hm-action-btn hm-lockdown-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Gate Lockdown
                </button>
              </div>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="hm-stats-grid">
            {stats.map((s, i) => (
              <div className="hm-stat-card" key={i}>
                <div className="hm-stat-header">
                  <span className="hm-stat-label">{s.label}</span>
                  <span className="hm-stat-icon">{s.icon}</span>
                </div>
                <div className="hm-stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="hm-stat-sub-row">
                  {s.sub.map((ss, j) => (
                    <span
                      key={j}
                      className={`hm-stat-sub-item${ss.pill ? " hm-stat-pill" : ""}`}
                      style={{ color: ss.color }}
                    >
                      {ss.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Primary Operations Dispatch ── */}
          <div className="hm-section">
            <div className="hm-section-header">
              <div className="hm-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Primary Operations Dispatch
              </div>
              <span className="hm-fast-lane">FAST LANE PROCESSING MODE</span>
            </div>

            <div className="hm-dispatch-grid">
              {dispatchCards.map((card, i) => (
                <div className="hm-dispatch-card" key={i} onClick={(e) => e.stopPropagation()}>
                  <div className="hm-dispatch-card-top">
                    <span className="hm-dispatch-icon">{card.icon}</span>
                    <span className="hm-dispatch-step">{card.step}</span>
                  </div>
                  <div className="hm-dispatch-title">{card.title}</div>
                  <div className="hm-dispatch-desc">{card.desc}</div>

                  {/* Inward sub-options */}
                  {card.title === "Inward Gate Entry" && openModel && (
                    <div className="hm-sub-options" onClick={(e) => e.stopPropagation()}>
                      <button className="hm-sub-btn hm-sub-orange" onClick={() => navigate("/Inward/WithPO")}>With Reference to PO/ASN</button>
                      <button className="hm-sub-btn hm-sub-orange" onClick={() => navigate("/Inward/WithoutPO")}>Without PO/NRGP/RGP</button>
                      <button className="hm-sub-btn hm-sub-orange" onClick={() => navigate("/Inward/STO")}>Against STO Invoice</button>
                    </div>
                  )}

                  {/* Outward sub-options */}
                  {card.title === "Outward Gate Entry" && outwardModel && (
                    <div className="hm-sub-options" onClick={(e) => e.stopPropagation()}>
                      <button className="hm-sub-btn hm-sub-green" onClick={() => navigate("/Outward/NRGP")}>Invoice Challan</button>
                      <button className="hm-sub-btn hm-sub-green" onClick={() => navigate("/Outward/STO")}>With Return PO</button>
                      <button className="hm-sub-btn hm-sub-green" onClick={() => navigate("/Outward/RGP-RFA-Issue")}>RGP/NRGP</button>
                    </div>
                  )}

                  {!(card.title === "Inward Gate Entry" && openModel) &&
                   !(card.title === "Outward Gate Entry" && outwardModel) && (
                    <button
                      className={`hm-dispatch-btn ${card.btnStyle}`}
                      onClick={(e) => { e.stopPropagation(); card.action(); }}
                    >
                      {card.btnLabel}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom: Live movements + Dock Staging ── */}
          <div className="hm-bottom-grid">
            {/* Live Gate Movements */}
            <div className="hm-movements-card">
              <div className="hm-section-header">
                <div className="hm-section-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                  Live Gate Movements
                </div>
                <div className="hm-movement-tabs">
                  <span className="hm-tab active">All Movements</span>
                  <span className="hm-tab">Inward Only</span>
                  <span className="hm-tab">Outward Only</span>
                </div>
              </div>
              <div className="hm-movements-table">
                <div className="hm-movements-head">
                  <span>Vehicle</span><span>Type</span><span>Time</span><span>Status</span><span>Weight</span>
                </div>
                {movements.map((m, i) => (
                  <div className="hm-movement-row" key={i}>
                    <span className="hm-mov-plate">{m.plate}</span>
                    <span className={`hm-mov-type ${m.type === "INWARD" ? "inward" : "outward"}`}>{m.type}</span>
                    <span className="hm-mov-time">{m.time}</span>
                    <span className="hm-mov-status">{m.status}</span>
                    <span className="hm-mov-weight">{m.weight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dock Staging */}
            <div className="hm-dock-card">
              <div className="hm-section-header">
                <div className="hm-section-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>
                  </svg>
                  Dock Staging Status
                </div>
                <span className="hm-dock-online">8 Bays Online</span>
              </div>
              <div className="hm-bays-grid">
                {bays.map((bay) => (
                  <div key={bay.id} className={`hm-bay-cell ${bay.status}`}>
                    <div className="hm-bay-id">{bay.id}</div>
                    {bay.vehicle && <div className="hm-bay-vehicle">{bay.vehicle}</div>}
                    {!bay.vehicle && <div className="hm-bay-free">FREE</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAdmin: state.loginreducer.isAdmin,
  userName: state.loginreducer.name,
});

export default connect(mapStateToProps, {})(Home);
