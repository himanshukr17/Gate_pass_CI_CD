import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import "../../../Stylesheet/Details.scss";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { getVehicleDetails } from "../../../redux/action/Entry";
import moment from "moment";
import toast, { Toaster } from 'react-hot-toast';

import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL

const DetailPO = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const podata = location.state;
  const [selectedFile, setSelectedFile] = useState([]);

  // console.log("seleeeected fileee", podata);
  const [data, setdata] = useState({
    INVOICE: "",
    DOCDATE: moment(podata[0].DOCUMENT_DATE, "DD.MM.YYYY").format("YYYY-MM-DD"),
    VENDORNAME: podata[0].VENDOR_NAME,
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
    FLAG_UPDATION: podata[0].FLAG_UPDATION,
    ATTACHMENT: '',
    VEHICLE_KEY: ''

  });
  // console.log("podata", data);
  // console.log("data send to server", data.VEHICLENO);

  const vData = props?.VehicleInfo;

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [vehicleList, setVehicleList] = useState([]);
  // console.log("Vehicle List is here", vehicleList);
  // console.log("vehicle Data",podata[0]?.PLANT)

  // For fetching all vehicles once plant is ready
  useEffect(() => {
    if (podata[0]?.PLANT) {
      const fetchAllVehicle = async () => {
        try {
          const response = await axios.get(
            `${apiURL}Vehicle/getVehicleByPlant?plant=${podata[0]?.PLANT}`
          );

          const vehicleNo = response.data.map((item) => item.VEHICLE_NO)

          setVehicleList(vehicleNo);
        } catch (err) {
          setErrors(err.message || "Something went wrong");
        }
      };

      fetchAllVehicle();
    }
  }, [podata[0]?.PLANT]);

  // For fetching specific vehicle when VEHICLENO is present
  useEffect(() => {
    if (podata[0]?.PLANT && data?.VEHICLENO) {
      const fetchVehicleData = async () => {
        try {
          const response = await axios.get(
            `${apiURL}Vehicle/getVehicleByPlant?plant=${podata[0]?.PLANT}&vehicleNo=${data?.VEHICLENO}`
          );
          setVehicles(response.data);
          setLoading(false);
        } catch (err) {
          setErrors(err.message || "Something went wrong");
          setLoading(false);
        }
      };

      fetchVehicleData();
    }
  }, [podata[0]?.PLANT, data?.VEHICLENO]);


  const formatToLocalDateTimeInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  //   // Convert the custom date string to a Date object
  //   const dateObject = parseCustomDate(dateString);

  //   // Format the Date object to 'YYYY-MM-DDTHH:mm'
  //   const isoFormatted = dateObject.toISOString().slice(0, 16);

  //   return isoFormatted;
  // }

  // // Helper function: Converts custom date format to a Date object
  // function parseCustomDate(dateString) {
  //   const [datePart, timePart] = dateString.split(", ");
  //   const [day, month, year] = datePart.split("/").map(Number);
  //   const [time, period] = timePart.split(" ");
  //   let [hours, minutes, seconds] = time.split(":").map(Number);

  //   if (period.toLowerCase() === "pm" && hours !== 12) hours += 12;
  //   if (period.toLowerCase() === "am" && hours === 12) hours = 0;

  //   return new Date(
  //     `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  //   );
  // }

  // function formatToISO(dateString) {
  //   // Split the date and time components
  //   const [datePart, timePart] = dateString.split(", ");

  //   // Parse the date part (DD/MM/YYYY)
  //   const [day, month, year] = datePart.split("/").map(Number);

  //   // Parse the time part and convert to 24-hour format
  //   const [time, period] = timePart.split(" ");
  //   let [hours, minutes, seconds] = time.split(":").map(Number);

  //   if (period.toLowerCase() === "pm" && hours !== 12) {
  //     hours += 12; // Convert PM to 24-hour format
  //   } else if (period.toLowerCase() === "am" && hours === 12) {
  //     hours = 0; // Handle midnight (12 AM)
  //   }

  //   // Format and return the date string in "YYYY-MM-DDTHH:mm" format
  //   return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  // }




  // console.log("vehicles", vehicles[0]?.VEHICLE_REPORTING_TIME?formatToISO(vehicles[0]?.VEHICLE_REPORTING_TIME):"", data.VEHICLEREPDATE);
  // const dates= parseCustomDate(vehicles[0]?.VEHICLE_REPORTING_TIME)
  // console.log("dates", dates);


  useEffect(() => {
    if (vehicles.length > 0) {
      const newData = {
        DRIVERNAME: vehicles[0]?.DRIVER_NAME || data.DRIVERNAME,
        MOT: vehicles[0]?.MODE_OF_TRANSPORT || data.MOT,
        VEHCAT: vehicles[0]?.VEHICLE_CATEGORY || data.VEHCAT,
        ROADPERMIT: vehicles[0]?.ROAD_PERMIT_NUMBER || data.ROADPERMIT,
        LR: vehicles[0]?.LR_NO || data.LR,
        LRDATE: moment(vehicles[0]?.LR_DATE).format("YYYY-MM-DD") || data.LRDATE,
        MOBILE: vehicles[0]?.DRIVER_MOBILE_NO || data.MOBILE,
        VEHICLEREPDATE: vehicles[0]?.VEHICLE_REPORTING_TIME
          ? formatToLocalDateTimeInput(vehicles[0]?.VEHICLE_REPORTING_TIME)
          : data.VEHICLEREPDATE,
        VEHICLE_KEY: vehicles[0]?.VEHICLE_KEY
      };

      // Update state only if the new data differs from the existing state
      if (
        data.DRIVERNAME !== newData.DRIVERNAME ||
        data.MOT !== newData.MOT ||
        data.VEHCAT !== newData.VEHCAT ||
        data.ROADPERMIT !== newData.ROADPERMIT ||
        data.LR !== newData.LR_NO ||
        data.LRDATE !== newData.LRDATE ||
        data.MOBILE !== newData.MOBILE ||
        data.VEHICLEREPDATE !== newData.VEHICLEREPDATE
      ) {
        setdata((prev) => ({
          ...prev,
          ...newData,

        }));
      }
    }
  }, [vehicles]); // Add `data` to avoid stale state issues

  const [error, seterror] = useState({});
  const [motList, setMotList] = useState([{ name: "", id: "" }]);
  const [vcatList, setVcat] = useState([{ name: "", id: "" }]);
  const [motName, setMotName] = useState();
  const [vcatName, setVcatName] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${apiURL}Employee/mot`);
      const response1 = await fetch(
        `${apiURL}Employee/vehicle_category`
      );
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
    // Update the ATTACHMENT field in `data` state
    setdata((prevData) => ({
      ...prevData,
      ATTACHMENT: file, // You can modify this if you want to store file paths or names instead
    }));

  };

  const handleFileUpload = () => {
    if (selectedFile) {
      // console.log("Uploading file:", selectedFile);
    } else {
      // console.log("No file selected");
    }
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

  // console.log("senddata", podata, data, selectedFile);


const handleSubmit = () => {
  let hasErr = false;

  const requiredFields = [
    "INVOICE",
    "DOCDATE",
    "VENDORNAME",
    "DRIVERNAME",
    "MOBILE",
    "MOT",
    "VEHICLENO",
    "VEHCAT",
    "LR",
    "LRDATE",
    "VEHICLEREPDATE",
  ];

  const err = {};

  requiredFields.forEach((field) => {
    const value = data[field];

    // ✅ Handle empty, null, undefined
    if (value === null || value === undefined || value === "") {
      hasErr = true;
      err[field] = "This field is mandatory";
    }
    else if (
      (field === "DOCDATE" || field === "LRDATE" || field === "VEHICLEREPDATE") &&
      (isNaN(new Date(value).getTime()) || !value)
    ) {
      hasErr = true;
      err[field] = "Please select a valid date";
    }
  });

  // ✅ Field-specific validations
  // if (data.LR && data.LR.length < 5) {
  //   hasErr = true;
  //   err.LR = "Minimum length should be 15 characters";
  // }

  if (data.MOBILE && data.MOBILE.length < 10) {
    hasErr = true;
    err.MOBILE = "Minimum length should be 10 characters";
  }

  if (data.VEHICLENO && data.VEHICLENO.length < 9) {
    hasErr = true;
    err.VEHICLENO = "Minimum length should be 9 characters";
  }

  seterror(err);

  if (hasErr) {
    toast.error("Please fill all the mandatory fields");
  } else {
    navigate("/Inward/PO/ItemFeild", {
      state: { podata, data, selectedFile },
    });
  }
};

  const [isFocused, setIsFocused] = useState({
    INVOICE: false,
    DOCDATE: false,
    VENDORNAME: false,
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
    // ATTACHMENT:false
    // Add more fields as necessary
  });

  const inputStyle = {
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "1px solid black",
  };

  const focusStyle = {
    borderBottom: "1px solid black", // Removes the border when focused
    outline: "none", // Optionally remove the outline for focus
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
          Inward Gate Entry
        </span>{" "}
        WITH REFERENCE TO PO
      </div>


      <div className="section" style={{ marginLeft: "50px" }}>
        <h3 style={{ color: "#717171" }}>Transport Details :</h3>
        <div style={{ width: "80%", marginLeft: "150px" }}>
          <div className="row">
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
                // maxLength={11}
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

                {motList.map((plant) => {
                  return (
                    <option key={plant.LABLE} value={plant.LABLE}>
                      {plant.LABLE}
                    </option>
                  );
                })}
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
                {vcatList.map((plant) => {
                  return (
                    <option key={plant.LABLE} value={plant.LABLE}>
                      {plant.LABLE}
                    </option>
                  );
                })}
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
                // disabled
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
                // maxLength={11}
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
                // maxLength={11}
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
            // marginTop: "20px",
            cursor: "pointer",
            marginTop: "40px",
            marginRight: "30px",
            // marginLeft:"1000px",
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
};

// export default DetailPO;

const mapStateToProps = (state) => {
  return {
    VehicleInfo: state?.entryReducer?.vehicleData,
  };
};

export default connect(mapStateToProps, { getVehicleDetails })(DetailPO);