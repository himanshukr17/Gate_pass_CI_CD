import React, { useState } from 'react';
import '../Stylesheet/Componentstyle.scss';
import { useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import { Logout } from '../redux/action/LoginAction';

function Header(props) {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Toggle modal visibility
    const handleProfileClick = () => {
        setIsModalOpen((prev) => !prev);
    };

    return (
        <>
            <div style={{ display: "flex", gap: "10%", justifyContent: "space-between", backgroundColor: "#FFFFFF", margin: "5px 0px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src="../../Images/Frame_logo.png"
                        alt="Logo"
                        style={{ height: "6vh", width: "auto", marginLeft: "4vw", cursor: "pointer" }}
                        onClick={() => navigate("/Home")}
                    />
                </div>

                <div style={{ display: "flex", alignItems: "center", width: "26%", alignContent: "flex-end", height: "auto" }}>
                    <div style={{ textAlign: "right", marginLeft: "45%" }}>
                        <img
                            src="../../Images/Logout_button.png"
                            alt="Logout"
                            onClick={() => {
                                navigate("/");
                                localStorage.removeItem("persist:root");
                            }}
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

                    <div style={{ marginLeft: "2%", position: "relative" }}>
                        <img
                            src='../../Images/profile.png'
                            alt="Profile"
                            style={{
                                height: "6vh",
                                width: "auto",
                                cursor: 'pointer',
                                transition: "filter 0.3s ease-in-out"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.filter = "brightness(50%)"}
                            onMouseOut={(e) => e.currentTarget.style.filter = "brightness(100%)"}
                            onClick={handleProfileClick}
                        />

                        {/* Modal toggle dropdown */}
                        {isModalOpen && (
                            <div style={{
                                position: "absolute",
                                top: "110%",
                                right: 0,
                                backgroundColor: "#000000",
                                color: "white",
                                padding: "0.8rem 1rem",
                                borderRadius: "8px",
                                zIndex: 1000,
                                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                                width: "200px",
                                cursor: "pointer"
                            }}
                                onClick={() => {
                                    setIsModalOpen(false);
                                    navigate("/ChangePassword"); // Navigate or trigger change password logic
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#052940"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#0F4C75"}
                            >
                                <span style={{ display: "flex", justifyContent: "center" }}>

                                    Change Password
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default connect(null, { Logout })(Header);
