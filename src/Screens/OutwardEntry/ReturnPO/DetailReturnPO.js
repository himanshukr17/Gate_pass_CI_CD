import React, { useEffect, useState } from 'react'
import '../../../Stylesheet/Details.scss'
import Footer from '../../../Components/Footer'
import Header from '../../../Components/Header'
import { Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomDivider from '../../../Components/Divider'

const apiURL = process.env.REACT_APP_API_URL

function DetailReturnPO(props) {

  const navigate = useNavigate()
  let location = useLocation()
  let podata = location.state
  // console.log("$$$$$$$$$$$$$$$$$$$$$$$$", podata)

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      // Perform your file upload logic here
      // console.log('Uploading file:', selectedFile);
    } else {
      // console.log('No file selected');
    }
  };

  const [data, setdata] = useState({
    "INVOICE": "",
    "DOCDATE": "",
    "VENDORNAME": "",
    "DRIVERNAME": "",
    "MOBILE": "",
    "MOT": '',
    "VEHICLENO": '',
    "VEHCAT": '',
    "ROADPERMIT": '',
    "LR": '',
    "LRDATE": "",
    "PACKAGES": '',
    "VEHICLEREPDATE": "",
    "INDATE": new Date(),
  })
  const [error, seterror] = useState({
  })
  const setValue = (val) => {
    setdata({ ...data, ...val })
  }


  const [motList, setMotList] = useState([{ 'name': '', 'id': '' }]);
  const [motName, setMotName] = useState()

  const [vcatList, setVcat] = useState([{ 'name': '', 'id': '' }]);
  const [vcatName, setVcatName] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${apiURL}Employee/mot`)
      const response1 = await fetch(`${apiURL}Employee/vehicle_category`)

      const newData = await response.json();
      setMotList(newData);

      const newData1 = await response1.json();
      setVcat(newData1)
      // console.log(newData)
    }
    fetchData();
  }, [])

  const handleChange = (event) => (setMotName(event.target.value), setValue({ MOT: event.target.value }))
  const handleChangeVcat = (event) => (setVcatName(event.target.value), setValue({ VEHCAT: event.target.value }))


  const handleSubmit = () => {
    // navigate('/Inward/PO/ItemFeild', { state: { podata, data } })
    let hasErr = false
    let require = ["INVOICE", "DOCDATE", "VENDORNAME", "DRIVERNAME", "MOBILE", "MOT", "VEHICLENO", "VEHCAT", "ROADPERMIT", "LR", "LRDATE", "PACKAGES", "VEHICLEREPDATE", "INDATE"]
    let err = {
      INVOICE: null,
      DOCDATE: null,
      VENDORNAME: null,
      DRIVERNAME: null,
      MOBILE: null,
      MOT: null,
      VEHICLENO: null,
      VEHCAT: null,
      ROADPERMIT: null,
      LR: null,
      LRDATE: null,
      PACKAGES: null,
      VEHICLEREPDATE: null,
      INDATE: null,
    }
    require.map((items) => {
      if (data[items] == "" || data[items] == '' || data[items] == null) {
        hasErr = true
        err[items] = "This field is mandatory"
      }
    })

    if (data.LR < 15) {
      err.LR = ("Minimum lenght should be 15 characters")
    }
    if (data.MOBILE < 10) {
      err.MOBILE = ("Minimum lenght should be 10 characters")
    }
    if (data.VEHICLENO < 9) {
      err.VEHICLENO = ("Minimum lenght should be 9 characters")
    }
    seterror(err)
    if (!hasErr) {
      navigate('/Outward/ReturnPO/ItemFields', { state: { podata, data } })
    }
  }


  // console.log('====================================');
  // console.log(data);
  // console.log('====================================');

  return (
    <>

      <Header></Header>

      <div className='headinggg'>
        <div className='headingStyle'>
          <Link to="/Outward" style={{ color: 'black' }}><p>Outward Gate Entry - </p></Link>
          <p className='po'>With Return PO/Return Challan</p>
        </div>

        <Link to="/Outward/ReturnPO/ItemFields" style={{ color: 'black' }}><p className='po' >View Item Feilds</p></Link>
      </div>

      <div className='InputBox'>
        {/* <div className='entryHead'>
          <p>Gate Entry Number - </p>
          <p className='po'>I526</p>
        </div>

        <div className='dividerStyle'>
          <CustomDivider color="#1897CE" thickness="0.8vh" />
        </div> */}

        <div className='inner'>

          <div className='grid-container'>
            <div className='inputFeildDesign'>
              <p>Invoice Number*</p>
              <input
                onChange={text => (setValue({ "INVOICE": text.target.value }), seterror({ ...error, INVOICE: '' }))}
                type="text"
                placeholder="Please enter Invoice Number"
                required
              />
              {error.INVOICE && <span class="error">{error.INVOICE}</span>}
            </div>

            <div className='inputFeildDesign'>
              <p>Document Date*</p>
              <input
                //class="form-control"
                type="date"
                required
                onChange={text => (setValue({ "DOCDATE": text.target.value }), seterror({ ...error, DOCDATE: '' }))}
                placeholder="Please enter Document Date"
              />
              {error.DOCDATE && <span class="error">{error.DOCDATE}</span>}

            </div>
          </div>

          <div className='grid-container'>
            <div className='inputFeildDesign'>
              <p>Packages*</p>
              <input
                //class="form-control"
                type="text"
                required
                onChange={text => (setValue({ "PACKAGES": text.target.value }), seterror({ ...error, PACKAGES: '' }))}
                placeholder="Please enter number of Packages"
              />
              {error.PACKAGES && <span class="error">{error.PACKAGES}</span>}

            </div>

            <div className='inputFeildDesign'>
              <p>Transporter Vendor name*</p>
              <input
                //class="form-control"
                type="text"
                required
                onChange={text => (setValue({ "VENDORNAME": text.target.value }), seterror({ ...error, VENDORNAME: '' }))}
                placeholder="Please enter Transporter Vendor name"
              />
              {error.VENDORNAME && <span class="error">{error.VENDORNAME}</span>}

            </div>
          </div>

          <div className='grid-container'>
            <div className='inputFeildDesign'>
              <p className='Text'> Transporter Driver name*</p>
              <input
                //class="form-control"
                type="text"
                required
                onChange={text => (setValue({ "DRIVERNAME": text.target.value }), seterror({ ...error, DRIVERNAME: '' }))}
                placeholder="Please enter Transporter Driver name"
              />
              {error.DRIVERNAME && <span class="error">{error.DRIVERNAME}</span>}

            </div>

            <div className='inputFeildDesign'>
              <p>Transporter Driver Mobile No.*</p>
              <input
                //class="form-control"
                type="text"
                maxLength={10}
                // keyboard
                required
                onChange={text => (setValue({ "MOBILE": text.target.value }), seterror({ ...error, MOBILE: '' }))}
                placeholder="Please enter Transporter Driver Mobile No."
              />
              {error.MOBILE && <span class="error">{error.MOBILE}</span>}

            </div>
          </div>

          <div className='grid-container'>
            <div className='inputFeildDesign'>
              <p>Mode of Transport</p>
              <div className="dropdown-mot">
                <select className='dropdown-mot' value={motName} onChange={handleChange}>
                  <option value={""}>Please select Mode of Transport</option>

                  {motList.map((plant) => {
                    return (
                      <option key={plant.LABLE} value={plant.LABLE}>{plant.LABLE}</option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className='inputFeildDesign'>
              <p>Vehicle Number*</p>
              <input
                //class="form-control"
                type="text"
                required
                // maxLength={11}
                minLength={10}
                onChange={text => (setValue({ "VEHICLENO": text.target.value }), seterror({ ...error, VEHICLENO: '' }))}
                placeholder="Please enter Vehicle Number"
              />
              {error.VEHICLENO && <span class="error">{error.VEHICLENO}</span>}

            </div>
          </div>

          <div className='grid-container'>
            <div className='inputFeildDesign'>
              <p>Vehicle Category</p>
              <div className="dropdown-mot">
                <select className='dropdown-mot' value={vcatName} onChange={handleChangeVcat}>
                  <option value={""}>Please select Vehicle Category</option>

                  {vcatList.map((plant) => {
                    return (
                      <option key={plant.LABLE} value={plant.LABLE}>{plant.LABLE}</option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className='inputFeildDesign'>
              <p>EWay Bill No.</p>
              <input
                //class="form-control"
                type="text"
                required
                onChange={text => (setValue({ "ROADPERMIT": text.target.value }), seterror({ ...error, ROADPERMIT: '' }))}
                placeholder="Please enter Road permit number"
              />
              {error.ROADPERMIT && <span class="error">{error.ROADPERMIT}</span>}

            </div>
          </div>

          <div className='grid-container'>
            <div className='inputFeildDesign'>
              <p>LR Number*</p>
              <input
                //class="form-control"
                type="text"
                required
                onChange={text => (setValue({ "LR": text.target.value }), seterror({ ...error, LR: '' }))}

                placeholder="Please enter LR Number"
              />
              {error.LR && <span class="error">{error.LR}</span>}

            </div>

            <div className='inputFeildDesign'>
              <p>LR Date*</p>
              <input
                //class="form-control"
                type="date"
                required
                onChange={text => (setValue({ "LRDATE": text.target.value }), seterror({ ...error, LRDATE: '' }))}
                placeholder="Please enter LR Date"
              />
              {error.LRDATE && <span class="error">{error.LRDATE}</span>}

            </div>
          </div>

          <div className='grid-container'>
            <div className='inputFeildDesign'>
              <p>Vehicle Reporting Date & Time*</p>
              <input
                //class="form-control"
                type="datetime-local"
                required
                onChange={text => (setValue({ "VEHICLEREPDATE": text.target.value }), seterror({ ...error, VEHICLEREPDATE: '' }))}
                placeholder="Please enter Vehicle Reporting Date & Time"
              />
              {error.VEHICLEREPDATE && <span class="error">{error.VEHICLEREPDATE}</span>}

            </div>
            <div className='inputFeildDesign'>
              {/* <p>Vehicle Inward Date & Time*</p>
              <input
                //class="form-control"
                type="datetime-local"
                required
                onChange={text => (setValue({ "INDATE": text.target.value }), seterror({ ...error, INDATE: '' }))}
                placeholder="Please enter Vehicle Inward Date & Time"
              />
              {error.INDATE && <span class="error">{error.INDATE}</span>} */}

            </div>
          </div>


          {/* <div className='grid-container'>
  <div className='inputFeildDesign'>
    <p>Vehicle Weight at time of Reporting*</p>
    <input
      //class="form-control"
      type="text"
      placeholder="Please enter Vehicle Weight"
    />
  </div>
 
</div> */}
        </div>

        <div className='inputFeildDesign2'>
          <p>Attach necessary Documents*</p>

          <div className='attachStyle'>
            <input
              type="file"
              style={{ display: 'none' }}
              id="file-input"
              onChange={handleFileChange}
            />

            <div className='attachButton'>
              <label htmlFor="file-input">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  startIcon={<CloudUploadIcon fontSize='large' />}
                >
                  Select File
                </Button>
              </label>
            </div>

            <div className='attachButton'>
              <div>
                {selectedFile && (
                  <p className='uploadStyle'>
                    Selected File: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className='uploadAttach'>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!selectedFile}
                  style={{ marginTop: '1rem' }}
                  onClick={handleFileUpload}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className='buttonAlign'>
        <button type="submit" className="feildBtn" onClick={() => handleSubmit()}>
          View Item Fields
        </button>
      </div>

      <div className='footerSpacing'>
        <Footer>

        </Footer>
      </div>

    </>
  )
}

export default (DetailReturnPO);