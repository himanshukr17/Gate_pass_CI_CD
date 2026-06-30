import React, { useEffect, useState, useRef } from "react";
import "../../../Stylesheet/Report.scss";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import ReportTable from "../../../Components/ReportTable";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import html2pdf from "html2pdf.js"

const Table = () => {

  const [tableData, setTableData] = useState([]);
  // console.log("tableData state", tableData)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [details, setDetails] = useState(false);
  const [csvData, setCsvData] = useState([]);

  // Generate CSV data: Each line item gets its own row with repeated main data
  useEffect(() => {
    if (!tableData || tableData.length === 0) {
      setCsvData([]);
      return;
    }

    const flattened = [];

    tableData.forEach((entry) => {
      console.log("entry data", entry)
      // Ensure lineitemDetails is an array; fallback to empty array if not
      const lineItems = Array.isArray(entry.lineitemDetails) ? entry.lineitemDetails : [];
      const status =
        entry.flag == 3
          ? "Cancelled"
          : entry.Reporting?.[0]?.FLAG === "0"
            ? "Unloading in process"
            : entry.Reporting?.[0]?.FLAG === "1"
              ? "Pending for Unloading"
              : "Completed";

      if (lineItems.length === 0) {

        flattened.push({
          "Gate Entry No": entry?.gatePass?.props?.children || entry?.gatePass || "--",
          "Reporting Date": entry?.vehicleReportingTime || "--",
          "Inward Date": entry?.date || "--",
          "Invoice No": entry?.invoiceNumber || "--",
          "Document Date": entry?.documentDate || "--",
          "Vendor Name": entry?.vendorName || "--",
          "Vendor ID": entry?.vendorId || "--",
          "Mode of Transport": entry?.modeOfTransport || "--",
          "Vehicle No": entry?.VehicleNumber || "--",
          "Driver Name": entry?.driverName || "--",
          "Mobile Number": entry?.driverMobile || "--",
          "Road Permit No": entry?.roadPermitNumber || "--",
          "Plant": entry?.plant || "--",
          "LR No": entry?.lrNo || "--",
          "LR Date": entry?.lrDate || "--",
          "Packages": entry?.packages || "--",
          "Outward Date": entry?.outTime || "--",
          "Process End Time": entry?.inwardTime || "--",
          "Process Start time": entry?.startTime || "--",
          "Line Item": "--",
          "PO Number": "--",
          "Material Number": "--",
          "Material Description": "--",
          "Unit": "--",
          "Pending Quantity": "--",
          "Billed Quantity": "--",
          "Status": status || "--",
          "Po Approval Time": entry?.flagUpdation || "--",
        });
      } else {
        lineItems.forEach((item) => {
          const status =
            entry.flag == 3
              ? "Cancelled"
              : entry.Reporting?.[0]?.FLAG === "0"
                ? "Unloading in process"
                : entry.Reporting?.[0]?.FLAG === "1"
                  ? "Pending for Unloading"
                  : "Completed";

          console.log("inside else=")

          flattened.push({
            "Gate Entry No": entry.gatePass?.props?.children || entry.gatePass,
            "Reporting Date": entry.vehicleReportingTime,
            "Inward Date": entry.date,
            "Invoice No": entry.invoiceNumber,
            "Document Date": entry.documentDate,
            "Vendor Name": entry.vendorName,
            "Vendor ID": entry.vendorId,
            "Mode of Transport": entry.modeOfTransport,
            "Vehicle No": entry.VehicleNumber,
            "Driver Name": entry.driverName,
            "Mobile Number": entry.driverMobile,
            "Road Permit No": entry.roadPermitNumber,
            "Plant": entry.plant,
            "LR No": entry.lrNo,
            "LR Date": entry.lrDate,
            "Packages": entry.packages,
            "Line Item": item.LINE_ITEM || "--",
            "PO Number": item.PO_NO || "--",
            "Material Number": item.MATERIAL_NO || "--",
            "Material Description": item.MATERIAL_DESC || "--",
            "Unit": item.UNIT_DESC || "--",
            "Outward Date": entry.outTime,
            "Process End Time": entry.inwardTime,
            "Pending Quantity": item.PENDING_QTY || "--",
            "Billed Quantity": item.BILLED_QTY || "--",
            "Process Start time": entry.startTime || "--",
            "Status": status,
            "Po Approval Time": entry?.flagUpdation || "--",
          });
        });
      }
    });

    setCsvData(flattened);
    console.log("Generated csvData:", flattened);
  }, [tableData]);

  // Define CSV headers based on csvData
  const csvHeaders =
    csvData.length > 0
      ? Object.keys(csvData[0]).map((key) => ({
        label: key,
        key: key,
      }))
      : [];

  // console.log("selectedRow", selectedRow)
  const openModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const contentRef = useRef();

  const handleDownloadPDF = () => {
    const element = contentRef.current;

    const opt = {
      margin: 5, // reduced margin (in mm)
      filename: 'More_Details.pdf',
      image: { type: 'jpeg', quality: 0.9 }, // slightly lower quality to reduce size
      html2canvas: { scale: 1.5 }, // lower than 2 for better fitting
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };


  const [vehicleData, setVehicleData] = useState([]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    // console.log("hi time", `${day}-${month}-${year} ${hours}:${minutes}`)
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
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

  const fetchData = async () => {
    try {
      // console.log("api--->", `https://gateentryapi.rrparkon.net:6008/Entry/GetAllEntry`);
      const response = await axios.get(`https://gateentryapi.rrparkon.net:6008/Entry/GetAllEntry`);
      console.log("response", response.data);

      if (response.status === 200) {
        if (!Array.isArray(response.data)) {
          console.error("Unexpected API response format:", response.data);
          return;
        }

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
                item.Reporting?.[0]?.MODE == "1"  // Loading mode
                  ? (item.Reporting?.[0]?.FLAG == "0"
                    ? "Loading in process"
                    : item.Reporting?.[0]?.FLAG == "1"
                      ? "Pending for Loading"
                      : "Completed")
                  : (item.Reporting?.[0]?.MODE == "0"   // Unloading mode
                    ? (item.Reporting?.[0]?.FLAG == "0"
                      ? "Unloading in process"
                      : item.Reporting?.[0]?.FLAG == "1"
                        ? "Pending for Unloading"
                        : "Completed")
                    : // Fallback if MODE missing: keep old behavior
                    (item.Reporting?.[0]?.FLAG == "0"
                      ? "Unloading in process"
                      : item.Reporting?.[0]?.FLAG == "1"
                        ? "Pending for Unloading"
                        : "Completed"))
          ,
          actions: "View",
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
          lineitemDetails: item.Entry_Details ?? "--",
          remarks: item.REMARKS ?? "--",
          inwardTime: item.INWARD_CREATION_TIME ? formatDateTime(item.INWARD_CREATION_TIME) : "--",
          startTime: item.Reporting?.[0]?.START_TIME ? formatDateTime(item.Reporting?.[0]?.START_TIME) : "--",
          flag: item.FLAG ?? "--",
          flagUpdation: item.FLAG_UPDATION ? formatDateTime(item.FLAG_UPDATION) : "--",
        }));

        // console.log("formattedData:", formattedData);
        setTableData(formattedData);
      } else {
        console.error("Invalid response format!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Use effect to check if tableData updates properly
  useEffect(() => {
    // console.log("Updated tableData:", tableData);
  }, [tableData]);


  const tableHeaders = [
    { label: "Gate Pass No", dataKey: "gatePass", className: "gate-pass-no" },
    { label: "Vehicle Number", dataKey: "VehicleNumber", className: "td-type" },
    { label: "Vendor Name", dataKey: "vendorName", className: "vendor-name" },
    { label: "Vehicle Reporting Time", dataKey: "vehicleReportingTime", className: "entry-date" },
    { label: "Vehicle Out Time", dataKey: "outTime", className: "out-Time" },
    { label: "Status", dataKey: "status", className: "status" },
    { label: "Line Item", dataKey: "lineItem", className: "line-item" },
    { label: "View More", dataKey: "actions", className: "actions" },
  ];

  const modifiedData = tableData.map((row) => ({
    ...row,
    gatePass: (
      <span
        style={{
          padding: "2px 8px",
          borderRadius: "5px",
          backgroundColor: row.gatePass.includes("IW") ? "#268AEB" : row.gatePass.includes("OW") ? "#EC8623" : "black",
          color: "white",
          fontWeight: "500",
          fontSize: "0.9rem",
        }}
      >
        {row.gatePass}
      </span>
    ),
    actions: (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src="../../Images/view_button.png"
          onClick={() => openModal(row)}
          style={{ width: "2.5rem", height: "1.5rem", cursor: "pointer" }}
        />
      </div>
    ),
  }));

  console.log("Modified data", modifiedData)


  return (
    <>
      <Header />
      <div>
        <div style={{ fontSize: "15px", fontWeight: "bold", color: "#1897ce", margin: "10px 0px 15px 60px" }}>
          <Link to="/Home" style={{ textDecoration: "none", color: "#1897ce" }}>
            Home
          </Link>{" "} / Gate Pass Register
        </div>
        <div className="table-container">

          <ReportTable
            headers={tableHeaders}
            data={modifiedData}
            csvButtonComponent={
              csvData.length > 0 ? (
                <CSVLink
                  data={csvData}
                  headers={csvHeaders}
                  filename="gatepass-report.csv"
                  onClick={() => {
                    console.log("CSV download initiated, csvData:", csvData);
                    return true;
                  }}
                >
                  <img
                    src="../../Images/CSV.png"
                    style={{ height: "5vh", width: "6vh", padding: "0 10px" }}
                    alt="Download CSV"
                  />
                </CSVLink>
              ) : (
                <img
                  src="../../Images/CSV.png"
                  style={{ height: "5vh", width: "6vh", padding: "0 10px", opacity: 0.5 }}
                  alt="No data to download"
                  title="No data available"
                  onClick={() => toast.info("No data available to download")}
                />
              )}
          />

          {isModalOpen && selectedRow && (
            <div className="modal">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header" style={{ marginBottom: "1rem" }}>
                  <h3>More Details</h3>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {/* Download PDF Button */}
                    <button
                      onClick={handleDownloadPDF}
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "0.4rem 0.8rem",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      Download PDF
                    </button>

                    {/* Close Modal Button */}
                    <span className="close-modal" onClick={closeModal}>
                      <img
                        src="../../Images/Hover_1.png"
                        alt="close"
                        style={{ height: "1.6rem" }}
                      />
                    </span>
                  </div>
                </div>

                {/* Modal Body (Downloadable Content) */}
                <div ref={contentRef} className="modal-body">
                  <div className="input_fields">
                    {/* First Section */}
                    <div style={{ display: "flex", gap: "20px" }}>
                      {[
                        { img: "../../Images/Gate_number.png", label: "Gate Entry Number", value: selectedRow.gatePass },
                        { img: "../../Images/Remarks.png", label: "Remarks", value: selectedRow.remarks },
                        { img: "../../Images/invoice_number.png", label: "Invoice Number", value: selectedRow.invoiceNumber },
                        { img: "../../Images/document_date.png", label: "Document Date", value: selectedRow.documentDate },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="main-div"
                          style={{
                            background: "#F2F2F2",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "1rem",
                            padding: "0.4rem 0.6rem",
                            gap: "1rem",
                            fontFamily: "Inter",
                            // margin: "0.5rem 0",
                            width: "23%",
                          }}
                        >
                          <div className="image">
                            <img src={item.img} alt="icon" style={{ height: "2.5rem" }} />
                          </div>
                          <div>
                            <div style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#848484" }}>
                              {item.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr style={{ border: "1px solid #E1E1E1" }} />

                    {/* Second Section */}
                    <div style={{ display: "flex", gap: "20px" }}>
                      {[
                        { img: "../../Images/Vendor_Details.png", label: "Vendor Id", value: selectedRow.vendorId },
                        { img: "../../Images/Driver_Name.png", label: "Driver Name", value: selectedRow.driverName },
                        { img: "../../Images/Plant.png", label: "Plant", value: selectedRow.plant },
                        { img: "../../Images/mode-of_transport.png", label: "Mode Of Transport", value: selectedRow.modeOfTransport },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="main-div"
                          style={{
                            background: "#F2F2F2",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "1rem",
                            padding: "0.4rem 0.6rem",
                            gap: "1rem",
                            fontFamily: "Inter",
                            // margin: "1rem 0",
                            width: "23%",
                          }}
                        >
                          <div className="image">
                            <img src={item.img} alt="icon" style={{ height: "2.5rem" }} />
                          </div>
                          <div>
                            <div style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#848484" }}>
                              {item.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr style={{ border: "1px solid #E1E1E1" }} />

                    {/* Third Section */}
                    <div style={{ display: "flex", gap: "20px" }}>
                      {[
                        { img: "../../Images/Road_permit.png", label: "Road Permit No.", value: selectedRow.roadPermitNumber },
                        { img: "../../Images/Lr_number.png", label: "LR Number", value: selectedRow.lrNo },
                        { img: "../../Images/LR_Date.png", label: "LR Date", value: selectedRow.lrDate },
                        { img: "../../Images/Packages.png", label: "Packages", value: selectedRow.packages },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="main-div"
                          style={{
                            background: "#F2F2F2",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "1rem",
                            padding: "0.4rem 0.6rem",
                            gap: "1rem",
                            fontFamily: "Inter",
                            // margin: "1rem 0",
                            width: "23%",
                          }}
                        >
                          <div className="image">
                            <img src={item.img} alt="icon" style={{ height: "2.5rem" }} />
                          </div>
                          <div>
                            <div style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#848484" }}>
                              {item.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr style={{ border: "1px solid #E1E1E1" }} />

                    {/* Fourth Section */}
                    <div style={{ display: "flex", gap: "20px" }}>
                      {[
                        { img: "../../Images/vendor_name.png", label: "Transporter Vendor Name", value: selectedRow.vendorName },
                        { img: "../../Images/Vehicle_Reporting.png", label: "Vehicle Reporting Time", value: selectedRow.vehicleReportingTime },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="main-div"
                          style={{
                            background: "#F2F2F2",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "1rem",
                            padding: "0.4rem 0.6rem",
                            gap: "1rem",
                            fontFamily: "Inter",
                            // margin: "1rem 0",
                            width: "48%",
                          }}
                        >
                          <div className="image">
                            <img src={item.img} alt="icon" style={{ height: "2.5rem" }} />
                          </div>
                          <div>
                            <div style={{ marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#848484" }}>
                              {item.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr style={{ border: "1px solid #E1E1E1" }} />
                  </div>

                  {/* Table Section */}
                  <div className="bottom-section">
                    <table
                      className="bottom-table"
                      style={{
                        border: "1px solid #E1E1E1",
                        borderRadius: "1rem",
                        padding: "0.4rem 0.6rem",
                        gap: "1rem",
                        fontFamily: "Inter",
                        width: "100%",
                      }}
                    >
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
                            <td>{item.LINE_ITEM}</td>
                            <td>{item.PO_NO}</td>
                            <td>{item.MATERIAL_NO}</td>
                            <td>{item.MATERIAL_DESC}</td>
                            <td>{item.UNIT_DESC || "--"}</td>
                            <td>{item.PENDING_QTY}</td>
                            <td>{item.BILLED_QTY}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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


export default Table;
