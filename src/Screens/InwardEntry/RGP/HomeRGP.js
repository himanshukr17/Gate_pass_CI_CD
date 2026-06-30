import React, { useState } from 'react'
import { AiFillCaretDown, AiFillCaretRight, AiFillCaretUp, AiOutlineCloseCircle } from "react-icons/ai";
import { Link, redirect, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import '../../../Stylesheet/Inward.scss'
function HomeRGP() {
      const navigate = useNavigate()

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
                                          <h2 className='h3'>Against RGP/RFA /Document Number</h2>
                                    </div>

                                    <div className='closeIcon'>
                                          <IconContext.Provider value={{ color: "#f10f0f", size: "20px" }}>
                                                <AiOutlineCloseCircle
                                                      type="button"
                                                      onClick={() => navigate("/Inward")}
                                                />
                                          </IconContext.Provider>
                                    </div>
                              </div>

                              <div className="inputsSTO">

                                    <div className='grid-container'>
                                          <p className='Stoheading'>RGP/RFA /Document Number</p>
                                          <input
                                                // class="form-control"
                                                type="text"
                                                placeholder="Please enter Bill Number"
                                                style={{ padding: 10 }}
                                          />
                                    </div>

                                    <button className="loginBtn" onClick={() => navigate('/Inward/RGP/DetailRGP')}>
                                          Proceed
                                    </button>
                              </div>
                        </div>
                  </div>

                  <div className='footerStyle'>
                        <p className='footerText' >Powered by</p>
                        <img src="../Images/Picture1.png" alt="Logo" className='footerlogo' />
                  </div>

            </div>
      </>
      )
}



export default HomeRGP