import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { SignupData } from "../../../redux/action/Signup";
import Select from "react-select";
import toast from "react-hot-toast";
import Layout from "../../../Components/Layout";
import "./UserAccess.css";

const apiURL = process.env.REACT_APP_API_URL;

const roleMapping = { 1: "Security", 2: "Admin", 3: "Plant", 4: "Reviewer" };

const roleBadgeColor = {
  Admin:    { bg: "rgba(234,179,8,0.12)",  border: "#ca8a04", color: "#854d0e" },
  Security: { bg: "rgba(59,130,246,0.1)",  border: "#3b82f6", color: "#1d4ed8" },
  Plant:    { bg: "rgba(22,163,74,0.1)",   border: "#16a34a", color: "#14532d" },
  Reviewer: { bg: "rgba(139,92,246,0.1)", border: "#7c3aed", color: "#4c1d95" },
};

const roleOptions = [
  { label: "Admin",    value: "2" },
  { label: "Plant",    value: "3" },
  { label: "Security", value: "1" },
  { label: "Reviewer", value: "4" },
];

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
}

function getAvatarColor(str = "") {
  const colors = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#06b6d4","#ec4899"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function UserAccess(props) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [plantFilter, setPlantFilter] = useState("all");
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewMode, setViewMode] = useState("compact"); // "compact" | "expanded"
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(null); // rowId or null
  const [allPlants, setAllPlants] = useState([]);
  const [plantOptions, setPlantOptions] = useState([]);
  const [showName] = useState(() => localStorage.getItem("EMP_NAME") || "User");

  // Add user form state
  const [form, setForm] = useState({ NAME: "", MOB: "", MAIL: "", PLANT: [], ROLE: [] });
  const [formErr, setFormErr] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiURL}Employee/getAllUser`);
      if (res.data && Array.isArray(res.data)) {
        const formatted = res.data.map(item => ({
          empId:   item.EMPLOYEE_ID || "N/A",
          empName: item.EMPLOYEE_NAME || "N/A",
          status:  item.FLAG === "1" || item.FLAG === 1 ? "Active" : "Inactive",
          plants:  item.PLANT && Array.isArray(item.PLANT)
            ? item.PLANT.map(p => ({ id: p.PLANT_ID, name: p.PLANT_NAME }))
            : [],
          email:    item.EMAIL || "",
          mobile:   item.MOBILE || "",
          password: item.PASSWORD || "",
          roles:    Array.isArray(item.ISADMIN)
            ? item.ISADMIN.map(id => roleMapping[id] || "Unknown")
            : [],
          dept: item.DEPARTMENT || "",
        }));
        setData(formatted);
        setFilteredData(formatted);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // Fetch plants for the add-user form
  const fetchPlants = async () => {
    try {
      const res = await fetch(`${apiURL}Employee/plant`);
      const newData = await res.json();
      const opts = newData.map(item => ({
        label: `${item.PLANT_ID} - ${item.PLANT_DESCRIPTION}`,
        value: item.PLANT_ID,
      }));
      setAllPlants(newData);
      setPlantOptions(opts);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchUsers();
    fetchPlants();
  }, []);

  // Filter logic
  useEffect(() => {
    let d = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(r =>
        r.empId.toLowerCase().includes(q) ||
        r.empName.toLowerCase().includes(q) ||
        r.mobile.includes(q) ||
        r.plants.some(p => `${p.id} ${p.name}`.toLowerCase().includes(q))
      );
    }
    if (roleFilter !== "all") {
      d = d.filter(r => r.roles.includes(roleFilter));
    }
    if (plantFilter !== "all") {
      d = d.filter(r => r.plants.some(p => p.id === plantFilter));
    }
    setFilteredData(d);
  }, [search, roleFilter, plantFilter, data]);

  const activeCount  = data.filter(r => r.status === "Active").length;
  const plantSet     = [...new Set(data.flatMap(r => r.plants.map(p => p.id)))];
  const allRoles     = [...new Set(data.flatMap(r => r.roles))];

  const toggleRow = (id) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    if (selectedRows.length === filteredData.length) setSelectedRows([]);
    else setSelectedRows(filteredData.map(r => r.empId));
  };

  const handleStatusChange = async (flag) => {
    if (selectedRows.length === 0) { toast.error("Select at least one user."); return; }
    try {
      await Promise.all(selectedRows.map(id => axios.post(`${apiURL}Employee/changeFlag`, { ID: id, FLAG: flag })));
      toast.success("Status updated.");
      fetchUsers();
      setSelectedRows([]);
    } catch (e) { toast.error("Failed to update status."); }
  };

  // Add user
  const handleAddUser = async () => {
    let hasErr = false;
    let err = {};
    if (!form.NAME.trim())        { hasErr = true; err.NAME = "Required"; }
    if (!form.MOB.trim())         { hasErr = true; err.MOB  = "Required"; }
    if (!form.MAIL.trim())        { hasErr = true; err.MAIL = "Required"; }
    if (form.PLANT.length === 0)  { hasErr = true; err.PLANT = "Select at least one plant"; }
    if (form.ROLE.length === 0)   { hasErr = true; err.ROLE = "Select at least one role"; }
    setFormErr(err);
    if (hasErr) return;
    setSubmitting(true);
    try {
      const res = await props.SignupData(form, props.EmpId);
      if (res.status === 200) {
        toast.success(`${res.data} created successfully!`);
        setShowAddModal(false);
        setForm({ NAME: "", MOB: "", MAIL: "", PLANT: [], ROLE: [] });
        fetchUsers();
      } else if (res.status === 406) {
        toast.error(`${res.data}`);
      }
    } catch (e) {
      toast.error(e?.response?.data || "Error creating user.");
    }
    setSubmitting(false);
  };

  return (
    <Layout activeNav="plant">
      <div className="ua-main">
        {/* Breadcrumb */}
        <div className="ua-breadcrumb">
          <span onClick={() => navigate("/Home")} style={{ cursor: "pointer" }}>Home</span>
          <span className="ua-bc-sep">›</span>
          <span>User &amp; Plant Access Control</span>
          <span className="ua-bc-sep">›</span>
          <span className="ua-bc-current">IAM-YARD-V2</span>
        </div>

        {/* Page header */}
        <div className="ua-page-header">
          <div>
            <h1 className="ua-page-title">Plant Personnel &amp; Access Governance</h1>
            <p className="ua-page-sub">Manage user roles, plant assignments and access credentials</p>
          </div>
          <div className="ua-header-stats">
            <div className="ua-stat-pill green">
              <span className="ua-stat-dot green"></span>
              <div>
                <div className="ua-stat-value">{activeCount}</div>
                <div className="ua-stat-label">ACTIVE USERS</div>
              </div>
            </div>
            <div className="ua-stat-pill blue">
              <span className="ua-stat-dot blue"></span>
              <div>
                <div className="ua-stat-value">{plantSet.length}</div>
                <div className="ua-stat-label">LINKED PLANTS</div>
              </div>
            </div>
            <button className="ua-add-btn" onClick={() => setShowAddModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add New User
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="ua-toolbar">
          <div className="ua-toolbar-left">
            {/* Search */}
            <div className="ua-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                className="ua-search"
                placeholder="Search by Emp ID, Name, Mobile, or Plant Code..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button className="ua-search-clear" onClick={() => setSearch("")}>✕</button>}
              <span className="ua-search-hint">Esc</span>
            </div>

            {/* Role filter */}
            <div className="ua-filter-wrap">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Role:</span>
              <select className="ua-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                <option value="all">All Roles ({allRoles.length})</option>
                {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Plant filter */}
            <div className="ua-filter-wrap">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              <span>Plant:</span>
              <select className="ua-select" value={plantFilter} onChange={e => setPlantFilter(e.target.value)}>
                <option value="all">All Associated Plants</option>
                {plantSet.map(pid => <option key={pid} value={pid}>{pid}</option>)}
              </select>
            </div>
          </div>

          <div className="ua-toolbar-right">
            <button className={`ua-view-btn${viewMode === "compact" ? " active" : ""}`} onClick={() => setViewMode("compact")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              Compact
            </button>
            <button className={`ua-view-btn${viewMode === "expanded" ? " active" : ""}`} onClick={() => setViewMode("expanded")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/></svg>
              Expanded
            </button>
            {selectedRows.length > 0 && (
              <div className="ua-bulk-actions">
                <button className="ua-bulk-btn activate" onClick={() => handleStatusChange("1")}>✓ Activate</button>
                <button className="ua-bulk-btn deactivate" onClick={() => handleStatusChange("0")}>✕ Deactivate</button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="ua-table-wrap">
          {loading ? (
            <div className="ua-empty">
              <div className="ua-spinner"></div>
              <p>Loading users…</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="ua-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <p>No users found</p>
            </div>
          ) : (
            <table className="ua-table">
              <thead>
                <tr>
                  <th className="ua-th-check">
                    <input type="checkbox" checked={selectedRows.length === filteredData.length && filteredData.length > 0} onChange={toggleAll} />
                  </th>
                  <th>EMP ID</th>
                  <th>EMPLOYEE DETAILS</th>
                  <th>CONTACT INFO</th>
                  <th>ROLE &amp; PERMISSIONS</th>
                  <th>SECURITY CREDENTIAL</th>
                  <th>ASSIGNED PLANTS</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.empId} className={`ua-tr${selectedRows.includes(row.empId) ? " selected" : ""}${viewMode === "expanded" ? " expanded" : ""}`}>
                    <td className="ua-td-check">
                      <input type="checkbox" checked={selectedRows.includes(row.empId)} onChange={() => toggleRow(row.empId)} />
                    </td>
                    <td>
                      <span className="ua-empid">{row.empId}</span>
                    </td>
                    <td>
                      <div className="ua-emp-cell">
                        <div className="ua-emp-avatar" style={{ background: getAvatarColor(row.empName) }}>
                          {getInitials(row.empName)}
                        </div>
                        <div>
                          <div className="ua-emp-name">{row.empName}</div>
                          {viewMode === "expanded" && row.dept && <div className="ua-emp-dept">{row.dept}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="ua-contact">
                        {row.mobile && <div className="ua-contact-row"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.39 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>{row.mobile}</div>}
                        {row.email && <div className="ua-contact-row"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>{row.email}</div>}
                      </div>
                    </td>
                    <td>
                      <div className="ua-roles">
                        {row.roles.length > 0 ? row.roles.map(r => {
                          const c = roleBadgeColor[r] || { bg: "#f1f5f9", border: "#e2e8f0", color: "#475569" };
                          return (
                            <span key={r} className="ua-role-badge" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
                              {r}
                            </span>
                          );
                        }) : <span className="ua-muted">—</span>}
                      </div>
                    </td>
                    <td>
                      <div className="ua-credential">
                        <span className="ua-cred-dots">••••••</span>
                        <button className="ua-cred-eye" title="View credential">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="ua-plants">
                        {row.plants.length > 0
                          ? row.plants.slice(0, viewMode === "expanded" ? row.plants.length : 3).map(p => (
                            <span key={p.id} className="ua-plant-tag">{p.id}{viewMode === "expanded" && ` - ${p.name}`}</span>
                          ))
                          : <span className="ua-muted">—</span>
                        }
                        {viewMode === "compact" && row.plants.length > 3 && (
                          <span className="ua-plant-more">+{row.plants.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`ua-status-badge ${row.status === "Active" ? "active" : "inactive"}`}>
                        <span className="ua-status-dot"></span>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className="ua-actions">
                        <button className="ua-action-icon" title="Edit">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="ua-action-icon" title="Access control">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer count */}
        {!loading && (
          <div className="ua-footer-row">
            <span>Showing <strong>{filteredData.length}</strong> of <strong>{data.length}</strong> Users</span>
            {selectedRows.length > 0 && <span className="ua-sel-count">{selectedRows.length} selected</span>}
          </div>
        )}
      </div>

      {/* ── Add New User Modal ── */}
      {showAddModal && (
        <div className="ua-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="ua-modal provision-modal" onClick={e => e.stopPropagation()}>

            {/* ── Modal Header ── */}
            <div className="pv-header">
              <div className="pv-header-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <div className="pv-title">Provision New User &amp; Plant Access</div>
                <div className="pv-sub">Configure enterprise identity, operational role, and multi-facility yard clearances.</div>
              </div>
              <button className="ua-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <div className="pv-body">

              {/* ── Section 1: Employee Credentials ── */}
              <div className="pv-section-header">
                <span className="pv-section-num">1. EMPLOYEE CREDENTIALS</span>
                <span className="pv-mandatory">* All fields mandatory</span>
              </div>

              <div className="pv-cred-grid">
                {/* Name */}
                <div className="pv-field">
                  <label className="pv-label">Name of User <span className="req">*</span></label>
                  <div className={`pv-input-wrap${formErr.NAME ? " error" : ""}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input
                      className="pv-input"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={form.NAME}
                      onChange={e => { setForm(f => ({...f, NAME: e.target.value})); setFormErr(fe => ({...fe, NAME: ""})); }}
                    />
                  </div>
                  {formErr.NAME && <span className="ua-ferr">{formErr.NAME}</span>}
                </div>

                {/* Mobile */}
                <div className="pv-field">
                  <label className="pv-label">Mobile Number <span className="req">*</span></label>
                  <div className={`pv-input-wrap${formErr.MOB ? " error" : ""}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                    <input
                      className="pv-input"
                      type="text"
                      placeholder="10-digit mobile (e.g. 9876543210)"
                      maxLength={10}
                      value={form.MOB}
                      onChange={e => { setForm(f => ({...f, MOB: e.target.value})); setFormErr(fe => ({...fe, MOB: ""})); }}
                    />
                  </div>
                  {formErr.MOB && <span className="ua-ferr">{formErr.MOB}</span>}
                </div>

                {/* Email */}
                <div className="pv-field">
                  <label className="pv-label">Corporate Email ID <span className="req">*</span></label>
                  <div className={`pv-input-wrap${formErr.MAIL ? " error" : ""}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input
                      className="pv-input"
                      type="email"
                      placeholder="corporate email (e.g. name@rglobal.com)"
                      value={form.MAIL}
                      onChange={e => { setForm(f => ({...f, MAIL: e.target.value})); setFormErr(fe => ({...fe, MAIL: ""})); }}
                    />
                  </div>
                  {formErr.MAIL && <span className="ua-ferr">{formErr.MAIL}</span>}
                </div>

                {/* Role */}
                <div className="pv-field">
                  <label className="pv-label">Operational Role <span className="req">*</span></label>
                  <div className={`pv-input-wrap${formErr.ROLE ? " error" : ""}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <select
                      className="pv-select"
                      value={form.ROLE[0] || ""}
                      onChange={e => { setForm(f => ({...f, ROLE: e.target.value ? [e.target.value] : []})); setFormErr(fe => ({...fe, ROLE: ""})); }}
                    >
                      <option value="">Select Role Authorization...</option>
                      {roleOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  {formErr.ROLE && <span className="ua-ferr">{formErr.ROLE}</span>}
                </div>
              </div>

              {/* ── Section 2: Multi-Plant Authorization ── */}
              <div className="pv-section-header" style={{ marginTop: 24 }}>
                <span className="pv-section-num">2. MULTI-PLANT AUTHORIZATION</span>
                <button
                  className="pv-select-all-btn"
                  onClick={() => {
                    if (form.PLANT.length === plantOptions.length) {
                      setForm(f => ({...f, PLANT: []}));
                    } else {
                      setForm(f => ({...f, PLANT: plantOptions.map(p => p.value)}));
                    }
                    setFormErr(fe => ({...fe, PLANT: ""}));
                  }}
                >
                  {form.PLANT.length === plantOptions.length ? "Deselect All Plants" : "Select All Plants"}
                </button>
              </div>
              <p className="pv-section-desc">Select one or more manufacturing sites this user can access to inspect inward vehicles, generate weigh slips, and validate gate passes.</p>

              {formErr.PLANT && <span className="ua-ferr" style={{ marginBottom: 8, display: 'block' }}>{formErr.PLANT}</span>}

              <div className="pv-plant-grid">
                {plantOptions.map(plant => {
                  const checked = form.PLANT.includes(plant.value);
                  // Parse plant label: "1100 - HO Mumbai" → id part and name part
                  const parts = plant.label.split(" - ");
                  const plantId = parts[0];
                  const plantName = parts.slice(1).join(" - ");
                  return (
                    <label
                      key={plant.value}
                      className={`pv-plant-card${checked ? " checked" : ""}`}
                      onClick={() => {
                        setForm(f => ({
                          ...f,
                          PLANT: checked
                            ? f.PLANT.filter(v => v !== plant.value)
                            : [...f.PLANT, plant.value]
                        }));
                        setFormErr(fe => ({...fe, PLANT: ""}));
                      }}
                    >
                      <div className={`pv-checkbox${checked ? " checked" : ""}`}>
                        {checked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="2 6 5 9 10 3"/></svg>}
                      </div>
                      <div className="pv-plant-info">
                        <div className="pv-plant-id">{plantId} - <strong>{plantName}</strong></div>
                        <div className="pv-plant-desc">{plant.label}</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* ── Security Token Info ── */}
              <div className="pv-token-box">
                <div className="pv-token-left">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <div>
                    <div className="pv-token-title">Security Dispatch Token</div>
                    <div className="pv-token-sub">An activation invitation and one-time password will be automatically dispatched via SMS &amp; Email to the user's mobile device upon creation.</div>
                  </div>
                </div>
                <span className="pv-token-badge">Auto-generated</span>
              </div>
            </div>

            {/* ── Modal Footer ── */}
            <div className="pv-footer">
              <button className="ua-modal-cancel" onClick={() => { setShowAddModal(false); setForm({ NAME: "", MOB: "", MAIL: "", PLANT: [], ROLE: [] }); setFormErr({}); }}>Cancel</button>
              <button className="pv-submit-btn" onClick={handleAddUser} disabled={submitting}>
                {submitting ? (
                  <>
                    <div className="pv-submit-spinner"></div>
                    Provisioning…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Submit &amp; Provision User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

const mapStateToProps = (state) => ({ EmpId: state.loginreducer.details });
export default connect(mapStateToProps, { SignupData })(UserAccess);
