import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import '../../../Stylesheet/Inward.scss'
import { Button, Dialog, DialogContent, DialogActions, TextField } from '@mui/material';
import { PoData,AsnData } from '../../../redux/action/PoData';
import { connect } from 'react-redux';
import toast from 'react-hot-toast';

function HomePO(props) {
  const navigate = useNavigate();

  const [entryMode, setEntryMode] = useState("PO"); 
  const [selectedOptions, setSelectedOptions] = useState();
  const [details, setDetails] = useState(null);
  const [plantList, setPlantList] = useState([]);
  const [plantOptions, setPlantOptions] = useState([]);
  const [plantName, setPlantName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, seterror] = useState({});
  const [data, setdata] = useState({
    "PLANT": "",
    "PO": [],
    "LINEITEM": [],
  });
  const [multiPO, setMultiPO] = useState(data.PO);
  let n = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let podata = [...multiPO];

  const setValue = (val) => {
    setdata({ ...data, ...val });
  };

  useEffect(() => {
    const persistRoot = localStorage.getItem("persist:root");
    if (persistRoot) {
      try {
        const parsedPersist = JSON.parse(persistRoot);
        const loginReducer = JSON.parse(parsedPersist.loginreducer);
        setDetails(loginReducer.details);
      } catch (error) {
        console.error("Error parsing persist:root data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!details) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`https://gateentryapi.rrparkon.net:6008/Employee/allocated_plant?id=${details}`);
        const newData = await response.json();

        setPlantList(newData);

        const options = newData.map((plant) => ({
          label: plant.PLANT_NAME,
          value: plant.PLANT_ID,
        }));
        setPlantOptions(options);

        if (options.length > 0) {
          setPlantName(options[0].value);
          setValue({ PLANT: options[0].value });
        }
      } catch (error) {
        console.error("Error fetching plant data:", error);
      }
    };

    fetchData();
  }, [details]);

  useEffect(() => {
    setPlantName(plantOptions.length > 0 ? plantOptions[0]?.value : "");
  }, [plantOptions]);

  const handleChange = (event) => {
    const selectedPlant = event.target.value;
    setPlantName(selectedPlant);
    setValue({ PLANT: selectedPlant });
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = (e) => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
 if (entryMode === "ASN") {
  const asn = multiPO[0];
  if (!asn) {
    toast.error("ASN Number is required");
    return;
  }

props.AsnData({ asn })
  .then((response) => {
    console.log("response", response);
    if (response.status === 200 && response.data.length > 0) {
      navigate('/Inward/ASN/Details', { state: response.data });
    } else {
      toast.error(response.data.message || "ASN not found");
    }
  })
  .catch((err) => {
    console.error("ASN API Error:", err);
    // Display the specific error message from the reject
    toast.error(err.message || "Error fetching ASN data");
  });

  return;
}

  let hasErr = false;
  let requiredFields = ["PLANT", "PO"];
  let err = { PLANT: "", PO: "", LINEITEM: "" };

  requiredFields.forEach((field) => {
    if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
      hasErr = true;
      err[field] = "This field is mandatory";
    }
  });

  seterror(err);

  if (!hasErr) {
    let send_data = { plant: plantName, po: multiPO };

    props.PoData(send_data)
      .then((response) => {
        console.log("reponse", response);
        if (response.status === 200 && response.data.length > 0 && response.data[0].FLAG == 0) {
          navigate('/Inward/PO/Details', { state: response.data });
        }
          else if(response.data[0].FLAG == 1){
            toast.error("PO Not Approved")
          }
         else if (response.status === 404) {
          toast.error("Data not found");
        }
      })
      .catch((err) => {
        toast.error("Error fetching PO data");
        console.error("API Error:", err);
      });
  }
};


  return (
    <>
      <div className='poMain'>
        <div className='poLogin'>
          <div className='rightdiv'>
            <img src="../Images/inwardLogin.png" alt="Logo" style={{ width: "100%", height: "100%", marginLeft: 20 }} />
          </div>

          <div className='rightdiv'>
            <div className='rightIcon'>
              <div>
                <h1 className='h2'>Inward Gate Entry</h1>
                <h2 className='h3'>With reference to {entryMode === "PO" ? "PO" : "ASN"}</h2>
              </div>

              <div className='closeIcon'>
                <IconContext.Provider value={{ color: "#f10f0f", size: "20px" }}>
                  <AiOutlineCloseCircle
                    type="button"
                    onClick={() => navigate("/Home")}
                  />
                </IconContext.Provider>
              </div>
            </div>

            <div className="inputs">
              <div className="toggle-buttons">
                <button
                  className={`toggle-btn ${entryMode === "PO" ? "active" : ""}`}
                  onClick={() => setEntryMode("PO")}
                >
                  PO Number
                </button>
                <button
                  className={`toggle-btn ${entryMode === "ASN" ? "active" : ""}`}
                  onClick={() => setEntryMode("ASN")}
                >
                  ASN
                </button>
              </div>

              {entryMode === "PO" && (
                <>
                  <div className="grid-container">
                    <p className="heading">Plant</p>
                    <div className="dropdown-container">
                      <select
                        className="dropdown-style"
                        value={plantName}
                        onChange={handleChange}
                      >
                        <option value={""}>Select Plant</option>
                        {plantOptions.map((plant) => (
                          <option key={plant.value} value={plant.value}>
                            {plant.value} ({plant.label})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className='grid-container'>
                    <p className='heading'>PO Number</p>
                    <input
                      type="text"
                      placeholder="Please enter Purchasing Document Number"
                      style={{ padding: 10 }}
                      onChange={(text) => {
                        let updatedPO = [text.target.value];
                        setMultiPO(updatedPO);
                        setValue({ PO: updatedPO });
                      }}
                    />
                  </div>

                  <div>
                    <div className='addmorediv' onClick={handleOpen}>
                      Add More
                    </div>
                    <Dialog open={isOpen} onClose={handleClose}>
                      <DialogContent>
                        {n.map((item, index) => (
                          <TextField
                            key={index}
                            label="Purchasing Document No."
                            value={data.PO[index]}
                            onChange={text => {
                              podata[0] = data.PO[0];
                              podata[index] = text.target.value;
                              setMultiPO(podata);
                            }}
                            size='small'
                            style={{ width: "45%", marginRight: "5%", marginTop: "3%" }}
                          />
                        ))}
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} color="primary">
                          Done
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </>
              )}

              {entryMode === "ASN" && (
                <div className="grid-container">
                  <p className="heading">ASN Number</p>
                  <input
                    type="text"
                    placeholder="Enter ASN Number"
                    style={{ padding: 10 }}
                    onChange={(text) => {
                      const asn = text.target.value;
                      setMultiPO([asn]);
                      setValue({ PO: [asn] });
                    }}
                  />
                </div>
              )}

              <button className="loginBtn" onClick={handleSubmit}>
                Proceed
              </button>
            </div>
          </div>
        </div>

        <div className='footerStyle'>
          <p className='footerText'>Powered by</p>
          <img src="../Images/Picture1.png" alt="Logo" />
        </div>
      </div>
    </>
  );
}

export default connect(null, { PoData,AsnData })(HomePO);
