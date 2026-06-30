import React, { useEffect, useState } from "react";
import "../../../Stylesheet/Report.scss";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import ReportTable from "../../../Components/ReportTable";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ChangeLog = () => {

  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState("")
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);

  // console.log("selectedRow", selectedRow)


  const openCancelModal = (row) => {
    setSelectedRow(row);
    setIsCancelModalOpen(true);
  };
  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedRow(null);
  };

  const openModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };
  const [vehicleData, setVehicleData] = useState([]);
  const [admin, setAdmin] = useState([]);
  // console.log("admin",admin)


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    // const hours = String(date.getHours()).padStart(2, "0");
    // const minutes = String(date.getMinutes()).padStart(2, "0");
    // console.log("hi time", `${day}-${month}-${year} ${hours}:${minutes}`)
    return `${day}-${month}-${year}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const [day, month, year] = date.toLocaleDateString("en-GB").split("/");
    const [hours, minutes] = date.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }).split(":");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };


  useEffect(() => {
    const persistRoot = localStorage.getItem("persist:root");
    if (persistRoot) {
      try {
        const parsedPersist = JSON.parse(persistRoot);
        const loginReducer = JSON.parse(parsedPersist.loginreducer);
        const isAdmin = loginReducer?.isAdmin;
        setAdmin(isAdmin);
      } catch (error) {
        console.error("Error parsing localStorage", error);
      }
    }
  }, []);  // ← only runs once when the component mounts



  const fetchData = async () => {
    try {
      const response = await axios.get(`https://gateentryapi.rrparkon.net:6008/Entry/GetAllEntry`);
      console.log("response", response.data);
  
      setVehicleData(response.data);
  
      if (response.data) {
        const filteredData = response.data.filter(item =>
          item.OUTWARD_INDICATOR === 1 && (item.Reporting?.[0]?.FLAG !== "3" || item.FLAG === "4")
        );
  
        console.log("filteredData", filteredData);
  
        const formattedData = filteredData.map((item) => ({
          VehicleNumber: item.VEHICLE_NO || "N/A",
          gatePass: item.GATE_ENTRY_NO || "N/A",
          vendorName: item.VENDOR_NAME || "N/A",
          driverName: item.DRIVER_NAME || "N/A",
          driverMobile: item.DRIVER_MOBILE_NO || "N/A",
          date: item.INWARD_DATETIME ? formatDateTime(item.INWARD_DATETIME) : "N/A",
          status:
            item.FLAG === "0"
              ? "Unloading in process"
              : item.FLAG === "1"
                ? "Pending for Unloading"
                : "N/A",
          actions: "View",
          lineItem: item.Entry_Details.length || "N/A",
          outTime: item.OUTWARD_DATETIME ? formatDateTime(item.OUTWARD_DATETIME) : "N/A",
          indicator: item.OUTWARD_INDICATOR || "N/A",
          plant: item.PLANT || "N/A",
          vehicleReportingTime: item.REPORTING_DATETIME ? formatDateTime(item.REPORTING_DATETIME) : "N/A",
          invoiceNumber: item.INVOICE_NO || "--",
          documentDate: item.DOCUMENT_DATE ? formatDate(item.DOCUMENT_DATE) : "N/A",
          vendorId: item.VENDOR_ID || "--",
          modeOfTransport: item.MODE_OF_TRANSPORT || "--",
          roadPermitNumber: item.ROAD_PERMIT_NUMBER || "--",
          lrNo: item.LR_NO || "--",
          lrDate: item.LR_DATE ? formatDate(item.LR_DATE) : "N/A",
          packages: item.PACKAGES || "--",
          lineitemDetails: item.Entry_Details || "--",
          remarks: item.REMARKS || "--",
          vehicleKey: item.VEHICLE_KEY || "--",
          flag: item.FLAG || "--",
        }));
  
        setTableData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  

  const handleChange = async (event) => {
    setData(event.target.value)
  }

  const cancelButton = async (row) => {
    const bodytoSend = {
      REMARK: data
    }
    const apiUrl = `https://gateentryapi.rrparkon.net:6008/Entry/cancelEntry?id=${selectedRow.gatePass}`;
    // console.log("API final call cancel", `https://gateentryapi.rrparkon.net:6008/Entry/cancelEntry?id=${selectedRow.gatePass}`)
    try {
      const response = await axios.post(apiUrl, bodytoSend, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response.status === 200) {
        toast.success(`Entry ${selectedRow.gatePass} Cancelled!`)
        setData("")
        setIsCancelModalOpen(false);
        // navigate('/Reports/ChangeLog')
      }
    }
    catch (err) {
      toast.error("Error while cancelling")
      console.log("error", err)
    }
  }

  // console.log("tableData", tableData)
  useEffect(() => {
    fetchData();
  }, []); // empty dependency array
  

  const handleEdit = async (row) => {
    const apiUrl = `https://gateentryapi.rrparkon.net:6008/Entry/changeIndicator?id=${row.gatePass}&key=${row.vehicleKey}`;
    // console.log(apiUrl);
    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        toast.success(`Entry ${row.gatePass} Exited from Plant!`);
        fetchData();
      } else {
        toast.error(`Failed to update  ${row.gatePass}`);
      }
    } catch (error) {
      console.error("Error updating vehicle flag:", error);
      toast.error("An Error Occured while Exiting the Vehicle.");
    }
  };

  const handleSpecialCase = async (row) => {
    console.log("api ",row.vehicleKey)
    const apiUrl = `https://gateentryapi.rrparkon.net:6008/Entry/changeCancelIndicator?key=${row.vehicleKey}`;
    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        toast.success(`${row.vehicleKey} Exited from Plant!`);
        fetchData();
      } else {
        toast.error(`Failed to update  ${row.vehicleKey}`);
      }
    } catch (error) {
      console.error("Error updating vehicle flag:", error);
      toast.error("An Error Occured while Exiting the Vehicle.");
    }
  }

  const cancelModel = () => {
    setIsCancelModalOpen(false)
    setData("")
  }


  const tableHeaders = [
    { label: "Gate Pass No", dataKey: "gatePass", className: "gate-pass-no" },
    { label: "Vehicle Number", dataKey: "VehicleNumber", className: "td-type" },
    { label: "Vendor Name", dataKey: "vendorName", className: "vendor-name" },
    { label: "In Time", dataKey: "date", className: "entry-date" },
    { label: "lineItem", dataKey: "lineItem", className: "lineItem" },
    { label: "View More", dataKey: "view_more", className: "view_more" },
    ...(admin.includes("1") || admin.includes("2")
      ? [{ label: "Actions", dataKey: "actions", className: "actions" }]
      : [])
  ];


  const modifiedData = tableData.map((row) => ({
    ...row,
    gatePass: (
      <span
        style={{
          padding: "2px 8px",
          borderRadius: "5px",
          backgroundColor: row.gatePass.includes("IW")
            ? "#268AEB"
            : row.gatePass.includes("OW")
              ? "#EC8623"
              : "black",
          color: "white",
          fontWeight: "500",
          fontSize: "0.9rem",
        }}
      >
        {row.gatePass}
      </span>
    ),
    view_more: (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src="../../Images/view_button.png"
          onClick={() => openModal(row)}
          style={{ width: "2.5rem", height: "1.5rem", cursor: "pointer" }}
          alt="View"
        />
      </div>
    ),
    ...(admin.includes("1") || admin.includes("2")
      ? {
        actions: (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            {row.indicator === 1 && row.flag !== "3" ? (
              row.flag == "4" ? (
                <img
                  src="../../Images/outwardd.png"
                  onClick={() => handleSpecialCase(row)}
                  style={{ width: "4rem", height: "1.5rem", cursor: "pointer" }}
                  alt="Outward Special"
                />
              ) : (
                <img
                  src="../../Images/outwardd.png"
                  onClick={() => handleEdit(row)}
                  style={{ width: "4rem", height: "1.5rem", cursor: "pointer" }}
                  alt="Outward"
                />
              )
            ) : (
              <img
                src="../../Images/Disabled_out.png"
                style={{ width: "4rem", height: "1.5rem", cursor: "pointer" }}
                alt="Disabled Outward"
              />
            )}

            {row.flag !== "3" && row.indicator === 1 ? (
              <img
                src="../../Images/cancel.png"
                onClick={() => openCancelModal(row)}
                style={{ width: "4.2rem", height: "1.5rem", cursor: "pointer" }}
                alt="Cancel"
              />
            ) : (
              <img
                src="../../Images/disable_cancel.png"
                style={{ width: "4.2rem", height: "1.5rem", cursor: "pointer" }}
                alt="Disabled Cancel"
              />
            )}
          </div>
        ),
      }
      : {})
  }));




  return (
    <>
      <Header />
      <div>
        <div style={{ fontSize: "15px", fontWeight: "bold", color: "#1897ce", margin: "10px 0px 15px 60px" }}><Link to="/Home" style={{ textDecoration: "none", color: "#1897ce" }}>
          Home
        </Link>{" "} / Change Log</div>
        <div className="table-container">

          <ReportTable
            headers={tableHeaders}
            data={modifiedData}
          />

          {isModalOpen && selectedRow && (
            <div className="modal">
              <div className="modal-content">
                <div className="modal-header">

                  <h3>More Details</h3>
                  <span className="close-modal" onClick={closeModal}>
                    <img src="../../Images/Hover_1.png" alt="close" style={{ height: "1.6rem" }}></img>
                  </span>
                </div>

                <div className="modal-body">
                  <div className="input_fields" style={{ marginBottom: "1.5rem" }}>


                    <div className="top-section">


                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "1rem 0rem", marginBottom: "0rem", width: "23%" }}>
                        <div className="image">
                          <img src="../../Images/Gate_number.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            Gate Entry Number
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.gatePass}
                          </div>
                        </div>

                      </div>
                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "1rem 0rem", marginBottom: "0rem", width: "23%" }}>
                        <div className="image">
                          <img src="../../Images/Remarks.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            Remarks
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.remarks}
                          </div>
                        </div>

                      </div>
                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "1rem 0rem", marginBottom: "0rem", width: "23%" }}>
                        <div className="image">
                          <img src="../../Images/invoice_number.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            Invoice Number
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.invoiceNumber}
                          </div>
                        </div>

                      </div>
                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "1rem 0rem", marginBottom: "0rem", width: "23%" }}>
                        <div className="image">
                          <img src="../../Images/document_date.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            Document Date
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.documentDate}
                          </div>
                        </div>

                      </div>

                    </div>
                    <hr style={{ border: "1px solid #E1E1E1" }} />

                    <div className="top-section">

                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "0rem 0rem", marginBottom: "0rem", width: "23%" }}>
                        <div className="image">
                          <img src="../../Images/Vendor_Details.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            Vendor Id
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.vendorId}
                          </div>
                        </div>

                      </div>
                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "0rem 0rem", marginBottom: "0rem", width: "23%" }}>
                        <div className="image">
                          <img src="../../Images/Driver_Name.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            Driver Name
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.driverName}
                          </div>
                        </div>

                      </div>
                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "0rem 0rem", marginBottom: "0rem", width: "23%" }}>
                        <div className="image">
                          <img src="../../Images/Plant.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            Plant
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.plant}
                          </div>
                        </div>

                      </div>
                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "0rem 0rem", marginBottom: "0rem", width: "23%" }}>
                        <div className="image">
                          <img src="../../Images/mode-of_transport.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            Mode Of Transport
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.modeOfTransport}
                          </div>
                        </div>

                      </div>

                    </div>
                    <hr style={{ border: "1px solid #E1E1E1" }} />

                    <div className="top-section">

                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "0rem 0rem", marginBottom: "0rem", width: "23%" }}>
                        <div className="image">
                          <img src="../../Images/Road_permit.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            Road Permit No.
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.roadPermitNumber}
                          </div>
                        </div>

                      </div>
                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "0rem 0rem", marginBottom: "0rem", width: "23%" }}>
                        <div className="image">
                          <img src="../../Images/Lr_number.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            LR Number
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.lrNo}
                          </div>
                        </div>

                      </div>
                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "0rem 0rem", marginBottom: "0rem", width: "23%" }}>
                        <div className="image">
                          <img src="../../Images/LR_Date.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            LR Date
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.lrDate}
                          </div>
                        </div>

                      </div>
                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "0rem 0rem", marginBottom: "0rem", width: "23%" }}>
                        <div className="image">
                          <img src="../../Images/Packages.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            Packages
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.packages}
                          </div>
                        </div>

                      </div>

                    </div>
                    <hr style={{ border: "1px solid #E1E1E1" }} />
                    <div className="top-section">

                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "0rem 0rem", marginBottom: "0rem", width: "50%" }}>
                        <div className="image">
                          <img src="../../Images/vendor_name.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            Transporter Vendor Name
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.vendorName}
                          </div>
                        </div>

                      </div>
                      <div className="main-div" style={{ background: "#F2F2F2", display: "flex", alignItems: "center", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "0rem 0rem", marginBottom: "0rem", width: "50%" }}>
                        <div className="image">
                          <img src="../../Images/Vehicle_Reporting.png" alt="kamachlao" style={{ height: "2.5rem" }}></img>
                        </div>
                        <div>

                          <div className="Header" style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                            Vehicle Reporting Time
                          </div>
                          <div className="Value" style={{ fontSize: "0.9rem", color: "#848484" }}>
                            {selectedRow.vehicleReportingTime}
                          </div>
                        </div>

                      </div>

                    </div>
                    <hr style={{ border: "1px solid #E1E1E1" }} />

                  </div>

                  <div className="bottom-section" >
                    <table className="bottom-table" style={{ border: "1px solid #E1E1E1", borderRadius: "1rem", padding: "0.4rem 0.6rem ", gap: "1rem", fontFamily: "Inter", paddingRight: "2rem", margin: "0rem 0rem", marginBottom: "0rem", width: "100%" }}>
                      <thead>
                        <tr>
                          <th>Line Item</th>
                          <th>PO Number</th>
                          <th>Material Number</th>
                          <th>Material Desc</th>
                          <th>Unit</th>
                          <th>Pending Quantity</th>
                          <th>Billed Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRow.lineitemDetails.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.LINE_ITEM || "--"}</td>
                            <td>{item?.PO_NO || "--"}</td>
                            <td>{item?.MATERIAL_NO?.trim() || "--"}</td>
                            <td>{item?.MATERIAL_DESC || "--"}</td>
                            <td>{item?.UNIT_DESC || "--"}</td>
                            <td>{item?.PENDING_QTY || "--"}</td>
                            <td>{item?.BILLED_QTY || "--"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCancelModalOpen && (
            <div className="modal" style={{ display: 'block', alignContent: "center", backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
              <style>
                {`
                @keyframes blink {
                    0% { color: red; }
                    50% { color: transparent; }
                    100% { color: red; }
                }
            `}
              </style>
              <div className="modal-dialog" style={{ marginLeft: "25rem" }}>
                <div className="modal-content" style={{ width: "45%", height: "40%", padding: "2.5rem" }}>
                  <div style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "1rem", marginBottom: "0.5rem" }} >Reason For Cancellation??</div>

                  <div>
                    <textarea
                      placeholder="Type Here..."
                      value={data}
                      onChange={handleChange}
                      style={{
                        width: "23rem",
                        height: "10rem",
                        backgroundColor: "#E9F2F9",
                        borderRadius: "1rem",
                        marginBottom: "1rem",
                        border: "none",
                        padding: "0.5rem",
                        resize: "none", // Prevents resizing
                        fontSize: "14px",
                        textAlign: "left", // Ensures left alignment
                        verticalAlign: "top", // Helps position text to the top
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "row-reverse", gap: "1rem" }}>

                    <button
                      style={{
                        width: "6rem",
                        height: "2rem",
                        background: "radial-gradient(circle, #00B8EE, #17A1D4)",
                        justifyContent: "space-between",
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
                        border: "none", borderRadius: "0.5rem", color: "#F0312B", width: "5rem",
                        height: "2rem", borderStyle: "solid", borderColor: "#F0312B", cursor: "pointer"
                      }}
                      onClick={cancelModel}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
      {/* <Footer /> */}
    </>
  );
}

export default ChangeLog