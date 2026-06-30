import React, { useState } from 'react'
import '../Stylesheet/Componentstyle.scss'
import { useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import { Logout } from '../redux/action/LoginAction';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import newImage from "../../public/Images/Group 28.png"
function Container(props) {

      const navigate = useNavigate()
      const [logoutHovered, setLogoutHovered] = useState(false);
      // console.log("props",props.isAdmin)

     return (
                 <>
     
                       <div style={{ display: "flex", gap: "10%", justifyContent: "space-between", backgroundColor: "#FFFFFF", margin: "5px 0px" }}>
                             <div style={{ display: "flex", alignItems: "center" }}>
                                   <img src="../../Images/Frame_logo.png" alt="Logo" style={{ height: "6vh", width: "auto", marginLeft: "4vw", cursor: "pointer" }} onClick={() => {
                                         navigate("/Home")
                                   }} />
                             </div>
                             <div style={{ display: "flex", alignItems: "center", width: "26%", alignContent: "flex-end", height: "auto" }}>
                                   <div style={{ textAlign: "right", marginLeft: "45%" }}>
                                         <img
                                               src="../../Images/Logout_button.png"
                                               alt="Logo"
                                               onClick={() => props.Logout()}
                                               style={{
                                                     height: "6vh",
                                                     width: "auto",
                                                     cursor: 'pointer',
                                                     transition: "filter 0.3s ease-in-out"
                                               }}
                                               onMouseOver={(e) => e.currentTarget.style.filter = "brightness(50%)"}
                                               onMouseOut={(e) => e.currentTarget.style.filter = "brightness(100%)"}
                                         />
     
     
                                   </div>
     
                             </div>
                       </div>
     
     
                 </>
           )
}

const mapStateToProps = (state) => {
      return {
            isAdmin: state.loginreducer.isAdmin
      }
}

export default connect(mapStateToProps, { Logout })(Container)
