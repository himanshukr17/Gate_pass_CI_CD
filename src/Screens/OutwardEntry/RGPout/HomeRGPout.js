import React, { useEffect, useState } from 'react'
import '../../../Stylesheet/Details.scss'
import Footer from '../../../Components/Footer'
import Header from '../../../Components/Header'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getVehicleDetails } from '../../../redux/action/Entry';
import { connect } from 'react-redux';
import toast from 'react-hot-toast';
import moment from 'moment';
import axios from 'axios';

const apiURL = process.env.REACT_APP_API_URL


function formatToLocalDateTimeInput(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function HomeWithoutPO(props) {

  const navigate = useNavigate();
  const location = useLocation();
  const podata = location.state;
  const [selectedFile, setSelectedFile] = useState([]);
  const [details, setDetails] = useState([]);

  const [data, setdata] = useState({
    INVOICE: "",
    DOCDATE: "",
    DRIVERNAME: "",
    MOBILE: "",
    MOT: "",
    VEHICLENO: "",
    VEHCAT: "",
    ROADPERMIT: "",
    LR: "",
    LRDATE: "",
    PACKAGES: "",
    VEHICLEREPDATE: "",
    ATTACHMENT: '',
    VEHICLE_KEY: ''
  });

  const vData = props?.VehicleInfo;

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Emp ID (dropdown depends on this) ---
  const [empId, setEmpId] = useState(null);

  // --- Vehicle dropdown data ---
  const [vehicleList, setVehicleList] = useState([]);       // just the VEHICLE_NO strings, for the <select>
  const [vehicleFullData, setVehicleFullData] = useState([]); // full records returned by the API
  const [selectedVehicle, setSelectedVehicle] = useState(null); // the matched full record for the current VEHICLENO

  // --- Read emp ID from localStorage (same pattern used elsewhere in the app) ---
  useEffect(() => {
    const persistRoot = localStorage.getItem("persist:root");
    if (persistRoot) {
      try {
        const parsedPersist = JSON.parse(persistRoot);
        const loginReducer = JSON.parse(parsedPersist.loginreducer);
        setDetails(loginReducer.details);
        setEmpId(loginReducer.details); // e.g. "RRP0001"
      } catch (error) {
        console.error("Error parsing persist:root data:", error);
      }
    }
  }, []);

  // --- Fetch vehicles for this emp, once empId is available ---
  useEffect(() => {
    if (!empId) return;

    const fetchVehiclesByEmp = async () => {
      try {
        const response = await axios.get(
          `${apiURL}Vehicle/getVehicleByEmpOutward?id=${empId}`
        );

        // Filter out cancelled vehicles, if present
        const activeVehicles = (response.data || []).filter(
          (v) => v.IS_CANCELLED !== 1
        );

        setVehicleFullData(activeVehicles);
        setVehicleList(activeVehicles.map((v) => v.VEHICLE_NO));
        setLoading(false);
      } catch (err) {
        setErrors(err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchVehiclesByEmp();
  }, [empId]);

  // --- When a vehicle is selected from the dropdown, find its full record ---
  // (mirrors DetailPO's separate "fetch vehicle by VEHICLENO" step, but since
  // getVehicleByEmpOutward already returns full records in one call, this is
  // a local lookup instead of a second network request.)
  useEffect(() => {
    if (!data.VEHICLENO || vehicleFullData.length === 0) {
      setSelectedVehicle(null);
      return;
    }

    const matched = vehicleFullData.find(
      (v) => v.VEHICLE_NO?.toLowerCase() === data.VEHICLENO?.toLowerCase()
    );

    setSelectedVehicle(matched || null);
  }, [data.VEHICLENO, vehicleFullData]);

  // --- Autofill the form when selectedVehicle changes (same pattern as DetailPO) ---
  useEffect(() => {
    if (!selectedVehicle) return;

    const newData = {
      DRIVERNAME: selectedVehicle.DRIVER_NAME || data.DRIVERNAME,
      MOT: selectedVehicle.MODE_OF_TRANSPORT || data.MOT,
      VEHCAT: selectedVehicle.VEHICLE_CATEGORY || data.VEHCAT,
      ROADPERMIT: selectedVehicle.ROAD_PERMIT_NUMBER || data.ROADPERMIT,
      LR: selectedVehicle.LR_NO || data.LR,
      LRDATE: selectedVehicle.LR_DATE
        ? moment(selectedVehicle.LR_DATE).format("YYYY-MM-DD")
        : data.LRDATE,
      MOBILE: selectedVehicle.DRIVER_MOBILE_NO || data.MOBILE,
     VEHICLEREPDATE: selectedVehicle.VEHICLE_REPORTING_TIME
        ? formatToLocalDateTimeInput(selectedVehicle.VEHICLE_REPORTING_TIME)
        : data.VEHICLEREPDATE,
      VEHICLE_KEY: selectedVehicle.VEHICLE_KEY || data.VEHICLE_KEY,
    };

    // Update state only if the new data differs from the existing state
    if (
      data.DRIVERNAME !== newData.DRIVERNAME ||
      data.MOT !== newData.MOT ||
      data.VEHCAT !== newData.VEHCAT ||
      data.ROADPERMIT !== newData.ROADPERMIT ||
      data.LR !== newData.LR ||
      data.LRDATE !== newData.LRDATE ||
      data.MOBILE !== newData.MOBILE ||
      data.VEHICLEREPDATE !== newData.VEHICLEREPDATE
    ) {
      setdata((prev) => ({
        ...prev,
        ...newData,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicle]);

  const [error, seterror] = useState({});
  const [motList, setMotList] = useState([{ name: "", id: "" }]);
  const [vcatList, setVcat] = useState([{ name: "", id: "" }]);
  const [motName, setMotName] = useState();
  const [vcatName, setVcatName] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${apiURL}Employee/mot`);
      const response1 = await fetch(`${apiURL}Employee/vehicle_category`);
      const newData = await response.json();
      setMotList(newData);
      const newData1 = await response1.json();
      setVcat(newData1);
    };
    fetchData();
  }, []);

  const handleFileChange = (event) => {
    const file = Array.from(event.target.files);
    setSelectedFile((prevFiles) => [...prevFiles, ...file]);
    setdata((prevData) => ({
      ...prevData,
      ATTACHMENT: file,
    }));
  };

  const handlePreview = (file) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  const removeFile = (index) => {
    setSelectedFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const setValue = (val) => {
    setdata({ ...data, ...val });
  };

  const handleChange = (event) => {
    setMotName(event.target.value);
    setValue({ MOT: event.target.value });
  };

  const handleChangeVcat = (event) => {
    setVcatName(event.target.value);
    setValue({ VEHCAT: event.target.value });
  };

  const handleSubmit = () => {
    let hasErr = false;

    let require = [
      "INVOICE",
      "DOCDATE",
      "DRIVERNAME",
      "MOBILE",
      "MOT",
      "VEHICLENO",
      "VEHCAT",
      "LR",
      "LRDATE",
      "VEHICLEREPDATE",
    ];
    let err = {
      INVOICE: null,
      DOCDATE: null,
      DRIVERNAME: null,
      MOBILE: null,
      MOT: null,
      VEHICLENO: null,
      VEHCAT: null,
      ROADPERMIT: null,
      LR: null,
      LRDATE: null,
      VEHICLEREPDATE: null,
      INDATE: null,
      ATTACHMENT: null,
    };
    require.map((items) => {
      if (data[items] === "" || data[items] == null) {
        hasErr = true;
        err[items] = "This field is mandatory";
      }
    });

    if (data.LR && data.LR.length < 15) {
      err.LR = "Minimum length should be 15 characters";
    }
    if (data.MOBILE && data.MOBILE.length < 10) {
      err.MOBILE = "Minimum length should be 10 characters";
    }
    if (data.VEHICLENO && data.VEHICLENO.length < 9) {
      err.VEHICLENO = "Minimum length should be 9 characters";
    }

    seterror(err);
    if (hasErr) {
      toast.error("Please fill all the mandatory fields");
    } else {
      navigate("/Outward/RGP-RFA-Issue/Details", {
        state: { podata, data, selectedFile },
      });
    }
  };

  const [isFocused, setIsFocused] = useState({
    INVOICE: false,
    DOCDATE: false,
    DRIVERNAME: false,
    MOBILE: false,
    MOT: false,
    VEHICLENO: false,
    VEHCAT: false,
    ROADPERMIT: false,
    LR: false,
    LRDATE: false,
    PACKAGES: false,
    VEHICLEREPDATE: false,
    INDATE: false,
  });

  const inputStyle = {
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "1px solid black",
  };

  const focusStyle = {
    borderBottom: "1px solid black",
    outline: "none",
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="container">
      <Header />
      <div
        className="header_file"
        style={{ textAlign: "left", fontFamily: "Roboto, sans-serif" }}
      >
        <span
          className="sub-header"
          style={{ marginLeft: "65px", fontWeight: "500" }}
        >
          Outward Gate Entry
        </span>{" "}
        RGP/NRGP
      </div>

      <div className="section" style={{ marginLeft: "50px" }}>
        <h3 style={{ color: "#717171" }}>Transport Details :</h3>
        <div style={{ width: "80%", marginLeft: "150px" }}>
          <div className="row">
            {/* --- Vehicle Number dropdown, fetched via emp ID, autofills the form --- */}
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Vehicle Number*</label>
              <select
                style={{
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "1px solid black",
                  ...inputStyle,
                  ...(isFocused.VEHICLENO ? focusStyle : {}),
                }}
                value={data.VEHICLENO}
                onChange={(e) => setValue({ VEHICLENO: e.target.value })}
                onFocus={() => handleFocus("VEHICLENO")}
                onBlur={() => handleBlur("VEHICLENO")}
              >
                <option value="">Select a vehicle</option>
                {vehicleList.map((vehicleNo, index) => (
                  <option key={index} value={vehicleNo}>
                    {vehicleNo}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>EWay Bill No.</label>
              <input
                type="text"
                style={{
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "1px solid black",
                  ...inputStyle,
                  ...(isFocused.ROADPERMIT ? focusStyle : {}),
                }}
                value={data.ROADPERMIT}
                onChange={(e) => setValue({ ROADPERMIT: e.target.value })}
                onFocus={() => handleFocus("ROADPERMIT")}
                onBlur={() => handleBlur("ROADPERMIT")}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Mode of Transport*</label>
              <select
                className="dropdown-mot"
                style={{
                  height: "2rem",
                  borderBottom: "1px solid black",
                  borderTop: "none",
                  borderRight: "none",
                  borderLeft: "none",
                  ...inputStyle,
                  ...(isFocused.MOT ? focusStyle : {}),
                }}
                value={data.MOT}
                onChange={handleChange}
                onFocus={() => handleFocus("MOT")}
                onBlur={() => handleBlur("MOT")}
              >
                <option value={""}>Please select Mode of Transport*</option>
                {motList.map((plant) => (
                  <option key={plant.LABLE} value={plant.LABLE}>
                    {plant.LABLE}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Vehicle Category*</label>
              <select
                className="dropdown-mot"
                style={{
                  height: "2rem",
                  borderBottom: "1px solid black",
                  borderTop: "none",
                  borderRight: "none",
                  borderLeft: "none",
                  ...inputStyle,
                  ...(isFocused.VEHCAT ? focusStyle : {}),
                }}
                value={data.VEHCAT}
                onChange={handleChangeVcat}
                onFocus={() => handleFocus("VEHCAT")}
                onBlur={() => handleBlur("VEHCAT")}
              >
                <option value={""}>Please select Vehicle Category*</option>
                {vcatList.map((plant) => (
                  <option key={plant.LABLE} value={plant.LABLE}>
                    {plant.LABLE}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="section" style={{ marginLeft: "50px" }}>
        <h3 style={{ color: "#717171" }}>Basic Details :</h3>
        <div style={{ width: "80%", marginLeft: "150px", color: "#000000" }}>
          <div className="row">
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Invoice Number*</label>
              <input
                type="text"
                style={{
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "1px solid black",
                  ...inputStyle,
                  ...(isFocused.INVOICE ? focusStyle : {}),
                }}
                value={data.INVOICE}
                onChange={(e) => setValue({ INVOICE: e.target.value })}
                onFocus={() => handleFocus("INVOICE")}
                onBlur={() => handleBlur("INVOICE")}
              />
            </div>
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Invoice Date*</label>
              <input
                type="date"
                style={{
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "1px solid black",
                  ...inputStyle,
                  ...(isFocused.DOCDATE ? focusStyle : {}),
                }}
                value={data.DOCDATE}
                onChange={(e) => setValue({ DOCDATE: e.target.value })}
                onFocus={() => handleFocus("DOCDATE")}
                onBlur={() => handleBlur("DOCDATE")}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>LR Number*</label>
              <input
                type="text"
                style={{
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "1px solid black",
                  ...inputStyle,
                  ...(isFocused.LR ? focusStyle : {}),
                }}
                value={data.LR}
                onChange={(e) => setValue({ LR: e.target.value })}
                onFocus={() => handleFocus("LR")}
                onBlur={() => handleBlur("LR")}
              />
            </div>
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>LR Date*</label>
              <input
                type="date"
                style={{
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "1px solid black",
                  ...inputStyle,
                  ...(isFocused.LRDATE ? focusStyle : {}),
                }}
                value={data.LRDATE}
                onChange={(e) => setValue({ LRDATE: e.target.value })}
                onFocus={() => handleFocus("LRDATE")}
                onBlur={() => handleBlur("LRDATE")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="section" style={{ marginLeft: "50px" }}>
        <h3 style={{ color: "#717171" }}>Driver And Reporting Details :</h3>
        <div style={{ width: "80%", marginLeft: "150px" }}>
          <div className="row">
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Transport Driver Name*</label>
              <input
                type="text"
                style={{
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "1px solid black",
                  ...inputStyle,
                  ...(isFocused.DRIVERNAME ? focusStyle : {}),
                }}
                value={data.DRIVERNAME}
                onChange={(e) => setValue({ DRIVERNAME: e.target.value })}
                onFocus={() => handleFocus("DRIVERNAME")}
                onBlur={() => handleBlur("DRIVERNAME")}
              />
            </div>
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Transporter Mobile No.*</label>
              <input
                type="text"
                style={{
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "1px solid black",
                  ...inputStyle,
                  ...(isFocused.MOBILE ? focusStyle : {}),
                }}
                value={data.MOBILE}
                onChange={(e) => setValue({ MOBILE: e.target.value })}
                onFocus={() => handleFocus("MOBILE")}
                onBlur={() => handleBlur("MOBILE")}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Reporting Date & Time*</label>
              <input
                type="datetime-local"
                style={{
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "1px solid black",
                  ...inputStyle,
                  ...(isFocused.VEHICLEREPDATE ? focusStyle : {}),
                }}
                value={data.VEHICLEREPDATE}
                onChange={(e) => setValue({ VEHICLEREPDATE: e.target.value })}
                onFocus={() => handleFocus("VEHICLEREPDATE")}
                onBlur={() => handleBlur("VEHICLEREPDATE")}
              />
            </div>
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Packages</label>
              <input
                type="text"
                maxLength={4}
                style={{
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "1px solid black",
                  ...inputStyle,
                  ...(isFocused.PACKAGES ? focusStyle : {}),
                }}
                value={data.PACKAGES}
                onChange={(e) => setValue({ PACKAGES: e.target.value })}
                onFocus={() => handleFocus("PACKAGES")}
                onBlur={() => handleBlur("PACKAGES")}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <input
          type="file"
          style={{ display: "none" }}
          id="file-input"
          multiple
          onChange={handleFileChange}
        />
      </div>

      <div
        className="section"
        style={{ marginLeft: "50px", display: "flex", flexDirection: "row" }}
      >
        <h3 style={{ color: "#717171" }}>Attach Files :</h3>
        <label htmlFor="file-input" style={{ cursor: "pointer" }}>
          <img
            src="/Images/Vector__.png"
            style={{
              height: "15px",
              width: "15px",
              marginTop: "18px",
              marginLeft: "15px",
            }}
            alt="Attachment Image"
          ></img>
        </label>
        <div>
          {selectedFile?.length > 0 && (
            <div
              className="uploadStyle"
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "20px",
                marginTop: "14px",
                marginLeft: "12px",
              }}
            >
              {selectedFile.map((file, index) => (
                <div style={{ display: "flex" }} key={index}>
                  <div
                    style={{
                      cursor: "pointer",
                      borderRadius: "20px",
                      border: "1px solid black",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      padding: "4px 10px",
                    }}
                  >
                    <span onClick={() => handlePreview(file)}>{file.name}</span>
                    <img
                      src="/Images/Cross.png"
                      style={{
                        cursor: "pointer",
                        height: "15px",
                        width: "15px",
                        marginLeft: "5px",
                      }}
                      onClick={() => removeFile(index)}
                    ></img>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <button
          className="submit-button"
          onClick={handleSubmit}
          style={{
            border: "none",
            borderRadius: "40px",
            backgroundColor: "#0091FF",
            color: "white",
            width: "150px",
            height: "45px",
            cursor: "pointer",
            marginTop: "40px",
            marginRight: "30px",
            marginBottom: "20px",
          }}
        >
          View Item Fields
        </button>
      </div>
      <div className="footerSpacing">
        <Footer></Footer>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    VehicleInfo: state?.entryReducer?.vehicleData
  }
}

export default connect(mapStateToProps, { getVehicleDetails })(HomeWithoutPO)