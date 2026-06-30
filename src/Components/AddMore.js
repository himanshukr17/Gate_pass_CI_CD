import React, { useState } from 'react'
import '../Stylesheet/Details.scss'
import { Link, useNavigate } from "react-router-dom";

function AddMore() {

      const navigate = useNavigate()

      return (
            <>
                  <div className='InputBox1'>

                        <div className='inner'>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Material*</p>
                                          <input
                                                class="form-control"
                                                type="text"
                                                placeholder="Please enter Material"
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Material Description*</p>
                                          <input
                                                class="form-control"
                                                type="text"
                                                placeholder="Please enter Material Description"
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Plant*</p>
                                          <input
                                                class="form-control"
                                                type="text"
                                                placeholder="Please enter Plant"
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Quantity*</p>
                                          <input
                                                class="form-control"
                                                type="text"
                                                placeholder="Please enter Quantity"
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Vendor*</p>
                                          <input
                                                class="form-control"
                                                type="text"
                                                placeholder="Please enter Vendor"
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Vendor Name*</p>
                                          <input
                                                class="form-control"
                                                type="text"
                                                placeholder="Please enter Vendor Name"
                                          />
                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>District*</p>
                                          <input
                                                class="form-control"
                                                type="text"
                                                placeholder="Please enter District"
                                          />
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Billed Quantity*</p>
                                          <input
                                                class="form-control"
                                                type="text"
                                                placeholder="Please enter Billed Quantity"
                                          />
                                    </div>
                              </div>

                              {/* <div className='Reviewbutton'>
                                    <button className="ReviewbuttonStyle" onClick={() => navigate('/Inward/WithoutPO/ItemFeilds')}>
                                          View Item Fields
                                    </button>
                              </div> */}
                        </div>
                  </div>
            </>
      )
}

export default AddMore