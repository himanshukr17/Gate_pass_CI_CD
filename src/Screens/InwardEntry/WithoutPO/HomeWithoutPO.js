import React, { useEffect, useState } from 'react'
import '../../../Stylesheet/EntryPage.css'
import { useNavigate, useLocation } from "react-router-dom";
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
  const [showName] = useState(() => localStorage.getItem('EMP_NAME') || 'User');

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
          `${apiURL}Vehicle/getVehicleByEmpInward?id=${empId}`
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
      navigate("/Inward/WithoutPO/Details", {
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
    <div className="ep-root">
      <header className="ep-topbar">
        <div className="ep-topbar-left">
          <button className="ep-back-btn" onClick={() => navigate('/Home')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <div className="ep-brand">
            <img src="/Images/Frame_logo.png" alt="Logo" className="ep-brand-logo" onClick={() => navigate('/Home')} />
            <div>
              <div className="ep-brand-name">GateAccess Pro</div>
              <div className="ep-brand-sub">YARD LOGISTICS OS</div>
            </div>
          </div>
        </div>
        <div className="ep-topbar-right">
          <div className="ep-user-chip">
            <div className="ep-avatar">{showName.charAt(0).toUpperCase()}</div>
            <span className="ep-user-name">{showName}</span>
          </div>
        </div>
      </header>
      <main className="ep-main" style={{ maxWidth: '1100px' }}>
        <div className="ep-page-header">
          <div className="ep-breadcrumb"><span>Dashboard</span><span className="ep-breadcrumb-sep">›</span><span>Inward Gate Entry</span><span className="ep-breadcrumb-sep">›</span><span className="ep-breadcrumb-current">Without PO / NRGP / RGP</span></div>
          <div className="ep-type-badge inward"><span className="ep-badge-dot"></span>INWARD</div>
          <h1 className="ep-page-title">Inward Gate Entry</h1>
          <p className="ep-page-subtitle">Without PO — fill in all transport and document details below</p>
        </div>
        <div className="ep-card">
      <div className="ep-form-section">
        <div className="ep-section-label">Transport Details</div>
        <div className="ep-field-group">
            <div className="ep-field">
              <label>Vehicle Number <span className="req">*</span></label>
              <select className={`ep-select${error.VEHICLENO ? ' error' : ''}`} value={data.VEHICLENO} onChange={(e) => setValue({ VEHICLENO: e.target.value })}>
                <option value="">Select a vehicle</option>
                {vehicleList.map((vehicleNo, index) => (<option key={index} value={vehicleNo}>{vehicleNo}</option>))}
              </select>
              {error.VEHICLENO && <span className="ep-field-error">{error.VEHICLENO}</span>}
            </div>
            <div className="ep-field">
              <label>EWay Bill No.</label>
              <input className="ep-input" type="text" value={data.ROADPERMIT} onChange={(e) => setValue({ ROADPERMIT: e.target.value })} />
            </div>
        </div>
        <div className="ep-field-group">
            <div className="ep-field">
              <label>Mode of Transport <span className="req">*</span></label>
              <select className={`ep-select${error.MOT ? ' error' : ''}`} value={data.MOT} onChange={handleChange}>
                <option value="">Please select Mode of Transport</option>
                {motList.map((plant) => (<option key={plant.LABLE} value={plant.LABLE}>{plant.LABLE}</option>))}
              </select>
              {error.MOT && <span className="ep-field-error">{error.MOT}</span>}
            </div>
            <div className="ep-field">
              <label>Vehicle Category <span className="req">*</span></label>
              <select className={`ep-select${error.VEHCAT ? ' error' : ''}`} value={data.VEHCAT} onChange={handleChangeVcat}>
                <option value="">Please select Vehicle Category</option>
                {vcatList.map((plant) => (<option key={plant.LABLE} value={plant.LABLE}>{plant.LABLE}</option>))}
              </select>
              {error.VEHCAT && <span className="ep-field-error">{error.VEHCAT}</span>}
            </div>
          </div>
      </div>

      <div className="ep-form-section">
        <div className="ep-section-label">Basic Details</div>
        <div className="ep-field-group">
            <div className="ep-field"><label>Invoice Number <span className="req">*</span></label><input className={`ep-input${error.INVOICE ? ' error' : ''}`} type="text" value={data.INVOICE} onChange={(e) => setValue({ INVOICE: e.target.value })} />{error.INVOICE && <span className="ep-field-error">{error.INVOICE}</span>}</div>
            <div className="ep-field"><label>Invoice Date <span className="req">*</span></label><input className={`ep-input${error.DOCDATE ? ' error' : ''}`} type="date" value={data.DOCDATE} onChange={(e) => setValue({ DOCDATE: e.target.value })} />{error.DOCDATE && <span className="ep-field-error">{error.DOCDATE}</span>}</div>
            <div className="ep-field"><label>LR Number <span className="req">*</span></label><input className={`ep-input${error.LR ? ' error' : ''}`} type="text" value={data.LR} onChange={(e) => setValue({ LR: e.target.value })} />{error.LR && <span className="ep-field-error">{error.LR}</span>}</div>
            <div className="ep-field"><label>LR Date <span className="req">*</span></label><input className={`ep-input${error.LRDATE ? ' error' : ''}`} type="date" value={data.LRDATE} onChange={(e) => setValue({ LRDATE: e.target.value })} />{error.LRDATE && <span className="ep-field-error">{error.LRDATE}</span>}</div>
          </div>
      </div>

      <div className="ep-form-section">
        <div className="ep-section-label">Driver & Reporting Details</div>
        <div className="ep-field-group">
            <div className="ep-field"><label>Transport Driver Name <span className="req">*</span></label><input className={`ep-input${error.DRIVERNAME ? ' error' : ''}`} type="text" value={data.DRIVERNAME} onChange={(e) => setValue({ DRIVERNAME: e.target.value })} />{error.DRIVERNAME && <span className="ep-field-error">{error.DRIVERNAME}</span>}</div>
            <div className="ep-field"><label>Transporter Mobile No. <span className="req">*</span></label><input className={`ep-input${error.MOBILE ? ' error' : ''}`} type="text" value={data.MOBILE} onChange={(e) => setValue({ MOBILE: e.target.value })} />{error.MOBILE && <span className="ep-field-error">{error.MOBILE}</span>}</div>
            <div className="ep-field"><label>Reporting Date & Time <span className="req">*</span></label><input className={`ep-input${error.VEHICLEREPDATE ? ' error' : ''}`} type="datetime-local" value={data.VEHICLEREPDATE} onChange={(e) => setValue({ VEHICLEREPDATE: e.target.value })} />{error.VEHICLEREPDATE && <span className="ep-field-error">{error.VEHICLEREPDATE}</span>}</div>
            <div className="ep-field"><label>Packages</label><input className="ep-input" type="text" maxLength={4} value={data.PACKAGES} onChange={(e) => setValue({ PACKAGES: e.target.value })} /></div>
          </div>
      </div>

      <div className="ep-form-section">
        <div className="ep-section-label">Attach Files</div>
        <input type="file" style={{ display: 'none' }} id="file-input" multiple onChange={handleFileChange} />
        <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#3b82f6', fontWeight: 600 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          Attach File(s)
        </label>
        {selectedFile?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {selectedFile.map((file, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500 }}>
                <span style={{ cursor: 'pointer', color: '#2563eb' }} onClick={() => handlePreview(file)}>{file.name}</span>
                <span style={{ cursor: 'pointer', color: '#94a3b8', fontSize: 14 }} onClick={() => removeFile(index)}>✕</span>
              </div>
            ))}
          </div>
        )}
      </div>

          <div className="ep-actions">
            <button className="ep-cancel-btn" onClick={() => navigate('/Home')}>Cancel</button>
            <button className="ep-submit-btn" onClick={handleSubmit}>
              View Item Fields
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    VehicleInfo: state?.entryReducer?.vehicleData
  }
}

export default connect(mapStateToProps, { getVehicleDetails })(HomeWithoutPO)