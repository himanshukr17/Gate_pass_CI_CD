import axios from "axios";
import React, { useEffect, useState } from "react";
import ReportTable from "../../../Components/ReportTable";
import Header from "../../../Components/Header";
import { Link } from "react-router-dom";

const apiURL = process.env.REACT_APP_API_URL


const UserReport = () => {

  const [data, setData] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);


  const userReportData = async () => {
    try {
      console.log("Api call")
      const res = await axios.get(`${apiURL}/Employee/getAllUser`)
      console.log("Api call Response:", res.data)

      if (res.data && Array.isArray(res.data)) {
        const roleMapping = {
          1: "Security",
          2: "Admin",
          3: "Plant",
          4: "Reviewer"
        };
        const formattedData = res.data.map((item) => ({
          empId: item.EMPLOYEE_ID || "N/A",
          empName: item.EMPLOYEE_NAME || "N/A",
          status: item.FLAG == "1" ? "Active" : "InActive",
          plant: item.PLANT && Array.isArray(item.PLANT)
            ? item.PLANT.map(plant => `${plant.PLANT_ID} - ${plant.PLANT_NAME}`).join(", ")
            : "N/A",
          email: item.EMAIL || "N/A",
          mobile: item.MOBILE || "N/A",
          password:item.PASSWORD || "N/A",
          role: Array.isArray(item.ISADMIN)
            ? item.ISADMIN.map(id => roleMapping[id] || "Unknown")
            : []
        }));
        setData(formattedData);
      } else {
        console.error("API response is not an array:", res.data);
        setData([]);
      }
    } catch (error) {
      console.error("Error while fetching API", error);
      setData([]);
    }
  };

  useEffect(() => {
    console.log("Component mounted, calling userReportData");
    userReportData();
  }, []);

  console.log("data", data)


  const TableHeaders = [
    {
      label: (
        <input
          type="checkbox"
          checked={selectedRows.length === data.length && data.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(data.map((row) => row.empId));
            } else {
              setSelectedRows([]);
            }
          }}
        />
      ),
      dataKey: "checkbox",
      className: "td-type",
    },
    { label: "Emp ID", dataKey: "empId", className: "td-type" },
    { label: "Emp Name", dataKey: "empName", className: "td-type" },
    { label: "Mobile", dataKey: "mobile", className: "lineItem" },
    { label: "Email", dataKey: "email", className: "entry-date" },
    { label: "Role", dataKey: "role", className: "lineItem" },
    { label: "Password", dataKey: "password", className: "vendor-name" },
    { label: "Plant", dataKey: "plant", className: "lineItem" },
    { label: "Status", dataKey: "status", className: "vendor-name" },
  ];

  const modifiedData = data.map((row) => {
    const isChecked = selectedRows.includes(row.empId);
    return {
      checkbox: (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows([...selectedRows, row.empId]);
            } else {
              setSelectedRows(selectedRows.filter((id) => id !== row.empId));
            }
          }}
        />
      ),
      ...row,
      status: (
        <span
          style={{
            backgroundColor: row.status === "Active" ? "#b9f7c2" : "#f7b9b9",
            color: "#000",
            padding: "4px 8px",
            borderRadius: "5px",
            fontSize: "0.85rem",
            fontWeight: "500",
            display: "inline-block",
            width: "fit-content",
          }}
        >
          {row.status}
        </span>
      ),
      plant: row.plant ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginLeft: "20%" }}>
          {row.plant.split(", ").map((plant, index) => (
            <span key={index} style={{
              backgroundColor: "#b9dcf7",
              color: "#000",
              padding: "4px 8px",
              borderRadius: "5px",
              fontSize: "0.85rem",
              fontWeight: "500",
              display: "inline-block",
              width: "fit-content",
            }}>
              {plant}
            </span>
          ))}
        </div>
      ) : "N/A",
      role: row.role && Array.isArray(row.role) ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginLeft: "20%" }}>
          {row.role.map((role, index) => (
            <span key={index} style={{
              backgroundColor: "#f7e1b9",
              color: "#000",
              padding: "4px 8px",
              borderRadius: "5px",
              fontSize: "0.85rem",
              fontWeight: "500",
              display: "inline-block",
              width: "fit-content",
            }}>
              {role}
            </span>
          ))}
        </div>
      ) : "N/A",
    };
  });


  const handleStatusChange = async (flagValue) => {
    try {
      if (selectedRows.length === 0) {
        alert("Please select at least one user.");
        return;
      }

      await Promise.all(
        selectedRows.map(empId =>
          axios.post(`${apiURL}/Employee/changeFlag`, {
            ID: empId,
            FLAG: flagValue
          })
        )
      );

      alert("Status updated successfully.");
      userReportData();
      setSelectedRows([]);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };



  return (
    <>
      <Header />
      <div style={{ fontSize: "15px", fontWeight: "bold", color: "#1897ce", margin: "10px 0px 15px 60px" }}>
        <Link to="/Home" style={{ textDecoration: "none", color: "#1897ce" }}>
          Home
        </Link>{" "} / User List

      </div>
      <ReportTable headers={TableHeaders} data={modifiedData} buttonComponent={
        <div
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
          style={{ position: "relative", display: "inline-block" }}
        >
          <button
            className="fieldBtn"
            style={{
              width: "5rem",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              padding: "8px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Action
          </button>

          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                backgroundColor: "white",
                border: "1px solid #ddd",
                padding: "10px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                zIndex: 100,
                minWidth: "120px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <button
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => handleStatusChange("1")}

                onMouseEnter={(e) => (e.target.style.backgroundColor = "#218838")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#28a745")}
              >
                Activate
              </button>
              <button
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => handleStatusChange("0")}

                onMouseEnter={(e) => (e.target.style.backgroundColor = "#c82333")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc3545")}
              >
                Deactivate
              </button>
            </div>
          )}
        </div>
      } />
    </>
  )
}

export default UserReport;