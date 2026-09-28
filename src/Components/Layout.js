import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import "../Screens/Dashboard/Home.css";

/* ── tiny clock hook ── */
function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function Layout(props) {
  const navigate = useNavigate();
  const time = useClock();
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState(props.activeNav || "dashboard");
  const [gateEntryExpanded, setGateEntryExpanded] = useState(false);
  const [gateEntryTab, setGateEntryTab] = useState("inward");
  const showName = props.userName || localStorage.getItem("EMP_NAME") || "User";

  const formatTime = (d) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

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
      action: () => { setActiveNav("dashboard"); navigate("/Home"); },
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

  return (
    <div className="hm-root">
      {/* TOP NAV BAR */}
      <header className="hm-topbar">
        <div className="hm-topbar-left">
          <button className="hm-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="hm-brand" onClick={() => navigate("/Home")} style={{cursor: "pointer"}}>
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

        <div className="hm-topbar-right">
          <div className="hm-topbar-time">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {formatTime(time)} IST
          </div>
          <div className="hm-shift-badge">Shift A (06:00 – 14:00)</div>
          <button className="hm-quick-pass-btn" onClick={() => navigate("/Home")}>
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
            <button className="hm-logout-btn" title="Logout" onClick={() => {
                if (props.dispatch) props.dispatch({ type: "PROFILE", payload: { isAdmin: 1, isAuth: false, details: [] } });
                navigate("/");
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </header>

      <div className="hm-body">
        {/* SIDEBAR */}
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

                {item.id === "newgate" && gateEntryExpanded && sidebarOpen && (
                  <div className="hm-gate-subtabs">
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

        {/* MAIN CONTENT */}
        <main className="hm-main" onClick={props.onMainClick}>
          {props.children}
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({ 
  userName: state.loginreducer.name 
});
export default connect(mapStateToProps)(Layout);
