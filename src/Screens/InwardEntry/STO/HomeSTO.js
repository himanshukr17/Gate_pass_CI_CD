import React, { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { StoData } from "../../../redux/action/StoData";
import { connect } from "react-redux";
import { toast } from "react-hot-toast";
 
const HomeSTO = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState({ PO: "" });
  const [error, setError] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [gateEntryDetails, setGateEntryDetails] = useState([]);
  const [gateEntrydata, setGateEntrydata] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null); // Track selected row
  console.log("Selected Entries", selectedEntry);
 
console.log("gateEntryDetails",gateEntryDetails)
  const setValue = (val) => {
    setData({ ...data, ...val });
  };
 
  const handleSubmit = () => {
    let hasErr = false;
    let err = { PO: null };

    if (!data.PO.trim()) {
        hasErr = true;
        err.PO = "This field is mandatory";
        toast.error("Please enter Bill number");
    }

    setError(err);

    if (!hasErr) {
        props
            .StoData({ po: data.PO })
            .then((response) => {
                if (response.status === 200) {
                  console.log("response",response)
                    const gateEntries = response.data[0]?.GateEntryDetails || [];

                    if (gateEntries.length === 0) {
                        toast.error("NO GATE ENTRY FOUND");
                        return; // Stop further execution
                    }

                    setGateEntryDetails(gateEntries);
                    setGateEntrydata(response.data);
                    setModalOpen(true); // Open modal
                }
            })
            .catch(() => {
                toast.error("Please enter a valid Bill number");
            });
    }
};

 
  const handleConfirm = () => {
    setModalOpen(false);
    navigate("/Inward/STO/DetailSTO", { state: { SelectedGateEntry: selectedEntry, GateEntrydata: gateEntrydata } });
  };
 
  return (
    <>
      <div className="poMain">
        <div className="poLogin">
          <div className="rightdiv">
            <img src="../Images/inwardLogin.png" alt="Logo" style={{ width: "100%", height: "100%", marginLeft: 20 }} />
          </div>
 
          <div className="rightdiv">
            <div className="rightIcon">
              <div>
                <h1 className="h2">Inward Gate Entry</h1>
                <h2 className="h3">Against STO Invoice</h2>
              </div>
 
              <div className="closeIcon">
                <IconContext.Provider value={{ color: "#f10f0f", size: "20px" }}>
                  <AiOutlineCloseCircle type="button" onClick={() => navigate("/Home")} />
                </IconContext.Provider>
              </div>
            </div>
 
            <div className="inputsSTO">
              <div className="grid-container">
                <p className="Stoheading">Bill Number</p>
                <input
                  type="text"
                  placeholder="Please enter Bill Number"
                  style={{ padding: 10 }}
                  onChange={(e) => setValue({ PO: e.target.value })}
                />
                {error.PO && <span className="error">{error.PO}</span>}
              </div>
 
              <button className="loginBtn" onClick={handleSubmit}>
                Proceed
              </button>
            </div>
          </div>
        </div>
 
        <div className="footerStyle">
          <p className="footerText">Powered by</p>
          <img src="../Images/Picture1.png" alt="Logo" className="footerlogo" />
        </div>
      </div>
 
      {/* Custom Modal with Inline CSS */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "50%",
              textAlign: "center",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h2>Gate Entry Details</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Gate Entry No</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Vehicle No</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Driver Name</th>
                </tr>
              </thead>
              <tbody>
                {gateEntryDetails.length > 0 ? (
                  gateEntryDetails.map((entry, index) => (
                    <tr key={index}  
                    style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        background: selectedEntry == entry ? "#d1e7dd" : "white",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedEntry(entry)}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.GATE_ENTRY_NO}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.VEHICLE_NO}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.DRIVER_NAME}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
 
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button
                style={{
                  padding: "10px 20px",
                  background: "#ccc",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
 
export default connect(null, { StoData })(HomeSTO);
 
 