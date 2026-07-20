import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import "../../../Stylesheet/Details.scss";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import moment from "moment";
import toast, { Toaster } from 'react-hot-toast';

const apiURL = process.env.REACT_APP_API_URL

const DetailPO = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const podata = location.state; 

  console.log("pooooooooooooooodata", podata)
  const [selectedFile, setSelectedFile] = useState([]);
  const [data, setdata] = useState({
    ASN: podata[0]?.ASN_ID || "",
    INVOICE: podata[0]?.INVOICE_NUMBER || "",
    DOCDATE: podata[0]?.SHIPPING_DATE ? moment(podata[0].SHIPPING_DATE).format("YYYY-MM-DD") : "",
    VENDORNAME: podata[0]?.VENDOR_NAME || podata[0]?.PLANT_DESCRIPTION || "",
    DRIVERNAME: podata[0]?.Reporting[0]?.DRIVER_NAME|| "",
    MOBILE: podata[0]?.Reporting[0]?.DRIVER_MOBILE_NO,
    MOT: podata[0]?.Reporting[0]?.MODE_OF_TRANSPORT,
    VEHCAT: podata[0]?.Reporting[0]?.VEHICLE_CATEGORY,
    ROADPERMIT: podata[0]?.E_WAY_BILL_NUMBER || "",
    LR: podata[0]?.Reporting[0]?.LR_NO || "",
    LRDATE: podata[0]?.Reporting[0]?.LR_DATE ? moment(podata[0]?.Reporting[0].LR_DATE).format("YYYY-MM-DD") : "",
    PACKAGES: "",
   VEHICLEREPDATE: podata[0]?.Reporting[0]?.VEHICLE_REPORTING_TIME
  ? moment(podata[0].Reporting[0].VEHICLE_REPORTING_TIME).format("YYYY-MM-DDTHH:mm")
  : "",

    INDATE: moment().format("YYYY-MM-DD"),
    ATTACHMENT: '',
    VEHICLENO: podata[0]?.VEHICLE_NUMBER || "",
    VEHICLE_KEY: podata[0]?.Reporting[0]?.VEHICLE_KEY || ""
  });

  const [error, seterror] = useState({});
  const [motList, setMotList] = useState([{ name: "", id: "" }]);
  const [vcatList, setVcat] = useState([{ name: "", id: "" }]);
  const [motName, setMotName] = useState();
  const [vcatName, setVcatName] = useState();

  // Fetch MOT and Vehicle Category lists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiURL}/Employee/mot`);
        const response1 = await fetch(`${apiURL}/Employee/vehicle_category`);
        const newData = await response.json();
        setMotList(newData);
        const newData1 = await response1.json();
        setVcat(newData1);
      } catch (error) {
        console.error("Error fetching MOT or Vehicle Category:", error);
      }
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
      "VENDORNAME",
      "DRIVERNAME",
      "MOBILE",
      "MOT",
      "VEHICLENO",
      "VEHCAT",
      // "ROADPERMIT",
      "LR",
      "LRDATE",
      "VEHICLEREPDATE",
      "INDATE",
    ];
    let err = {
      INVOICE: null,
      DOCDATE: null,
      VENDORNAME: null,
      DRIVERNAME: null,
      MOBILE: null,
      MOT: null,
      VEHICLENO: null,
      VEHCAT: null,
      // ROADPERMIT: null,
      LR: null,
      LRDATE: null,
      VEHICLEREPDATE: null,
      INDATE: null,
    };

    require.forEach((items) => {
      if (data[items] === "" || data[items] == null) {
        hasErr = true;
        err[items] = "This field is mandatory";
      }
    });

    if (data.LR.length < 5) {
      hasErr = true;
      err.LR = "Minimum length should be 5 characters";
    }
    if (data.MOBILE.length < 10) {
      hasErr = true;
      err.MOBILE = "Minimum length should be 10 characters";
    }
    if (data.VEHICLENO.length < 9) {
      hasErr = true;
      err.VEHICLENO = "Minimum length should be 9 characters";
    }

    seterror(err);
    if (hasErr) {
      toast.error("Please fill all the mandatory fields");
    } else {
      navigate("/Inward/ASN/ItemFields", {
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
      <Toaster />
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
        WITH REFERENCE TO ASN
      </div>

      <div className="section" style={{ marginLeft: "50px" }}>
        <h3 style={{ color: "#717171" }}>Transport Details :</h3>
        <div style={{ width: "80%", marginLeft: "150px" }}>
          <div className="row">
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Vehicle Number*</label>
              <input
                type="text"
                style={{
                  ...inputStyle,
                  ...(isFocused.VEHICLENO ? focusStyle : {}),
                }}
                value={data.VEHICLENO}
                onChange={(e) => setValue({ VEHICLENO: e.target.value })}
                onFocus={() => handleFocus("VEHICLENO")}
                onBlur={() => handleBlur("VEHICLENO")}
              />
              {error.VEHICLENO && <p style={{ color: "red", fontSize: "12px" }}>{error.VEHICLENO}</p>}
            </div>

            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>EWay Bill No.</label>
              <input
                type="text"
                // maxLength={11}
                style={{
                  ...inputStyle,
                  ...(isFocused.ROADPERMIT ? focusStyle : {}),
                }}
                value={data.ROADPERMIT}
                onChange={(e) => setValue({ ROADPERMIT: e.target.value })}
                onFocus={() => handleFocus("ROADPERMIT")}
                onBlur={() => handleBlur("ROADPERMIT")}
              />
              {error.ROADPERMIT && <p style={{ color: "red", fontSize: "12px" }}>{error.ROADPERMIT}</p>}
            </div>
          </div>
          <div className="row">
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Mode of Transport*</label>
              <select
                className="dropdown-mot"
                style={{
                  height: "2rem",
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
              {error.MOT && <p style={{ color: "red", fontSize: "12px" }}>{error.MOT}</p>}
            </div>
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Vehicle Category*</label>
              <select
                className="dropdown-mot"
                style={{
                  height: "2rem",
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
              {error.VEHCAT && <p style={{ color: "red", fontSize: "12px" }}>{error.VEHCAT}</p>}
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
                  ...inputStyle,
                  ...(isFocused.INVOICE ? focusStyle : {}),
                }}
                value={data.INVOICE}
                onChange={(e) => setValue({ INVOICE: e.target.value })}
                onFocus={() => handleFocus("INVOICE")}
                onBlur={() => handleBlur("INVOICE")}
              />
              {error.INVOICE && <p style={{ color: "red", fontSize: "12px" }}>{error.INVOICE}</p>}
            </div>
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Invoice Date*</label>
              <input
                type="date"
                style={{


                  ...inputStyle,
                  ...(isFocused.DOCDATE ? focusStyle : {}),
                }}
                value={data.DOCDATE}
                onChange={(e) => setValue({ DOCDATE: e.target.value })}
                onFocus={() => handleFocus("DOCDATE")}
                onBlur={() => handleBlur("DOCDATE")}
              />
              {error.DOCDATE && <p style={{ color: "red", fontSize: "12px" }}>{error.DOCDATE}</p>}
            </div>
          </div>
          <div className="row">
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>LR Number*</label>
              <input
                type="text"
                maxLength={15}
                style={{
                  ...inputStyle,
                  ...(isFocused.LR ? focusStyle : {}),
                }}
                value={data.LR}
                onChange={(e) => setValue({ LR: e.target.value })}
                onFocus={() => handleFocus("LR")}
                onBlur={() => handleBlur("LR")}
              />
              {error.LR && <p style={{ color: "red", fontSize: "12px" }}>{error.LR}</p>}
            </div>
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>LR Date*</label>
              <input
                type="date"
                style={{
                  ...inputStyle,
                  ...(isFocused.LRDATE ? focusStyle : {}),
                }}
                value={data.LRDATE}
                onChange={(e) => setValue({ LRDATE: e.target.value })}
                onFocus={() => handleFocus("LRDATE")}
                onBlur={() => handleBlur("LRDATE")}
              />
              {error.LRDATE && <p style={{ color: "red", fontSize: "12px" }}>{error.LRDATE}</p>}
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
                  ...inputStyle,
                  ...(isFocused.DRIVERNAME ? focusStyle : {}),
                }}
                value={data.DRIVERNAME}
                onChange={(e) => setValue({ DRIVERNAME: e.target.value })}
                onFocus={() => handleFocus("DRIVERNAME")}
                onBlur={() => handleBlur("DRIVERNAME")}
              />
              {error.DRIVERNAME && <p style={{ color: "red", fontSize: "12px" }}>{error.DRIVERNAME}</p>}
            </div>
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Transporter Mobile No.*</label>
              <input
                type="text"
                // maxLength={11}
                style={{
                  ...inputStyle,
                  ...(isFocused.MOBILE ? focusStyle : {}),
                }}
                value={data.MOBILE}
                onChange={(e) => setValue({ MOBILE: e.target.value })}
                onFocus={() => handleFocus("MOBILE")}
                onBlur={() => handleBlur("MOBILE")}
              />
              {error.MOBILE && <p style={{ color: "red", fontSize: "12px" }}>{error.MOBILE}</p>}
            </div>
          </div>
          <div className="row">
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Reporting Date & Time*</label>
              <input
                type="datetime-local"
                style={{
                  ...inputStyle,
                  ...(isFocused.VEHICLEREPDATE ? focusStyle : {}),
                }}
                value={data.VEHICLEREPDATE}
                onChange={(e) => setValue({ VEHICLEREPDATE: e.target.value })}
                onFocus={() => handleFocus("VEHICLEREPDATE")}
                onBlur={() => handleBlur("VEHICLEREPDATE")}
              />
              {error.VEHICLEREPDATE && <p style={{ color: "red", fontSize: "12px" }}>{error.VEHICLEREPDATE}</p>}
            </div>
            <div className="input-group" style={{ paddingRight: "50px" }}>
              <label style={{ color: "#000000" }}>Packages</label>
              <input
                type="text"
                maxLength={4}
                style={{
                  ...inputStyle,
                  ...(isFocused.PACKAGES ? focusStyle : {}),
                }}
                value={data.PACKAGES}
                onChange={(e) => setValue({ PACKAGES: e.target.value })}
                onFocus={() => handleFocus("PACKAGES")}
                onBlur={() => handleBlur("PACKAGES")}
              />
              {error.PACKAGES && <p style={{ color: "red", fontSize: "12px" }}>{error.PACKAGES}</p>}
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
          />
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
                      alt="Remove file"
                    />
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
        <Footer />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    VehicleInfo: state?.entryReducer?.vehicleData,
  };
};

export default connect(mapStateToProps)(DetailPO);
