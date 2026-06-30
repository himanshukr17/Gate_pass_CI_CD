import React, { useState } from 'react'
import '../../../Stylesheet/Details.scss'
import Footer from '../../../Components/Footer'
import Header from '../../../Components/Header'
import { Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Link, useNavigate, useLocation } from "react-router-dom";
import CustomDivider from '../../../Components/Divider'

function DetailChange() {

      const location = useLocation()
      const previousdata = location.state
      const navigate = useNavigate()
      // console.log("previousdata", previousdata)
      
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
            "OUTDATE": "",
      })
      // console.log("data",data)
      const [error, seterror] = useState({
      })
      const setValue = (val) => {
            setdata({ ...data, ...val })
      }

      const handleSubmit = () => {
            // navigate('/ChangeInward/ItemFields', { state: data  })
            let hasErr = false
            // let require = ["OUTDATE"]
            // let err = {
            //       OUTDATE: null,
            // }
            // require.map((items) => {
            //       if (data[items] == "" || data[items] == '' || data[items] == null) {
            //             hasErr = true
            //             err[items] = "This field is mandatory"
            //       }
            // })

            // if (data.LR < 15) {
            //       err.LR = ("Minimum lenght should be 15 characters")
            // }
            // if (data.MOBILE < 10) {
            //       err.MOBILE = ("Minimum lenght should be 10 characters")
            // }
            // if (data.VEHICLENO < 9) {
            //       err.VEHICLENO = ("Minimum lenght should be 9 characters")
            // }
            // seterror(err)
            if (!hasErr) {
                  navigate('/ChangeInward/ItemFields', { state: { previousdata, data } })
            }
      }

      // console.log("+++++", previousdata);


      return (
            <>

                  <Header></Header>

                  <div className='headinggg'>
                        <div className='headingStyle'>
                             <Link to="/Home" style={{ color: 'black' }}><p>Inward Gate Entry </p></Link>
                              <p className='po'> - Change Inward Gate Entry</p>
                        </div>

                        {/* <Link to="/ChangeInward/ItemFields" style={{ color: 'black' }}><p className='po' >View Item Feilds</p></Link> */}
                  </div>

                  <div className='InputBox'>
                        <div className='entryHead'>
                              <p>Gate Entry Number - </p>
                              <p className='po'>{previousdata[0].GATE_ENTRY_NO}</p>
                        </div>

                        <div className='dividerStyle'>
                              <CustomDivider color="#1897CE" thickness="0.8vh" />
                        </div>

                        <div className='inner'>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Invoice Number</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Invoice Number"
                                                disabled
                                                value={previousdata[0].Entry_Details[0].PO_NO
                                                }
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Document Date</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Document Date"
                                                disabled
                                                value={new Date(previousdata[0].DOCUMENT_DATE).toDateString()}
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Packages</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter number of Packages"
                                                disabled
                                                value={previousdata[0].PACKAGES}
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Transporter Vendor name</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Transporter Vendor name"
                                                disabled
                                                value={previousdata[0].VENDOR_NAME}
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p className='Text'> Transporter Driver name</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Transporter Driver name"
                                                disabled
                                                value={previousdata[0].DRIVER_NAME}
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Transporter Driver Mobile No.</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Transporter Driver Mobile No."
                                                disabled
                                                value={previousdata[0].MOBILE_NUMBER}
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Mode of Transport</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Mode of Transport"
                                                disabled
                                                value={previousdata[0].MODE_OF_TRANSPORT}
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Vehicle Number</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Vehicle Number"
                                                disabled
                                                value={previousdata[0].VEHICLE_NO}
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Vehicle Category</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Vehicle Category"
                                                disabled
                                                value={previousdata[0].VEHICLE_CATEGORY}
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Road permit number</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Road permit number"
                                                disabled
                                                value={previousdata[0].ROAD_PERMIT_NUMBER}
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>LR Number</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter LR Number"
                                                disabled
                                                value={previousdata[0].LR_NO}
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>LR Date</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter LR Date"
                                                disabled
                                                value={new Date(previousdata[0].LR_DATE).toDateString()}
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Vehicle Reporting Date & Time</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Vehicle Reporting Date & Time"
                                                disabled
                                                value={new Date(previousdata[0].REPORTING_DATETIME).toDateString() + " , " + previousdata[0].REPORTING_DATETIME.split("T")[1].split(":")[0] + ":" + previousdata[0].REPORTING_DATETIME.split("T")[1].split(":")[1]}
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Vehicle Inward Date & Time</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Vehicle Inward Date & Time"
                                                disabled
                                                value={new Date(previousdata[0].INWARD_DATETIME).toDateString() + " , " + previousdata[0].INWARD_DATETIME.split("T")[1].split(":")[0] + ":" + previousdata[0].INWARD_DATETIME.split("T")[1].split(":")[1]}
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>

                              <div className='inputFeildDesign'>
                                          <p>Vehicle Outward Date & Time*</p>
                                          <input
                                                //class="form-control"
                                                type="datetime-local"
                                                // required
                                                min={new Date(previousdata[0].INWARD_DATETIME).toISOString().split(".")[0]}
                                                placeholder="Please enter Vehicle Outward Date & Time"
                                                onChange={text => (setValue({ "OUTDATE": text.target.value }), seterror({ ...error, OUTDATE: '' }))}

                                          />
                                          {error.OUTDATE && <span class="error">{error.OUTDATE}</span>}

                                    </div>




                                    <div className='inputFeildDesign'>
                                          {/* <p>Vehicle Inward Date & Time</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Vehicle Inward Date & Time"
                                                disabled
                                                value={new Date(previousdata[0].INWARD_DATETIME).toDateString() + " , " + previousdata[0].INWARD_DATETIME.split("T")[1].split(":")[0] + ":" + previousdata[0].INWARD_DATETIME.split("T")[1].split(":")[1]}
                                          /> */}
                                    </div>
                              </div>

                        </div>

                        {/* <div className='inputFeildDesign2'>
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
                        </div> */}

                  </div>

                  <div className='buttonAlign'>
                        <button className="feildBtn" onClick={() => handleSubmit()}>
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

export default DetailChange