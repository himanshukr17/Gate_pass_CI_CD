import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { LoginAction } from "../../redux/action/LoginAction";
import toast from "react-hot-toast";
import "./Login.css";

function Login(props) {
  const navigate = useNavigate();
  const [data, setdata] = useState({ USER: "", PASS: "" });
  const [error, seterror] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const setValue = (val) => {
    setdata({ ...data, ...val });
  };

  const handlelogin = (e) => {
    if (e) e.preventDefault();

    let hasErr = false;
    let err = { USER: null, PASS: null };

    if (!data.USER) { hasErr = true; err.USER = "This field is mandatory"; }
    if (!data.PASS) { hasErr = true; err.PASS = "This field is mandatory"; }

    seterror(err);

    if (!hasErr) {
      props
        .LoginAction(data.USER, data.PASS)
        .then((res) => {
          if (res.status === "success") {
            const empName = res.EMP_NAME;
            localStorage.setItem("EMP_NAME", empName);
            navigate("/Home", { state: { user: empName } });
            toast.success(`${empName} Logged In successfully`);
          } else {
            toast.error("Invalid username or password");
          }
        })
        .catch(() => {
          toast.error("Invalid username or password");
        });
    }
  };

  return (
    <div className="login-root">
      {/* ── LEFT PANEL ── */}
      <div className="login-left">
        {/* Top bar */}
        <div className="login-topbar">
          <div className="login-logo-area">
            <img src="/Images/Frame_logo.png" alt="GateAccess Logo" className="login-logo-img" />
            <span className="login-badge-os">YARD LOGISTICS OS</span>
          </div>
          <div className="login-terminal-status">
            <span className="login-dot online"></span>
            <span className="login-terminal-text">Terminal 04 &nbsp;|&nbsp; Online</span>
          </div>
        </div>

        {/* Form area */}
        <div className="login-form-wrapper">
          <div className="login-here-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Login here
          </div>

          <h1 className="login-heading">Hello! It's great to see you.</h1>
          <p className="login-subheading">Sign in with your credentials to access your terminal dashboard.</p>

          <form onSubmit={handlelogin} className="login-form" noValidate>
            {/* Username */}
            <div className="login-field-group">
              <label className="login-label">USERNAME</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  id="login-username"
                  type="text"
                  className={`login-input${error.USER ? " login-input-error" : ""}`}
                  placeholder="Enter Username"
                  value={data.USER}
                  onChange={(e) => setValue({ USER: e.target.value })}
                  autoComplete="username"
                />
              </div>
              {error.USER && <span className="login-error-msg">{error.USER}</span>}
            </div>

            {/* Password */}
            <div className="login-field-group">
              <div className="login-label-row">
                <label className="login-label">PASSWORD</label>
                <span className="login-forgot">Forgot Password?</span>
              </div>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  className={`login-input${error.PASS ? " login-input-error" : ""}`}
                  placeholder="Enter Password"
                  value={data.PASS}
                  onChange={(e) => setValue({ PASS: e.target.value })}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {error.PASS && <span className="login-error-msg">{error.PASS}</span>}
            </div>

            {/* Remember me */}
            <div className="login-remember-row">
              <label className="login-remember-label">
                <input
                  type="checkbox"
                  className="login-checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Submit */}
            <button id="login-submit-btn" type="submit" className="login-submit-btn">
              Login
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </form>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="login-right">
        {/* Top status bar */}
        <div className="login-right-topbar">
          <div className="login-anpr-badge">
            <span className="login-dot-green"></span>
            ANPR Optical Recognition: 100% Operational
          </div>
          <div className="login-gate-node">GATE-NODE-MUM-01</div>
        </div>

        {/* Main image card */}
        <div className="login-right-card">
          <div className="login-right-card-header">
            <span className="login-dot-green"></span>
            <span className="login-right-card-title">Automated ANPR Plate Recognition</span>
            <span className="login-fast-pass">FAST PASS</span>
          </div>

          <div className="login-right-img-wrap">
            <img
              src="/Images/unnamed.jpg"
              alt="Gate Pass System"
              className="login-right-img"
            />
          </div>

          {/* Vehicle info */}
          <div className="login-vehicle-row">
            <div className="login-vehicle-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <span className="login-vehicle-plate">MH-04-GP-8401</span>
              <span className="login-vehicle-sep">•</span>
              <span className="login-vehicle-weight">32.4 MT</span>
            </div>
            <span className="login-gate-cleared">GATE CLEARED</span>
          </div>

          {/* Stats row */}
          <div className="login-stats-row">
            <div className="login-stat-card">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div>
                <div className="login-stat-title">Real-time Gross Weighbridge Sync</div>
                <div className="login-stat-sub">Zero Delay Gross &amp; Tare reconciliation</div>
              </div>
            </div>
            <div className="login-stat-card">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <div>
                <div className="login-stat-title">Multi-Plant Sync</div>
                <div className="login-stat-sub">7 Active Regional Facilities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom metrics */}
        <div className="login-metrics-row">
          <div className="login-metric">
            <div className="login-metric-label">TODAY'S PERFORMANCE METRIC</div>
            <div className="login-metric-value">89.4%</div>
          </div>
          <div className="login-metric">
            <div className="login-metric-label">AVERAGE TURNAROUND</div>
            <div className="login-metric-value">4.2h</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { LoginAction })(Login);
