import React from 'react'
import '../Stylesheet/Componentstyle.scss'
import { useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import { Logout } from '../redux/action/LoginAction';


function OutwardContainer(props) {

      const navigate = useNavigate()

      return (
            <>
                  <div className='header'>
                        <img src="../../Images/Frame.png" alt="Logo" style={{ height: 30, width: 50 }} />
                        <p className='gatepass' onClick={() => navigate("/Home")}>GatePassGo</p>

                  
                              <img src="../../Images/logout.png" className = 'logoutBtn' alt="Logo" onClick={() => props.Logout()} style={{ height: 40, width: 40, cursor: 'pointer', }} />

                       
                  </div>

                  <div>
                        <div className='images'>
                              <img src="../../Images/one.png" style={{ height: "50vh", width: "100%", position: "absolute" }} />
                              <img src="../../Images/two.png" style={{ height: "49vh", width: "100%", position: "absolute" }} />
                              <img src="../../Images/three.png" style={{ height: "48vh", width: "100%", position: "absolute" }} />
                        </div>
                        <div className='imageheader'>
                              <div className='text'>
                                    <p className='desc'>Experience the future of access control with GatePass</p>
                                    <p className='desc1'>and unlock a new level of convenience</p>
                                    <p className='desc1'>reliability, and peace of mind.</p>
                              </div>
                              <div>
                                    <img src="../../Images/four.png" style={{ position: "absolute", width: "40%", height: "40%" }} />
                                    <img src="../../Images/Outward.png" style={{ position: "absolute", width: "20%", height: "40%", marginRight: "2%" }} />
                              </div>

                        </div>
                  </div>
            </>
      )
}

export default connect(null, { Logout })(OutwardContainer)