import React, { useEffect, useState } from "react";
import "../../Stylesheet/Details.scss";
import "../../Stylesheet/Report.scss";
import "./VehicleReport.css";
import "../Dashboard/Home.css";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { vehicleRegister } from "../../redux/action/VehicleRegister";
import Select from "react-select";
import ReportTable from "../../Components/ReportTable";
import moment from "moment";
import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL

function VehicleReport(props) {
  const navigate = useNavigate();

  const [data, setdata] = useState({
    VEHICLE_NO: "",
    DRIVER_NAME: "",
    DRIVER_MOBILE_NO: "",
    MODE_OF_TRANSPORT: "",
    VEHICLE_CATEGORY: "",
    ROAD_PERMIT_NUMBER: "",
    PLANT: "",
    LR_DATE: "",
    LR_NO: "",
    MODE: "",
    PO_NUMBER: [""],
    REMARK: "",
  });

  console.log("data", data);

  const [error, seterror] = useState({});
  const [plantOptions, setPlantOptions] = useState([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [poInput, setPoInput] = useState("");
  const [motList, setMotList] = useState([]);
  const [motName, setMotName] = useState();
  const [vcatList, setVcat] = useState([]);
  const [vcatName, setVcatName] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [details, setDetails] = useState(null);
  const [admin, setAdmin] = useState([]);
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [poModalData, setPoModalData] = useState(null);
  const [tableData, setTableData] = useState([]);

  const setValue = (val) => {
    setdata((prev) => ({ ...prev, ...val }));
  };

  useEffect(() => {
    const persistRoot = localStorage.getItem("persist:root");
    if (persistRoot) {
      try {
        const parsedPersist = JSON.parse(persistRoot);
        const loginReducer = JSON.parse(parsedPersist.loginreducer);
        setAdmin(loginReducer?.isAdmin || []);
        setDetails(loginReducer?.details);
      } catch (error) {
        console.error("Error parsing persist:root data:", error);
      }
    }

    const fetchVehicleData = async () => {
      try {
        const response = await axios.get(
          `${apiURL}Vehicle/GetVehicle`
        );
        setVehicles(response.data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch vehicle data");
      }
    };
    fetchVehicleData();
  }, []);

  const cancelButton = async () => {
    const bodytoSend = {
      REMARK: data.REMARK || "",
    };
    const apiUrl = `${apiURL}Vehicle/cancelEntry?id=${selectedRow.vehicaleNo}&key=${selectedRow.vehicleKey}`;
    try {
      const response = await axios.post(apiUrl, bodytoSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success(`Entry ${selectedRow.vehicaleNo} Cancelled!`);
        setdata((prev) => ({ ...prev, REMARK: "" }));
        setIsCancelModalOpen(false);
      }
    } catch (err) {
      toast.error("Error while cancelling");
      console.error("Cancel error:", err);
    }
    fetchData();
  };

  const Mode = [
    { label: "Inward", value: 0 },
    { label: "Outward", value: 1 },
  ];

  const [ModeType, setModeType] = useState("");

  const handleChangeMode = (selectedModOption) => {
    setModeType(selectedModOption);
    setdata((prevData) => ({
      ...prevData,
      MODE: selectedModOption ? selectedModOption.value : "",
      PO_NUMBER: selectedModOption && selectedModOption.value !== 0 ? [""] : prevData.PO_NUMBER,
    }));
  };

  const handleSelectChange = (selected, actionMeta) => {
    const name = actionMeta?.name || "PLANT";
    setdata((prevData) => ({
      ...prevData,
      [name]: selected ? selected.value : "",
    }));
    setSelectedOptions(selected);
  };

  const openCancelModal = (row) => {
    setSelectedRow(row);
    setIsCancelModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [motResponse, vcatResponse, plantResponse] = await Promise.all([
          fetch(`${apiURL}Employee/mot`),
          fetch(`${apiURL}Employee/vehicle_category`),
          details ? fetch(`${apiURL}Employee/allocated_plant?id=${details}`) : Promise.resolve(null),
        ]);

        if (motResponse.ok) {
          const newData = await motResponse.json();
          setMotList(newData.map((item) => ({ label: item.LABLE, value: item.LABLE })));
        }

        if (vcatResponse.ok) {
          const newData1 = await vcatResponse.json();
          setVcat(newData1.map((item) => ({ label: item.LABLE, value: item.LABLE })));
        }

        if (plantResponse && plantResponse.ok) {
          const newData2 = await plantResponse.json();
          setPlantOptions(
            newData2.map((item) => ({
              label: `${item.PLANT_NAME}-${item.PLANT_ID}`,
              value: item.PLANT_ID,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to fetch dropdown data");
      }
    };

    fetchData();
  }, [details]);

  const handleChange = (selectedOption) => {
    setMotName(selectedOption);
    setdata((prevData) => ({
      ...prevData,
      MODE_OF_TRANSPORT: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleInputChange = (event) => {
    setdata((prev) => ({ ...prev, REMARK: event.target.value }));
  };

  const cancelModel = () => {
    setIsCancelModalOpen(false);
    setdata((prev) => ({ ...prev, REMARK: "" }));
  };

  const handleChangeVcat = (selectedVcatOption) => {
    setVcatName(selectedVcatOption);
    setdata((prevData) => ({
      ...prevData,
      VEHICLE_CATEGORY: selectedVcatOption ? selectedVcatOption.value : "",
    }));
  };

  useEffect(() => {
    if (vehicles.length > 0 && selectedRow) { // Only run if editing a specific vehicle
      const vehicle = vehicles.find((v) => v.VEHICLE_NO === selectedRow.vehicaleNo);
      if (vehicle) {
        const newData = {
          DRIVER_NAME: vehicle.DRIVER_NAME || "",
          MODE_OF_TRANSPORT: vehicle.MODE_OF_TRANSPORT || "",
          VEHICLE_CATEGORY: vehicle.VEHICLE_CATEGORY || "",
          ROAD_PERMIT_NUMBER: vehicle.ROAD_PERMIT_NUMBER || "",
          LR_NO: vehicle.LR_NO || "",
          LR_DATE: vehicle.LR_DATE || "",
          DRIVER_MOBILE_NO: vehicle.DRIVER_MOBILE_NO || "", // Only set when editing
          VEHICLE_REPORTING_TIME: vehicle.VEHICLE_REPORTING_TIME
            ? new Date(vehicle.VEHICLE_REPORTING_TIME).toISOString().slice(0, 16)
            : "",
          VEHICLE_KEY: vehicle.VEHICLE_KEY,
          VEHICLE_NO: vehicle.VEHICLE_NO || "",
        };
        setdata((prev) => ({ ...prev, ...newData }));
      }
    }
  }, [vehicles, selectedRow]);

  const handleSubmit = async () => {
    let hasErr = false;
    let requiredFields = [
      "VEHICLE_NO",
      "DRIVER_NAME",
      "DRIVER_MOBILE_NO",
      "MODE_OF_TRANSPORT",
      "VEHICLE_CATEGORY",
    ];

    if (ModeType && ModeType.value === 0) {
      requiredFields.push("PO_NUMBER");
    }

    let err = {
      VEHICLE_NO: null,
      DRIVER_NAME: null,
      DRIVER_MOBILE_NO: null,
      MODE_OF_TRANSPORT: null,
      VEHICLE_CATEGORY: null,
      ROAD_PERMIT_NUMBER: null,
      PO_NUMBER: null,
    };

    requiredFields.forEach((item) => {
      if (data[item] === "" || data[item] == null || (item === "PO_NUMBER" && data[item].length === 0)) {
        hasErr = true;
        err[item] = "This field is mandatory";
      }
    });
    seterror(err);

    if (!hasErr) {
      try {
        let updatedData = { ...data, FLAG: 1 };

        if (ModeType && ModeType.value === 0) {
          const upperPOs = (data.PO_NUMBER || []).map((po) => po.toUpperCase());

          // Skip validation for free-text PO entries
          if (
            upperPOs.some(
              (po) => po.startsWith("RGP") || po.startsWith("NRGP") || po.startsWith("OTH")
            )
          ) {
            updatedData.PO_NUMBER = upperPOs.map((po) => ({
              PO: po,
              FLAG: "1",
            }));
          } else {
            const send_data = {
              PLANT: data.PLANT,
              PO: upperPOs,
            };

            const poResponse = await axios.post(
              `${apiURL}Vehicle/checkApprovedPo`,
              send_data,
              { headers: { "Content-Type": "application/json" } }
            );

            const poData = poResponse.data;

            if (!Array.isArray(poData) || poData.length === 0) {
              toast.error("Invalid or empty PO data received.");
              seterror((prev) => ({
                ...prev,
                PO_NUMBER: "PO data not found or invalid",
              }));
              return;
            }

            const hasFlag1 = poData.some((po) => po.FLAG === 1);
            const allFlag0 = poData.every((po) => po.FLAG === 0);

            if (hasFlag1) {
              updatedData.FLAG = 5;
            } else if (allFlag0) {
              updatedData.FLAG = 1;
            }

            // Format PO_NUMBER into array of objects
            updatedData.PO_NUMBER = poData.map((po) => ({
              PO: String(po.PO_NO),
              FLAG: String(po.FLAG),
            }));
          }
        }

        const vehicleResponse = await props.vehicleRegister(updatedData);

        if (vehicleResponse.status === 200) {
          toast.success(
            updatedData.FLAG === 5
              ? "Reporting Entry Created successfully with Unapproved PO(s)."
              : "Reporting Entry Created successfully."
          );
          navigate("/Home")
          setIsModalOpen(false);
          setdata({
            VEHICLE_NO: "",
            DRIVER_NAME: "",
            DRIVER_MOBILE_NO: "",
            MODE_OF_TRANSPORT: "",
            VEHICLE_CATEGORY: "",
            ROAD_PERMIT_NUMBER: "",
            PLANT: "",
            LR_DATE: "",
            LR_NO: "",
            MODE: "",
            PO_NUMBER: [""],
            REMARK: "",
          });
          setModeType("");
          setMotName(null);
          setVcatName(null);
          setPoInput("");
        } else {
          toast.error("Failed to create reporting entry");
          setIsModalOpen(false);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Error creating reporting entry";
        toast.error(errorMessage);
        setIsModalOpen(false);
      }
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setdata({
      VEHICLE_NO: "",
      DRIVER_NAME: "",
      DRIVER_MOBILE_NO: "",
      MODE_OF_TRANSPORT: "",
      VEHICLE_CATEGORY: "",
      ROAD_PERMIT_NUMBER: "",
      PLANT: "",
      LR_DATE: "",
      LR_NO: "",
      MODE: "",
      PO_NUMBER: [""],
      REMARK: "",
    });
    setModeType("");
    setMotName(null);
    setVcatName(null);
    setPoInput("");
  };

  const closePoModal = () => {
    setIsPoModalOpen(false);
    setPoModalData(null);
  };

  const handleStatusClick = (row) => {
    console.log("Eye button clicked for vehicle:", row.vehicaleNo, "Row data:", row);
    setPoModalData(row);
    setIsPoModalOpen(true);
  };

  const tableHeaders = [
    { label: "Type", dataKey: "type", className: "td-type" },
    { label: "Vehicle No", dataKey: "vehicaleNo", className: "vehicale-no" },
    { label: "Vehicle Type", dataKey: "vehicleType", className: "vehicale-type" },
    { label: "Driver Name", dataKey: "driverName", className: "driver-name" },
    { label: "Driver Mobile", dataKey: "driverMobile", className: "driver-mobile" },
    { label: "Reporting Date & Time", dataKey: "dateTime", className: "entry-date-time" },
    { label: "Status", dataKey: "status", className: "status" },
    ...(admin.includes("2") || admin.includes("3")
      ? [{
        label: "Actions",
        dataKey: "actions",
        className: "actions",
        render: (row) => (
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            {(row.status === "Pending for Unloading" || row.status === "Pending for Loading") && row.cancel === 0 ? (
              <img
                src="../../Images/In.png"
                onClick={() => handleEdit(row)}
                style={{ width: "4rem", height: "1.5rem", cursor: "pointer" }}
                alt="Inward"
              />
            ) : (
              <img
                src="../../Images/DisableInward.png"
                style={{ width: "4.2rem", height: "1.5rem", cursor: "not-allowed" }}
                alt="Disabled Inward"
              />
            )}
            {(row.status === "Pending for Unloading" || row.status === "Pending for Loading") && row.cancel === 0 ? (
              <img
                src="../../Images/cancel.png"
                onClick={() => openCancelModal(row)}
                style={{ width: "4.2rem", height: "1.5rem", cursor: "pointer" }}
                alt="Cancel"
              />
            ) : (
              <img
                src="../../Images/disable_cancel.png"
                style={{ width: "4.2rem", height: "1.5rem", cursor: "not-allowed" }}
                alt="Disabled Cancel"
              />
            )}
            <img
              src="../../Images/view_button.png"
              onClick={() => {
                if (row.status === "Pending for PO Approval") {
                  handleStatusClick(row);
                }
              }}
              style={{
                width: "2rem",
                height: "1.5rem",
                cursor: row.status === "Pending for PO Approval" ? "pointer" : "not-allowed",
                opacity: row.status === "Pending for PO Approval" ? 1 : 0.4,
              }}
              alt="View PO Approval"
            />
          </div>
        ),
      }]
      : []),
  ];

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiURL}Vehicle/getVehicleById?id=${details}`
      );
      if (response.data) {
        console.log("Reponse", response.data);
        const formattedData = response.data.map((item) => {
          const poArray = item.PO_NUMBER || [];
          const poMap = Object.fromEntries(poArray.map((po) => [po.PO, po.FLAG]));
          return {
            type: item.MODE === "0" ? "Inward" : item.MODE === "1" ? "Outward" : "N/A",
            vehicleType: item.VEHICLE_CATEGORY || "N/A",
            vehicaleNo: item.VEHICLE_NO || "N/A",
            vehicleKey: item.VEHICLE_KEY || "N/A",
            driverName: item.DRIVER_NAME || "N/A",
            driverMobile: item.DRIVER_MOBILE_NO || "N/A",
            dateTime: item.VEHICLE_REPORTING_TIME
              ? formatDateTime(item.VEHICLE_REPORTING_TIME)
              : "N/A",
            mode: item.MODE,
            cancel: item.IS_CANCELLED,
            poMap,
            status:
              item.MODE === "0"
                ? item.FLAG == "0"
                  ? "Unloading in process"
                  : item.FLAG == "1"
                    ? "Pending for Unloading"
                    : item.FLAG == "3"
                      ? "Cancelled"
                      : item.FLAG == "4"
                        ? "Pending Cancel"
                        : item.FLAG == "5"
                          ? "Pending for PO Approval"
                          : "Completed"
                : item.MODE === "1"
                  ? item.FLAG == "0"
                    ? "Loading in process"
                    : item.FLAG == "1"
                      ? "Pending for Loading"
                      : item.FLAG == "3"
                        ? "Cancelled"
                        : item.FLAG == "4"
                          ? "Pending Cancel"
                          : item.FLAG == "5"
                            ? "Pending for PO Approval"
                            : "Completed"
                  : "N/A",
          };
        });
        setTableData(formattedData);
      } else {
        toast.error("Invalid response format!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data!");
    }
  };

  useEffect(() => {
    if (details) {
      fetchData();
    }
  }, [details]);

  const modifiedData = tableData.map((row) => ({
    ...row,
    ...(admin.includes("3") || admin.includes("2")
      ? {
        actions: (
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            {(row.status === "Pending for Unloading" || row.status === "Pending for Loading") && row.cancel === 0 ? (
              <img
                src="../../Images/In.png"
                onClick={() => handleEdit(row)}
                style={{ width: "4rem", height: "1.5rem", cursor: "pointer" }}
                alt="Inward"
              />
            ) : (
              <img
                src="../../Images/DisableInward.png"
                style={{ width: "4.2rem", height: "1.5rem", cursor: "not-allowed" }}
                alt="Disabled Inward"
              />
            )}
            {(row.status === "Pending for Unloading" || row.status === "Pending for Loading") && row.cancel === 0 ? (
              <img
                src="../../Images/cancel.png"
                onClick={() => openCancelModal(row)}
                style={{ width: "4.2rem", height: "1.5rem", cursor: "pointer" }}
                alt="Cancel"
              />
            ) : (
              <img
                src="../../Images/disable_cancel.png"
                style={{ width: "4.2rem", height: "1.5rem", cursor: "not-allowed" }}
                alt="Disabled Cancel"
              />
            )}

            {/* Always show the view icon, but conditionally enable it */}
            <img
              src="../../Images/view_button.png"
              onClick={() => {
                if (row.status === "Pending for PO Approval") {
                  handleStatusClick(row);
                }
              }}
              style={{
                width: "2rem",
                height: "1.5rem",
                cursor: row.status === "Pending for PO Approval" ? "pointer" : "not-allowed",
                opacity: row.status === "Pending for PO Approval" ? 1 : 0.4,
              }}
              alt="View PO Approval"
            />
          </div>
        ),
      }
      : {}),
  }));

  const handleEdit = async (row) => {
    const apiUrl = `${apiURL}Vehicle/ChangeFlag?VEHICLE_NO=${row.vehicaleNo}&FLAG=0&MODE=${row.mode}`;
    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        toast.success(`Vehicle ${row.vehicaleNo} Entered in Premises!`);
        fetchData();
      } else {
        toast.error(`Failed to update flag for vehicle ${row.vehicaleNo}`);
      }
    } catch (error) {
      console.error("Error updating vehicle flag:", error);
      toast.error(`${error.message}`);
    }
  };

  const [isFocused, setIsFocused] = useState({
    VEHICLE_NO: false,
    DRIVER_NAME: false,
    DRIVER_MOBILE_NO: false,
    MODE_OF_TRANSPORT: false,
    VEHICLE_CATEGORY: false,
    ROAD_PERMIT_NUMBER: false,
    PLANT: false,
    LR_DATE: false,
    LR_NO: false,
    MODE: false,
    PO_NUMBER: false,
  });

  const inputStyle = {
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    height: "1vh",
    borderBottom: "1px solid black",
    width: "100%",
  };

  const focusStyle = {
    borderBottom: "1px solid rgb(25, 139, 198)",
    outline: "none",
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };


  const [sidebarOpen, setSidebarOpen] = useState(true);
  const showName = localStorage.getItem("EMP_NAME") || "User";
  const [activeTab, setActiveTab] = useState("All");
  const [weighbridge, setWeighbridge] = useState(true);

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
    { id: "dashboard", label: "Operations Dashboard", action: () => navigate("/Home"), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { id: "register", label: "Gate Pass Register", action: () => navigate("/Reports/Register"), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { id: "vehicle", label: "Vehicle Reporting", action: () => {}, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
    { id: "newgate", label: "New Gate Entry", action: () => {}, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
    { id: "plant", label: "Plant & User Access", action: () => {}, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  ];

  const filteredData = tableData.filter(row => {
    if (activeTab === "Truck-MCV") return row.vehicleType?.includes("MCV");
    if (activeTab === "Truck-HCV") return row.vehicleType?.includes("HCV");
    if (activeTab === "Pick UP") return row.vehicleType?.toLowerCase().includes("pick");
    return true;
  });

  return (
    <div className="hm-root">
      <header className="hm-topbar">
        <div className="hm-topbar-left">
          <button className="hm-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className="hm-brand">
            <img src="/Images/Frame_logo.png" alt="Logo" className="hm-brand-logo" />
            <div><div className="hm-brand-name">GateAccess Pro</div><div className="hm-brand-sub">YARD LOGISTICS OS</div></div>
          </div>
        </div>
        <div className="hm-topbar-right">
          <div className="hm-topbar-time">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {formatTime(time)} IST
          </div>
          <div className="hm-shift-badge">Shift A</div>
          <div className="hm-user-chip">
            <div className="hm-avatar">{showName.charAt(0).toUpperCase()}</div>
            <div><div className="hm-user-name">{showName}</div><div className="hm-user-role">Admin Dispatcher</div></div>
          </div>
        </div>
      </header>

      <div className="hm-body">
        <aside className={`hm-sidebar${sidebarOpen ? "" : " hm-sidebar-collapsed"}`}>
          <div className="hm-sidebar-section-label">OPERATIONS COMMAND</div>
          <nav className="hm-sidebar-nav">
            {navItems.map((item) => (
              <button key={item.id} className={`hm-nav-item${item.id === "vehicle" ? " active" : ""}`} onClick={item.action}>
                <span className="hm-nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="hm-nav-label">{item.label}</span>}
              </button>
            ))}
          </nav>
          <div className="hm-sidebar-footer">
            <div className="hm-terminal-info">
              <div className="hm-terminal-dot"></div>
              {sidebarOpen && <div><div className="hm-terminal-label">Active Terminal</div><div className="hm-terminal-name">GATEWAY #02</div><span className="hm-terminal-badge">INBOUND</span></div>}
            </div>
            {sidebarOpen && <div className="hm-version">v2.8.4-R3</div>}
          </div>
        </aside>

        <main className="hm-main" style={{padding: 0, backgroundColor: "#f8fafc"}}>
          <div className="vr-root">
            <div className="vr-title-row">
              <div className="vr-title-left">
                <h1>Vehicle Reporting & Security Gate Queue</h1>
                <div className="vr-status-badges">
                  <div className="vr-badge-blue"><span className="dot"></span> {tableData.length} Trucks at Bay</div>
                  <div className="vr-badge-light">{tableData.filter(d=>d.status?.includes("Pending")).length} Pending</div>
                </div>
              </div>
            </div>

            <div className="vr-table-controls">
              <div className="vr-controls-left">
                <button className="vr-btn-primary" onClick={openModal}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  + Add Vehicle Details
                </button>
                <div className="vr-tabs">
                  <button className={`vr-tab ${activeTab==="All"?"active":""}`} onClick={()=>setActiveTab("All")}>All ({tableData.length})</button>
                  <button className={`vr-tab ${activeTab==="Truck-MCV"?"active":""}`} onClick={()=>setActiveTab("Truck-MCV")}>Truck-MCV</button>
                  <button className={`vr-tab ${activeTab==="Truck-HCV"?"active":""}`} onClick={()=>setActiveTab("Truck-HCV")}>Truck-HCV</button>
                  <button className={`vr-tab ${activeTab==="Pick UP"?"active":""}`} onClick={()=>setActiveTab("Pick UP")}>Pick UP</button>
                </div>
              </div>
              <div className="vr-controls-right">
                <div className="vr-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" placeholder="Search plate, driver, mobile..." />
                </div>
                <button className="vr-refresh-btn" onClick={fetchData}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                </button>
              </div>
            </div>

            <div className="vr-table-wrapper">
              <table className="vr-table">
                <thead><tr>
                  <th>TYPE</th><th>VEHICLE NO</th><th>VEHICLE TYPE</th>
                  <th>DRIVER</th><th>MOBILE</th><th>REPORTED AT</th><th>STATUS</th><th>ACTIONS</th>
                </tr></thead>
                <tbody>
                  {filteredData.map((row, i) => (
                    <tr key={i}>
                      <td><span className={`vr-type-badge ${row.type?.toLowerCase()}`}><span className="dot"></span>{row.type}</span></td>
                      <td><span className="vr-veh-no">{row.vehicaleNo}</span></td>
                      <td>{row.vehicleType}</td>
                      <td>{row.driverName}</td>
                      <td>{row.driverMobile}</td>
                      <td>{row.dateTime}</td>
                      <td><span className="vr-status-badge"><span className="dot"></span>{row.status}</span></td>
                      <td>
                        <div className="vr-actions-cell">
                          <button className="vr-btn-start"
                            disabled={!((row.status==="Pending for Unloading"||row.status==="Pending for Loading")&&row.cancel===0)}
                            onClick={()=>handleEdit(row)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            Start
                          </button>
                          <button className="vr-btn-cancel"
                            disabled={!((row.status==="Pending for Unloading"||row.status==="Pending for Loading")&&row.cancel===0)}
                            onClick={()=>openCancelModal(row)}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                            Cancel
                          </button>
                          <button className="vr-btn-icon"
                            disabled={row.status!=="Pending for PO Approval"}
                            onClick={()=>{if(row.status==="Pending for PO Approval")handleStatusClick(row);}}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>{/* /vr-table-wrapper */}
          </div>{/* /vr-root */}
          <Toaster />
          {isCancelModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                width: "45%",
                height: "40%",
                backgroundColor: "#fff",
                padding: "2.5rem",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontFamily: "Inter",
                  fontWeight: "600",
                  fontSize: "1rem",
                  marginBottom: "0.5rem",
                }}
              >
                Reason For Cancellation?
              </div>
              <textarea
                placeholder="Type Here..."
                value={data.REMARK || ""}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  height: "10rem",
                  backgroundColor: "#E9F2F9",
                  borderRadius: "1rem",
                  marginBottom: "1rem",
                  border: "none",
                  padding: "0.5rem",
                  resize: "none",
                  fontSize: "14px",
                  textAlign: "left",
                  verticalAlign: "top",
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", flexDirection: "row-reverse", gap: "1rem" }}>
                <button
                  style={{
                    width: "6rem",
                    height: "2rem",
                    background: "radial-gradient(circle, #00B8EE, #17A1D4)",
                    color: "#FFFFFF",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={cancelButton}
                >
                  Submit
                </button>
                <button
                  style={{
                    border: "none",
                    borderRadius: "0.5rem",
                    color: "#F0312B",
                    width: "5rem",
                    height: "2rem",
                    borderStyle: "solid",
                    borderColor: "#F0312B",
                    cursor: "pointer",
                  }}
                  onClick={cancelModel}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {isPoModalOpen && poModalData && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                width: "45%",
                height: "auto",
                maxHeight: "60%",
                backgroundColor: "#fff",
                padding: "2.5rem",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontFamily: "Inter",
                  fontWeight: "600",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                }}
              >
                PO Approval Status for Vehicle {poModalData.vehicaleNo}
              </div>

              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {/* Separate PO lists */}
                {(() => {
                  const poMap = poModalData.poMap || {};
                  const approved = [];
                  const unapproved = [];

                  Object.entries(poMap).forEach(([po, flag]) => {
                    if (flag === "0") approved.push(po);
                    else unapproved.push(po);
                  });

                  return (
                    <>
                      {approved.length > 0 && (
                        <div
                          style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            padding: "0.5rem 1rem",
                            margin: "0.5rem 0",
                            borderRadius: "5px",
                            fontSize: "14px",
                          }}
                        >
                          Approved PO: {approved.join(", ")}
                        </div>
                      )}
                      {unapproved.length > 0 && (
                        <div
                          style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                            padding: "0.5rem 1rem",
                            margin: "0.5rem 0",
                            borderRadius: "5px",
                            fontSize: "14px",
                          }}
                        >
                          Unapproved PO: {unapproved.join(", ")}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  style={{
                    border: "none",
                    borderRadius: "0.5rem",
                    color: "#F0312B",
                    width: "5rem",
                    height: "2rem",
                    borderStyle: "solid",
                    borderColor: "#F0312B",
                    cursor: "pointer",
                  }}
                  onClick={closePoModal}
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        )}

        </main>{/* /hm-main */}
      </div>{/* /hm-body */}

      {/* ── Add Vehicle Modal ── */}
      {isModalOpen && (
        <div className="av-overlay">
          <div className="av-modal">
            {/* Header */}
            <div className="av-header">
              <div className="av-header-left">
                <div className="av-header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </div>
                <div>
                  <div className="av-header-title">Fast Gate Check-in — Add Vehicle Details</div>
                  <div className="av-header-sub">Terminal 1102 Inward/Outward Registration</div>
                </div>
              </div>
              <button className="av-close-btn" onClick={closeModal}>×</button>
            </div>

            {/* ANPR Banner */}
            <div className="av-anpr-banner">
              <div className="av-anpr-left">
                <div className="av-anpr-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                </div>
                <div className="av-anpr-text">
                  <strong>ANPR Camera #2 Link Active</strong>
                  <span>Gate camera pre-filled detected plate: <span className="av-anpr-plate">{data.VEHICLE_NO || "—"}</span></span>
                </div>
              </div>
              <button className="av-apply-btn">Apply Plate</button>
            </div>

            {/* Form Body */}
            <div className="av-body">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
                  <div className="av-field">
                    <label className="av-label">Vehicle Number <span className="av-required">*</span></label>
                    <input
                      type="text"
                      required
                      minLength="8"
                      maxLength="10"
                      value={data.VEHICLE_NO || ""}
                      onChange={(event) => {
                        let upperCaseValue = event.target.value.toUpperCase();
                        // Strip out anything that isn't a letter or number (spaces, ., /, *, -, etc.)
                        upperCaseValue = upperCaseValue.replace(/[^A-Z0-9]/g, "");
                        setValue({ VEHICLE_NO: upperCaseValue });

                        seterror((prevError) => ({
                          ...prevError,
                          VEHNO: "",
                        }));

                        if (
                          upperCaseValue.length < 8 ||
                          upperCaseValue.length > 10 ||
                          !/^[A-Z0-9]{8,10}$/.test(upperCaseValue)
                        ) {
                          seterror((prevError) => ({
                            ...prevError,
                            VEHNO: "Vehicle Number must be 8-10 characters, letters and numbers only.",
                          }));
                        }
                      }}
                      placeholder="Enter Vehicle Number"
                      style={{
                        textTransform: "uppercase",
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "1px solid black",
                        ...inputStyle,
                        ...(isFocused.VEHICLE_NO ? focusStyle : {}),
                      }}
                      onFocus={() => handleFocus("VEHICLE_NO")}
                      onBlur={() => handleBlur("VEHICLE_NO")}
                    />
                    {error.VEHNO && (
                      <p style={{ color: "red", fontSize: "12px", marginTop: "-0.75rem" }}>
                        {error.VEHNO}
                      </p>
                    )}
                  </div>

                  <div className="av-field">
                    <label className="av-label">Name of Driver <span className="av-required">*</span></label>
                    <input
                      type="text"
                      placeholder="Please enter Driver Name"
                      required
                      onChange={(text) => (
                        setValue({ DRIVER_NAME: text.target.value }),
                        seterror({ ...error, DRIVER_NAME: "" })
                      )}
                      className="av-input"
                      onFocus={() => handleFocus("DRIVER_NAME")}
                      onBlur={() => handleBlur("DRIVER_NAME")}
                    />
                    {error.NAME && <span className="error">{error.NAME}</span>}
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
                  <div className="av-field">
                    <label className="av-label" htmlFor="mobileNumber">Driver Mobile Number <span className="av-required">*</span></label>
                    <input
                      type="text"
                      id="mobileNumber"
                      minLength="10"
                      maxLength="10"
                      value={data.DRIVER_MOBILE_NO}
                      onChange={(event) => {
                         const inputValue = event.target.value.replace(/\D/g, "");
                        setValue({ DRIVER_MOBILE_NO: inputValue });

                        seterror((prevError) => ({
                          ...prevError,
                          DRIVER_MOBILE_NO: "",
                        }));

                        if (
                          inputValue.length !== 10 ||
                          !/^\d{10}$/.test(inputValue)
                        ) {
                          seterror((prevError) => ({
                            ...prevError,
                            DRIVER_MOBILE_NO:
                              "Mobile number must be exactly 10 digits.",
                          }));
                        }
                      }}
                      placeholder="Enter 10-digit mobile Number"
                      className="av-input"
                      onFocus={() => handleFocus("DRIVER_MOBILE_NO")}
                      onBlur={() => handleBlur("DRIVER_MOBILE_NO")}
                    />
                    {error.DRIVER_MOBILE_NO && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "-0.75rem",
                        }}
                      >
                        {error.DRIVER_MOBILE_NO}
                      </p>
                    )}
                  </div>

                  <div className="av-field">
                    <label className="av-label">Mode of Transport <span className="av-required">*</span></label>
                    <div style={{ width: "88%" }}>
                      <Select
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: state.isFocused
                              ? "rgb(25, 139, 198)"
                              : "black",
                            height: "3vh",
                            boxShadow: state.isFocused
                              ? "0 0 5px rgb(25, 139, 198)"
                              : "",
                            overflowY: "auto",
                            scrollbarWidth: "none",
                            maxHeight: "100px",
                            borderTop: "none",
                            borderLeft: "none",
                            borderRight: "none",
                            fontSize: "0.7rem",
                          }),
                          option: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: state.isFocused
                              ? "#198bc6"
                              : "white",
                            color: state.isFocused ? "white" : "black",
                            ":hover": {
                              backgroundColor: "#198bc6",
                              color: "white",
                            },
                          }),
                          multiValue: (baseStyles) => ({
                            ...baseStyles,
                            backgroundColor: "#198bc6",
                            color: "white",
                          }),
                          multiValueLabel: (baseStyles) => ({
                            ...baseStyles,
                            color: "white",
                          }),
                          multiValueRemove: (baseStyles) => ({
                            ...baseStyles,
                            color: "white",
                            ":hover": {
                              backgroundColor: "red",
                              color: "white",
                            },
                          }),
                        }}
                        value={motName}
                        onChange={handleChange}
                        options={motList}
                        name="MODE_OF_TRANSPORT"
                        placeholder="Select MODE OF TRANSPORT..."
                      />
                    </div>
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
                  <div className="av-field">
                    <label className="av-label">Vehicle Category <span className="av-required">*</span></label>
                    <div style={{ width: "88%" }}>
                      <Select
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: state.isFocused
                              ? "rgb(25, 139, 198)"
                              : "black",
                            height: "3vh",
                            boxShadow: state.isFocused
                              ? "0 0 5px rgb(25, 139, 198)"
                              : "",
                            overflowY: "auto",
                            scrollbarWidth: "none",
                            maxHeight: "100px",
                            borderTop: "none",
                            borderLeft: "none",
                            borderRight: "none",
                            fontSize: "0.7rem",
                          }),
                          option: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: state.isFocused
                              ? "#198bc6"
                              : "white",
                            color: state.isFocused ? "white" : "black",
                            ":hover": {
                              backgroundColor: "#198bc6",
                              color: "white",
                            },
                          }),
                          multiValue: (baseStyles) => ({
                            ...baseStyles,
                            backgroundColor: "#198bc6",
                            color: "white",
                          }),
                          multiValueLabel: (baseStyles) => ({
                            ...baseStyles,
                            color: "white",
                          }),
                          multiValueRemove: (baseStyles) => ({
                            ...baseStyles,
                            color: "white",
                            ":hover": {
                              backgroundColor: "red",
                              color: "white",
                            },
                          }),
                        }}
                        value={vcatName}
                        onChange={handleChangeVcat}
                        options={vcatList}
                        name="VEHICLE_CATEGORY"
                        placeholder="Select Vehicle Category..."
                      />
                    </div>
                  </div>

                  <div className="av-field">
                    <label className="av-label">EWay Bill No.</label>
                    <input
                      type="text"
                      placeholder="Please enter EWay Bill Number"
                      value={data.ROAD_PERMIT_NUMBER}
                      onChange={(text) => (
                        setValue({
                          ROAD_PERMIT_NUMBER: text.target.value.toUpperCase(),
                        }),
                        seterror({ ...error, ROAD_PERMIT_NUMBER: "" })
                      )}
                      className="av-input"
                      onFocus={() => handleFocus("ROAD_PERMIT_NUMBER")}
                      onBlur={() => handleBlur("ROAD_PERMIT_NUMBER")}
                    />
                    {error.PERMIT && <span className="error">{error.PERMIT}</span>}
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
                  <div className="av-field">
                    <label className="av-label">Plant <span className="av-required">*</span></label>
                    <div style={{ width: "88%" }}>
                      <Select
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: state.isFocused ? "rgb(25, 139, 198)" : "black",
                            height: "4vh",
                            boxShadow: state.isFocused ? "0 0 5px rgb(25, 139, 198)" : "",
                            overflowY: "auto",
                            scrollbarWidth: "none",
                            maxHeight: "100px",
                            borderTop: "none",
                            borderLeft: "none",
                            borderRight: "none",
                          }),
                          option: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: state.isFocused ? "#198bc6" : "white",
                            color: state.isFocused ? "white" : "black",
                            ":hover": {
                              backgroundColor: "#198bc6",
                              color: "white",
                            },
                          }),
                        }}
                        value={plantOptions.find((item) => item.value === data.PLANT)}
                        onChange={(selectedOption) => handleSelectChange(selectedOption)}
                        options={plantOptions}
                        name="PLANT"
                        placeholder="Select Plant..."
                      />
                    </div>
                  </div>

                  <div className="av-field">
                    <label className="av-label">LR Number</label>
                    <input
                      type="text"
                      onChange={(text) => (
                        setValue({ LR_NO: text.target.value }),
                        seterror({ ...error, LR_NO: "" })
                      )}
                      placeholder="Please enter LR Number"
                      className="av-input"
                      onFocus={() => handleFocus("LR_NO")}
                      onBlur={() => handleBlur("LR_NO")}
                    />
                    {error.LR_NO && <span className="error">{error.LR_NO}</span>}
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
                  <div className="av-field">
                    <label className="av-label">LR Date</label>
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split("T")[0]}
                      value={data.LR_DATE || ""}
                      onChange={(text) => (
                        setValue({ LR_DATE: text.target.value }),
                        seterror({ ...error, LR_DATE: "" })
                      )}
                      placeholder="Please enter LR Date"
                      className="av-input"
                      onFocus={() => handleFocus("LR_DATE")}
                      onBlur={() => handleBlur("LR_DATE")}
                    />
                    {error.LR_DATE && (
                      <span className="error">{error.LR_DATE}</span>
                    )}
                  </div>
                  <div className="av-field">
                    <label className="av-label">Type of Entry <span className="av-required">*</span></label>
                    <div style={{ width: "88%" }}>
                      <Select
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: state.isFocused
                              ? "rgb(25, 139, 198)"
                              : "black",
                            height: "3vh",
                            boxShadow: state.isFocused
                              ? "0 0 5px rgb(25, 139, 198)"
                              : "",
                            overflowY: "auto",
                            scrollbarWidth: "none",
                            maxHeight: "100px",
                            borderTop: "none",
                            borderLeft: "none",
                            borderRight: "none",
                            fontSize: "0.7rem",
                          }),
                          option: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: state.isFocused
                              ? "#198bc6"
                              : "white",
                            color: state.isFocused ? "white" : "black",
                            ":hover": {
                              backgroundColor: "#198bc6",
                              color: "white",
                            },
                          }),
                          multiValue: (baseStyles) => ({
                            ...baseStyles,
                            backgroundColor: "#198bc6",
                            color: "white",
                          }),
                          multiValueLabel: (baseStyles) => ({
                            ...baseStyles,
                            color: "white",
                          }),
                          multiValueRemove: (baseStyles) => ({
                            ...baseStyles,
                            color: "white",
                            ":hover": {
                              backgroundColor: "red",
                              color: "white",
                            },
                          }),
                        }}
                        value={ModeType}
                        onChange={handleChangeMode}
                        options={Mode}
                        name="MODE"
                        placeholder="Select Type of Entry..."
                      />
                    </div>
                    {error.MODE && <span className="error">{error.MODE}</span>}
                  </div>
                </div>

                {ModeType && ModeType.value === 0 && (
                  <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                    <div className="av-field">
                      <label className="av-label">PO Number <span className="av-required">*</span></label>
                      <input
                        type="text"
                        placeholder="Enter PO No. (comma separated)"
                        value={poInput}
                        onChange={(e) => {
                          setPoInput(e.target.value); // don't split yet!
                          seterror((prevError) => ({
                            ...prevError,
                            PO_NUMBER: "",
                          }));
                        }}
                        onBlur={() => {
                          const arrayOfPOs = poInput
                            .split(",")
                            .map((item) => item.trim().toUpperCase())
                            .filter(Boolean);
                          setValue({ PO_NUMBER: arrayOfPOs });
                        }}
                        className="av-input"
                        onFocus={() => handleFocus("PO_NUMBER")}
                      />
                      {error.PO_NUMBER && <span className="error">{error.PO_NUMBER}</span>}
                    </div>
                  </div>
                )}
              </div>

            {/* Footer */}
            <div className="av-footer">
              <div className="av-footer-note">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Security Seal ID will be auto-generated
              </div>
              <div className="av-footer-btns">
                <button className="av-cancel-btn" onClick={closeModal}>Cancel</button>
                <button className="av-submit-btn" onClick={handleSubmit}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  Submit & Print Security Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  EmpId: state.loginreducer.details,
});

export default connect(mapStateToProps, { vehicleRegister })(VehicleReport);