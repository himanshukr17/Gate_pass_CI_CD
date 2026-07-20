import React, { useEffect, useState } from "react";
import "../../Stylesheet/Details.scss";
import "../../Stylesheet/Report.scss";
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
        `http://localhost:3045/Vehicle/getVehicleById?id=${details}`
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
    const apiUrl = `http://localhost:3045/Vehicle/ChangeFlag?VEHICLE_NO=${row.vehicaleNo}&FLAG=0&MODE=${row.mode}`;
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

  return (
    <>
      <Header />
      <div
        className="path"
        style={{
          fontSize: "15px",
          fontWeight: "bold",
          color: "#1897ce",
          margin: "5px 0px 0px 60px",
        }}
      >
        <Link to="/Home" style={{ textDecoration: "none", color: "#1897ce" }}>
          Home
        </Link>{" "}
        / Vehicle Report
      </div>

      <div style={{ padding: "15px" }}>
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

        <ReportTable
          headers={tableHeaders}
          data={modifiedData}
          buttonComponent={
            !admin.includes("3") ? (
              <button
                className="feildBtn"
                onClick={openModal}
                style={{
                  width: "15rem",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  padding: "8px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                + Add Vehicle Details
              </button>
            ) : null
          }
        />
      </div>

      {isModalOpen && (
        <div
          className="custom-modal-overlay"
          style={{
            position: "fixed",
            top: "0%",
            left: "0%",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
        >
          <div
            className="custom-modal"
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "0px 0px 30px 0px",
              width: "50%",
              height: "90%",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #198BC6 10%,rgb(18, 89, 125) 100%)",
                padding: "10px",
                color: "white",
                borderRadius: "5px 5px 0px 0px",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: "1.0rem" }}>
                Add Vehicle Details
                <button
                  onClick={closeModal}
                  style={{
                    backgroundColor: "transparent",
                    color: "red",
                    border: "none",
                    padding: "2px 5px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    position: "absolute",
                    top: "2px",
                    right: "10px",
                    fontSize: "2rem",
                  }}
                >
                  ×
                </button>
              </span>
            </div>
            <div
              className="InputBox3"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
              }}
            >
              <div className="inner">
                <div className="grid-container">
                  <div className="inputFeildDesign">
                    <p>Vehicle Number*</p>
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

                  <div className="inputFeildDesign">
                    <p>Name of Driver*</p>
                    <input
                      type="text"
                      placeholder="Please enter Driver Name"
                      required
                      onChange={(text) => (
                        setValue({ DRIVER_NAME: text.target.value }),
                        seterror({ ...error, DRIVER_NAME: "" })
                      )}
                      style={{
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "1px solid black",
                        ...inputStyle,
                        ...(isFocused.DRIVER_NAME ? focusStyle : {}),
                      }}
                      onFocus={() => handleFocus("DRIVER_NAME")}
                      onBlur={() => handleBlur("DRIVER_NAME")}
                    />
                    {error.NAME && <span className="error">{error.NAME}</span>}
                  </div>
                </div>

                <div className="grid-container">
                  <div className="inputFeildDesign">
                    <p htmlFor="mobileNumber">Driver Mobile Number*</p>
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
                      style={{
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "1px solid black",
                        ...inputStyle,
                        ...(isFocused.DRIVER_MOBILE_NO ? focusStyle : {}),
                      }}
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

                  <div className="inputFeildDesign">
                    <p>Mode of Transport*</p>
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

                <div className="grid-container">
                  <div className="inputFeildDesign">
                    <p>Vehicle Category*</p>
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

                  <div className="inputFeildDesign">
                    <p>EWay Bill No.</p>
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
                      style={{
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "1px solid black",
                        ...inputStyle,
                        ...(isFocused.ROAD_PERMIT_NUMBER ? focusStyle : {}),
                      }}
                      onFocus={() => handleFocus("ROAD_PERMIT_NUMBER")}
                      onBlur={() => handleBlur("ROAD_PERMIT_NUMBER")}
                    />
                    {error.PERMIT && <span className="error">{error.PERMIT}</span>}
                  </div>
                </div>

                <div className="grid-container">
                  <div className="inputFeildDesign">
                    <p>Plant*</p>
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

                  <div className="inputFeildDesign">
                    <p>LR Number</p>
                    <input
                      type="text"
                      onChange={(text) => (
                        setValue({ LR_NO: text.target.value }),
                        seterror({ ...error, LR_NO: "" })
                      )}
                      placeholder="Please enter LR Number"
                      style={{
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "1px solid black",
                        ...inputStyle,
                        ...(isFocused.LR_NO ? focusStyle : {}),
                      }}
                      onFocus={() => handleFocus("LR_NO")}
                      onBlur={() => handleBlur("LR_NO")}
                    />
                    {error.LR_NO && <span className="error">{error.LR_NO}</span>}
                  </div>
                </div>

                <div className="grid-container">
                  <div className="inputFeildDesign">
                    <p>LR Date</p>
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
                      style={{
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "1px solid black",
                        ...inputStyle,
                        ...(isFocused.LR_DATE ? focusStyle : {}),
                      }}
                      onFocus={() => handleFocus("LR_DATE")}
                      onBlur={() => handleBlur("LR_DATE")}
                    />
                    {error.LR_DATE && (
                      <span className="error">{error.LR_DATE}</span>
                    )}
                  </div>
                  <div className="inputFeildDesign">
                    <p>Type of Entry*</p>
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
                    <div className="inputFeildDesign" style={{ maxWidth: '50%' }}>
                      <p>PO Number*</p>
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
                        style={{
                          borderTop: "none",
                          borderLeft: "none",
                          borderRight: "none",
                          borderBottom: "1px solid black",
                          ...inputStyle,
                          ...(isFocused.PO_NUMBER ? focusStyle : {}),
                        }}
                        onFocus={() => handleFocus("PO_NUMBER")}
                      />
                      {error.PO_NUMBER && <span className="error">{error.PO_NUMBER}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ textAlign: "right", padding: "10px" }}>
              <button
                type="submit"
                className="feildBtn"
                onClick={handleSubmit}
                style={{
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  EmpId: state.loginreducer.details,
});

export default connect(mapStateToProps, { vehicleRegister })(VehicleReport);