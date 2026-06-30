import React, { useState } from 'react'
import '../../../Stylesheet/Details.scss'
import Footer from '../../../Components/Footer'
import Header from '../../../Components/Header'
import { Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Link, useNavigate } from "react-router-dom";
import CustomDivider from '../../../Components/Divider'

function DetailRGP() {

      const navigate = useNavigate()

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


      return (
            <>

                  <Header></Header>

                  <div className='headinggg'>
                        <div className='headingStyle'>
                             <Link to="/Home" style={{ color: 'black' }}><p>Inward Gate Entry - </p></Link>
                              <p className='po'>With RGP/PFA Number</p>
                        </div>

                        <Link to="/Inward/RGP/ItemFeildRGP" style={{ color: 'black' }}><p className='po' >View Item Feilds</p></Link>
                  </div>

                  <div className='InputBox'>
                        <div className='refNumber'>
                              <div>
                                    <div className='entryHead'>
                                          <p>Gate Entry Number - </p>
                                          <p className='po'>I526</p>
                                    </div>

                                    <div className='dividerStyle'>
                                          <CustomDivider color="#1897CE" thickness="0.8vh" />
                                    </div>
                              </div>

                              <div>
                                    <div className='entryHead'>
                                          <p>RGP/NRGP Number - </p>
                                          <p className='po'>71973949</p>
                                    </div>

                                    <div className='dividerStyle'>
                                          <CustomDivider color="#1897CE" thickness="0.8vh" />
                                    </div>
                              </div>
                        </div>

                        <div className='inner'>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Invoice Number*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Invoice Number"
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Document Date*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Document Date"
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Packages*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter number of Packages"
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Transporter Vendor name*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Transporter Vendor name"
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p className='Text'> Transporter Driver name*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Transporter Driver name"
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Transporter Driver Mobile No.*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Transporter Driver Mobile No."
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Mode of Transport*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Mode of Transport"
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Vehicle Number*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Vehicle Number"
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Vehicle Category*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Vehicle Category"
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>EWay Bill No.</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Road permit number"
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>LR Number*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter LR Number"
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>LR Date*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter LR Date"
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Vehicle Reporting Date & Time*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Vehicle Reporting Date & Time"
                                          />
                                    </div>
                                    <div className='inputFeildDesign'>
                                          <p>Vehicle Inward Date & Time*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Vehicle Inward Date & Time"
                                          />
                                    </div>
                              </div>


                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Vehicle Weight at time of Reporting*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Vehicle Weight"
                                          />
                                    </div>
                                    <div className='inputFeildDesign'>
                                          {/* <p>Vehicle Weight at time of Reporting*</p>
            <input
              //class="form-control"
              type="text"
              placeholder="Please enter Vehicle Weight"
            /> */}
                                    </div>
                              </div>
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
                        <button className="feildBtn" onClick={() => navigate('/Inward/RGP/ItemFeildRGP')}>
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

export default DetailRGP