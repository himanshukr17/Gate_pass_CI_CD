import React, { useEffect, useState, useRef } from "react";
import "./Register.css";
import Header from "../../../Components/Header";
import axios from "axios";
import toast from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";
import "../../Dashboard/Home.css";

import { CSVLink } from "react-csv";
import html2pdf from "html2pdf.js";

const apiURL = process.env.REACT_APP_API_URL;

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [csvData, setCsvData] = useState([]);
  
  // Quick filters state (All, Inward, Outward, Loading)
  const [activeTab, setActiveTab] = useState("All");

  const contentRef = useRef();

  // ─────────────────────────────────────────────────────────
  //  Data Fetching & Formatting
  // ─────────────────────────────────────────────────────────
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}Entry/GetAllEntry`);
      if (response.status === 200 && Array.isArray(response.data)) {
        let formattedData = response.data.map((item) => ({
          VehicleNumber: item.VEHICLE_NO ?? "--",
          gatePass: item.GATE_ENTRY_NO ?? "--",
          vendorName: item.VENDOR_NAME ?? "--",
          driverName: item.DRIVER_NAME ?? "--",
          driverMobile: item.DRIVER_MOBILE_NO ?? "--",
          date: item.INWARD_DATETIME ? formatDateTime(item.INWARD_DATETIME) : "--",
          status:
            item.FLAG == "3" ? "Cancelled" :
            item.FLAG == "4" ? "Pending Cancel" :
            item.Reporting?.[0]?.MODE == "1"
              ? (item.Reporting?.[0]?.FLAG == "0" ? "Loading in process" : item.Reporting?.[0]?.FLAG == "1" ? "Pending for Loading" : "Completed")
              : (item.Reporting?.[0]?.MODE == "0"
                  ? (item.Reporting?.[0]?.FLAG == "0" ? "Unloading in process" : item.Reporting?.[0]?.FLAG == "1" ? "Pending for Unloading" : "Completed")
                  : (item.Reporting?.[0]?.FLAG == "0" ? "Unloading in process" : item.Reporting?.[0]?.FLAG == "1" ? "Pending for Unloading" : "Completed")),
          lineItem: item.Entry_Details?.length ?? "--",
          outTime: item.OUTWARD_DATETIME ? formatDateTime(item.OUTWARD_DATETIME) : "--",
          indicator: item.OUTWARD_INDICATOR ?? "--",
          plant: item.PLANT ?? "--",
          vehicleReportingTime: item.REPORTING_DATETIME ? formatDateTime(item.REPORTING_DATETIME) : "--",
          invoiceNumber: item.INVOICE_NO ?? "--",
          documentDate: item.DOCUMENT_DATE ? formatDate(item.DOCUMENT_DATE) : "--",
          vendorId: item.VENDOR_ID ?? "--",
          modeOfTransport: item.MODE_OF_TRANSPORT ?? "--",
          roadPermitNumber: item.ROAD_PERMIT_NUMBER ?? "--",
          lrNo: item.LR_NO ?? "--",
          lrDate: item.LR_DATE ? formatDate(item.LR_DATE) : "--",
          packages: item.PACKAGES ?? "--",
          lineitemDetails: item.Entry_Details ?? [],
          remarks: item.REMARKS ?? "--",
          inwardTime: item.INWARD_CREATION_TIME ? formatDateTime(item.INWARD_CREATION_TIME) : "--",
          startTime: item.Reporting?.[0]?.START_TIME ? formatDateTime(item.Reporting?.[0]?.START_TIME) : "--",
          flag: item.FLAG ?? "--",
          flagUpdation: item.FLAG_UPDATION ? formatDateTime(item.FLAG_UPDATION) : "--",
          
          // Helper for UI styling
          isOutward: (item.GATE_ENTRY_NO || "").includes("OW"),
        }));
        setTableData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ─────────────────────────────────────────────────────────
  //  CSV Logic
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!tableData || tableData.length === 0) {
      setCsvData([]);
      return;
    }
    const flattened = [];
    tableData.forEach((entry) => {
      const lineItems = Array.isArray(entry.lineitemDetails) ? entry.lineitemDetails : [];
      if (lineItems.length === 0) {
        flattened.push({
          "Gate Entry No": entry.gatePass,
          "Reporting Date": entry.vehicleReportingTime,
          "Vendor Name": entry.vendorName,
          "Vehicle No": entry.VehicleNumber,
          "Status": entry.status,
        });
      } else {
        lineItems.forEach((item) => {
          flattened.push({
            "Gate Entry No": entry.gatePass,
            "Reporting Date": entry.vehicleReportingTime,
            "Vendor Name": entry.vendorName,
            "Vehicle No": entry.VehicleNumber,
            "Line Item": item.LINE_ITEM || "--",
            "PO Number": item.PO_NO || "--",
            "Material Number": item.MATERIAL_NO || "--",
            "Status": entry.status,
          });
        });
      }
    });
    setCsvData(flattened);
  }, [tableData]);

  const csvHeaders = csvData.length > 0 ? Object.keys(csvData[0]).map((key) => ({ label: key, key: key })) : [];

  // ─────────────────────────────────────────────────────────
  //  Modal Logic
  // ─────────────────────────────────────────────────────────
  const openModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const handleDownloadPDF = () => {
    const element = contentRef.current;
    const opt = {
      margin: 5,
      filename: `GatePass_${selectedRow?.gatePass}.pdf`,
      image: { type: 'jpeg', quality: 0.9 },
      html2canvas: { scale: 1.5 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  // ─────────────────────────────────────────────────────────
  //  Stats Calculation
  // ─────────────────────────────────────────────────────────
  const totalPasses = tableData.length;
  const inwardCount = tableData.filter(d => !d.isOutward).length;
  const outwardCount = tableData.filter(d => d.isOutward).length;
  const loadingCount = tableData.filter(d => (d.status || "").toLowerCase().includes("process")).length;

  // Filtered data for table
  const displayData = tableData.filter(row => {
    if (activeTab === "Inward") return !row.isOutward;
    if (activeTab === "Outward") return row.isOutward;
    if (activeTab === "Loading") return (row.status || "").toLowerCase().includes("process");
    return true; // "All"
  });


  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const showName = localStorage.getItem("EMP_NAME") || "User";

  const formatTime = (d) => {
    if (!d) return "";
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  };
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

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
      action: () => navigate("/Home"),
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
      action: () => {  },
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
      action: () => navigate("/VehicleReport"),
    },
    {
      id: "newgate",
      label: "New Gate Entry",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
      action: () => {  },
    },
    {
      id: "plant",
      label: "Plant & User Access",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      action: () => {  },
    },
  ];

  return (
    <div className="hm-root">
      <header className="hm-topbar">
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

        <div className="hm-topbar-right">
          <div className="hm-topbar-time">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {formatTime(time)} IST
          </div>
          <div className="hm-shift-badge">Shift A (06:00 – 14:00)</div>
          <button className="hm-quick-pass-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            + Quick Gate Pass
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
          </div>
        </div>
      </header>

      <div className="hm-body">
        <aside className={`hm-sidebar${sidebarOpen ? "" : " hm-sidebar-collapsed"}`}>
          <div className="hm-sidebar-section-label">OPERATIONS COMMAND</div>
          <nav className="hm-sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`hm-nav-item${item.id === "register" ? " active" : ""}`}
                onClick={item.action}
              >
                <span className="hm-nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="hm-nav-label">{item.label}</span>}
              </button>
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

        <main className="hm-main" style={{padding: 0, backgroundColor: "#f8fafc"}}>
          <div className="reg-root" style={{minHeight: 'auto'}}>
      {/* ────────────────────────────────────────────────────────
          TOP BAR & BREADCRUMBS
      ──────────────────────────────────────────────────────── */}
      <div className="reg-topbar">
        <div className="reg-breadcrumb">
          <Link to="/Home">Home</Link> <span>›</span>
          <span className="current">Gate Pass Register</span> <span>›</span>
          <span className="live-feed">LIVE FEED (SHIFT-A)</span>
        </div>
        
        <div className="reg-top-actions">
          <div className="reg-date-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            11-09-2026 (Today)
          </div>
          
          {csvData.length > 0 ? (
            <CSVLink data={csvData} headers={csvHeaders} filename="gatepass-report.csv" className="reg-export-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export CSV
            </CSVLink>
          ) : (
            <button className="reg-export-btn" onClick={() => toast.info("No data available")} style={{opacity: 0.5}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export CSV
            </button>
          )}

          <button className="reg-inspect-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Inspect Active Pass
          </button>
        </div>
      </div>

      <div className="reg-title-row">
        <h1>Gate Pass Register & Yard Log</h1>
        <span className="reg-plant-badge">Plant #1102 Khopoli</span>
      </div>

      {/* ────────────────────────────────────────────────────────
          STATS ROW
      ──────────────────────────────────────────────────────── */}
      <div className="reg-stats-grid">
        <div className="reg-stat-card">
          <div className="stat-label">TOTAL PASSES TODAY</div>
          <div className="stat-row">
            <div className="stat-val">{totalPasses}</div>
            <div className="stat-icon-wrap"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></div>
          </div>
          <div className="stat-sub green">↑ +18% vs yesterday</div>
        </div>

        <div className="reg-stat-card">
          <div className="stat-label">INWARD MOVEMENTS</div>
          <div className="stat-row">
            <div className="stat-val blue">{inwardCount}</div>
            <div className="stat-icon-wrap blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path></svg></div>
          </div>
          <div className="stat-sub">↙ Raw materials & supplies</div>
        </div>

        <div className="reg-stat-card">
          <div className="stat-label">OUTWARD DISPATCHES</div>
          <div className="stat-row">
            <div className="stat-val">{outwardCount}</div>
            <div className="stat-icon-wrap"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path></svg></div>
          </div>
          <div className="stat-sub">↗ Finished systems & spares</div>
        </div>

        <div className="reg-stat-card">
          <div className="stat-label">ACTIVE IN BAY / STAGING</div>
          <div className="stat-row">
            <div className="stat-val blue">{loadingCount}</div>
            <div className="stat-icon-wrap blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><path d="M16 8h4l3 3v4h-7V8z"></path><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>
          </div>
          <div className="stat-sub blue-text">⟲ Avg turnaround 26m</div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          TABLE CONTROLS
      ──────────────────────────────────────────────────────── */}
      <div className="reg-table-controls">
        <div className="reg-tabs">
          <button className={`reg-tab ${activeTab === "All" ? "active" : ""}`} onClick={() => setActiveTab("All")}>All Passes ({totalPasses})</button>
          <button className={`reg-tab ${activeTab === "Inward" ? "active" : ""}`} onClick={() => setActiveTab("Inward")}>Inward IW- ({inwardCount})</button>
          <button className={`reg-tab ${activeTab === "Outward" ? "active" : ""}`} onClick={() => setActiveTab("Outward")}>Outward OW- ({outwardCount})</button>
          <button className={`reg-tab ${activeTab === "Loading" ? "active blue" : ""}`} onClick={() => setActiveTab("Loading")}>
            <span className="dot"></span> Loading / In-Process ({loadingCount})
          </button>
        </div>
        <div className="reg-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          <input type="text" placeholder="Filter plate, pass #, vendor..." className="reg-search-input" />
          <button className="reg-filter-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg></button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          DATA TABLE
      ──────────────────────────────────────────────────────── */}
      <div className="reg-table-wrapper">
        <table className="reg-table">
          <thead>
            <tr>
              <th>GATE PASS NO</th>
              <th>VEHICLE NUMBER</th>
              <th>VENDOR NAME</th>
              <th>VEHICLE REPORTING TIME</th>
              <th>VEHICLE OUT TIME</th>
              <th>STATUS</th>
              <th>LINE ITEM</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, i) => (
              <tr key={i}>
                <td>
                  <span className={`reg-pass-badge ${row.isOutward ? "outward" : "inward"}`}>
                    {row.gatePass}
                  </span>
                </td>
                <td><span className="reg-vehicle-badge">{row.VehicleNumber}</span></td>
                <td className="fw-600">{row.vendorName}</td>
                <td className="color-gray">{row.vehicleReportingTime}</td>
                <td className="color-gray">{row.outTime}</td>
                <td>
                  <span className={`reg-status-badge ${(row.status || "").toLowerCase().includes("process") ? "process" : "completed"}`}>
                    <span className="dot"></span> {row.status}
                  </span>
                </td>
                <td className="fw-700">{row.lineItem}</td>
                <td>
                  <div className="reg-action-btns">
                    <button className="action-btn" onClick={() => openModal(row)} title="View Details">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button className="action-btn" title="Print">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    </button>
                    {row.isOutward && <span className="action-tag">OUT</span>}
                  </div>
                </td>
              </tr>
            ))}
            {displayData.length === 0 && (
              <tr>
                <td colSpan="8" style={{textAlign: "center", padding: "40px", color: "#64748b"}}>No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ────────────────────────────────────────────────────────
          MODAL
      ──────────────────────────────────────────────────────── */}
      {isModalOpen && selectedRow && (
        <div className="reg-modal-overlay" onClick={closeModal}>
          <div className="reg-modal" onClick={e => e.stopPropagation()}>
            
            <div className="rm-header">
              <div className="rm-header-left">
                <div className="rm-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                </div>
                <div>
                  <div className="rm-title">
                    More Details — {selectedRow.gatePass}
                    <span className={`reg-status-badge ${(selectedRow.status || "").toLowerCase().includes("process") ? "process" : "completed"}`} style={{marginLeft: "12px", verticalAlign: "middle"}}>
                      <span className="dot"></span> {selectedRow.status}
                    </span>
                  </div>
                  <div className="rm-subtitle">Validated Electronic Gate Manifest • Plant {selectedRow.plant}</div>
                </div>
              </div>
              <div className="rm-header-right">
                <button className="rm-icon-btn" onClick={handleDownloadPDF} title="Print / PDF">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                </button>
                <button className="rm-icon-btn rm-close-btn" onClick={closeModal}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>

            <div className="rm-body" ref={contentRef}>
              
              {/* Data Grid 1 */}
              <div className="rm-grid">
                <div className="rm-card">
                  <div className="rm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg></div>
                  <div>
                    <div className="rm-label">Gate Entry Number</div>
                    <div className="rm-value">{selectedRow.gatePass}</div>
                  </div>
                </div>
                <div className="rm-card">
                  <div className="rm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></div>
                  <div>
                    <div className="rm-label">Remarks</div>
                    <div className="rm-value">{selectedRow.remarks}</div>
                  </div>
                </div>
                <div className="rm-card">
                  <div className="rm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
                  <div>
                    <div className="rm-label">Invoice Number</div>
                    <div className="rm-value">{selectedRow.invoiceNumber}</div>
                  </div>
                </div>
                <div className="rm-card">
                  <div className="rm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
                  <div>
                    <div className="rm-label">Document Date</div>
                    <div className="rm-value">{selectedRow.documentDate}</div>
                  </div>
                </div>

                <div className="rm-card">
                  <div className="rm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div>
                  <div>
                    <div className="rm-label">Vendor Id</div>
                    <div className="rm-value">{selectedRow.vendorId}</div>
                  </div>
                </div>
                <div className="rm-card">
                  <div className="rm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                  <div>
                    <div className="rm-label">Driver Name</div>
                    <div className="rm-value">{selectedRow.driverName}</div>
                  </div>
                </div>
                <div className="rm-card">
                  <div className="rm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
                  <div>
                    <div className="rm-label">Plant</div>
                    <div className="rm-value">{selectedRow.plant}</div>
                  </div>
                </div>
                <div className="rm-card">
                  <div className="rm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><path d="M16 8h4l3 3v4h-7V8z"></path><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>
                  <div>
                    <div className="rm-label">Mode Of Transport</div>
                    <div className="rm-value">{selectedRow.modeOfTransport}</div>
                  </div>
                </div>

                <div className="rm-card">
                  <div className="rm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
                  <div>
                    <div className="rm-label">Road Permit No.</div>
                    <div className="rm-value">{selectedRow.roadPermitNumber}</div>
                  </div>
                </div>
                <div className="rm-card">
                  <div className="rm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
                  <div>
                    <div className="rm-label">LR Number & Date</div>
                    <div className="rm-value">{selectedRow.lrNo} ({selectedRow.lrDate})</div>
                  </div>
                </div>
                <div className="rm-card">
                  <div className="rm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>
                  <div>
                    <div className="rm-label">Packages</div>
                    <div className="rm-value">{selectedRow.packages}</div>
                  </div>
                </div>
                <div className="rm-card">
                  <div className="rm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                  <div>
                    <div className="rm-label">Vehicle Reporting Time</div>
                    <div className="rm-value">{selectedRow.vehicleReportingTime}</div>
                  </div>
                </div>
              </div>

              {/* Vendor Banner */}
              <div className="rm-vendor-banner">
                <div className="rm-v-left">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                  <div>
                    <div className="rm-label">TRANSPORTER VENDOR NAME</div>
                    <div className="rm-v-name">{selectedRow.vendorName}</div>
                  </div>
                </div>
                <div className="rm-v-right">
                  <div className="rm-label">Assigned Bay</div>
                  <div className="rm-bay">BAY-04 ({selectedRow.isOutward ? "OUTBOUND" : "INBOUND"} DOCK)</div>
                </div>
              </div>

              {/* Line Items */}
              <div className="rm-line-items">
                <div className="rm-li-header">
                  <span className="rm-li-title">Consignment Line Items</span>
                  <span className="rm-li-count">{(selectedRow.lineitemDetails || []).length} Material Record Verified</span>
                </div>
                <table className="rm-table">
                  <thead>
                    <tr>
                      <th>LINE ITEM</th>
                      <th>PO NUMBER</th>
                      <th>MATERIAL NUMBER</th>
                      <th>MATERIAL DESC</th>
                      <th>UNIT</th>
                      <th>PENDING QUANTITY</th>
                      <th>BILLED QUANTITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedRow.lineitemDetails || []).length > 0 ? (
                      (selectedRow.lineitemDetails || []).map((item, index) => (
                        <tr key={index}>
                          <td className="fw-700">{item.LINE_ITEM}</td>
                          <td>{item.PO_NO || "--"}</td>
                          <td>{item.MATERIAL_NO || "--"}</td>
                          <td>{item.MATERIAL_DESC || "--"}</td>
                          <td>{item.UNIT_DESC || "--"}</td>
                          <td className="fw-600">{item.PENDING_QTY || "--"}</td>
                          <td className="fw-700 color-blue">{item.BILLED_QTY || "--"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="7" style={{textAlign: "center", padding: "20px"}}>No line items found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="rm-footer">
              <div className="rm-weight">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Weighbridge Gross Stamp: <span className="fw-700" style={{color: "#1e293b"}}>24,850 KG</span>
              </div>
              <div className="rm-footer-actions">
                <button className="rm-btn-outline" onClick={closeModal}>Close View</button>
                <button className="rm-btn-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Authorize Gate Exit
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
    </main>
  </div>
</div>
  );
};

export default Table;
