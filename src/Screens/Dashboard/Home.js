import React, { useEffect } from "react";
import Container from "../../Components/Container";
import Content from "../../Components/Content";
import Footer from "../../Components/Footer";
import "../../Stylesheet/Home.scss";
import { IconContext } from "react-icons";
import { AiOutlineRight } from "react-icons/ai";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { connect } from "react-redux";
import Header from "../../Components/Header";
import DashboardHeader from "../../Components/dashboardHeader";
function Home(props) {
  // console.log("-----", props.isAdmin)

  const [admin, setAdmin] = useState(props.isAdmin)

  // console.log("admin State",admin)
  // console.log("props -check", props.state)
  const location = useLocation();
  const navigate = useNavigate();
  // const showName = location.state?.user
  // console.log("showName",showName)
  const dashboard = true;

  const [openModel, setOpenModel] = useState(false);
  const [outwardModel, setoutwarModel] = useState(false);
  const [reportModel, setReportModel] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [outHovered, setOutHovered] = useState(false);
  const [reportHovered, setReportHovered] = useState(false);
  const [vehicleHovered, setVehicleHovered] = useState(false);
  const [button, setButton] = useState(false);
  const [inwardHover, setInwardHover] = useState(false)
  const [outwardHover, setOutwardHover] = useState(false)
  const [reportHover, setReportHover] = useState(false)
  const [vehicleHover, setVehicleHover] = useState(false)


  // console.log("openmodeeelllll", openModel)

  function openInwardsModel() {
    setOpenModel(true);
    setoutwarModel(false);
    setReportModel(false);
  }

  function openOutwardsModel() {
    setoutwarModel(true);
    setOpenModel(false);
    setReportModel(false);
  }

  function openReportModel() {
    setReportModel(true);
    setOpenModel(false);
    setoutwarModel(false);
  }
  const [showName, setShowName] = useState(() => localStorage.getItem("EMP_NAME") || "");
  // console.log("showName State",showName)
  // setName(showName)

  // console.log("localdata",localStorage.getItem("persist:root"));



  return (
    <>
      <div style={{ height: "7vh" }}>
        <DashboardHeader/>
      </div>
      <div
        style={{
          background: "radial-gradient(circle, #37A7F1, #F8F8ED)",
          position: "relative",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "row", height: "92.2vh" }}
        >
          <div
            style={{ width: "50%", height: "70%" }}
            onClick={() => {
              setReportModel(false);
              setOpenModel(false);
              setoutwarModel(false);
              setReportHover(false);
              setOutwardHover(false);
              setInwardHover(false);
              setVehicleHover(false);
            }}
          >
            <div style={{
              marginTop: "2%",
              marginLeft: "10%",
              fontSize: "100%"
            }}>
              Welcome, <span style={{ color: "#cf7414", fontWeight: "700", fontSize: "120%" }}>{showName}</span></div>
            <img
              src="../Images/HomePage_text.png"
              alt="Text"
              style={{
                height: "auto",
                width: "60%",
                marginTop: "3%",
                marginLeft: "10%",
              }}
            />

            {props.isAdmin == 2 && (
              <div style={{ marginLeft: "10%", marginTop: "5%" }}>
                <button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    background: button ? "#1D8FEF" : "#2FA5FF",
                    borderRadius: "30px",
                    padding: "8px",
                    color: "#FFFFFF",
                    paddingLeft: "7px",
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: "400",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "15px",
                    height: "5vh",
                    width: "auto",
                  }}
                  onMouseEnter={() => setButton(true)}
                  onMouseLeave={() => setButton(false)}
                  onClick={() => navigate("/AddUser")}
                >
                  {" "}
                  Create New User{" "}
                  <img
                    src="../Images/Plus_icon.png"
                    alt="plus Icon"
                    style={{ height: "auto", width: "10%" }}
                  ></img>
                </button>
              </div>
            )}
          </div>
          <div
            style={{ width: "50%", height: "70%" }}
            onClick={() => {
              setReportModel(false);
              setOpenModel(false);
              setoutwarModel(false);
              setReportHover(false);
              setOutwardHover(false);
              setVehicleHover(false);
              setInwardHover(false);
            }}
          >
            <img
              src="../Images/home.png"
              alt="Logo"
              style={{ height: "auto", width: "80%", marginLeft: "10%" }}
            />
          </div>
        </div>
        <div
          style={{
            background: "#C1CDE27D",
            width: "100vw",
            height: "32vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "60%",
            right: "2%",
            gap: "2%",
            backdropFilter: "blur(5px)",
            borderRadius: "15px",
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
          }}
        >
          <div
            style={{
              background: vehicleHovered ? "#A3C4D6" : "#0000004D",
              width: "22%",
              height: "22vh",
              display: "flex",
              borderRadius: "15px",
            }}
          // onMouseEnter={() => setVehicleHovered(true)}
          // onMouseLeave={() => setVehicleHovered(false)}
          >
            <div style={{ width: "20%", margin: "5%" }}>
              <img
                src="../Images/Vehicle_Reporting_Card.png"
                alt="Logo"
                style={{ height: "auto", width: "100%" }}
              />
            </div>
            <div
              style={{
                width: "80%",
                display: "flex",
                flexDirection: "column",
                gap: "2%",
                padding: "3%",
                paddingTop: "4%",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  color: "#FFFFFF",
                  fontWeight: "700",
                  fontFamily: "Roboto, sans-serif",
                  height: "20%",
                }}
              >
                Vehicle Reporting
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#E9E9E9",
                  fontWeight: "400",
                  fontFamily: "Roboto, sans-serif",
                  height: "30%",
                }}
              >
                Updates the vehicle presence.
              </div>
              <div
                style={{
                  height: "50%",
                  paddingTop: "5%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    // backgroundColor: "#b9bbbd",
                    // marginLeft: "65%",
                    // border: "none",
                    cursor: "pointer",
                    // borderRadius: "32px",
                    // padding: "2px",
                    // marginTop: "5%",
                    // transition: "background 0.3s",
                    // color: "white",
                    // width: "50px",
                    // height: "30px",
                    // fontSize: "20px",
                    // alignItems: "center",
                    // display: "flex",
                    // justifyContent: "center",
                  }}
                  onClick={() => navigate("/VehicleReport")}
                  onMouseEnter={() => setVehicleHover(true)}
                  onMouseLeave={() => setVehicleHover(false)}
                >
                  <img
                    style={{ width: "90%", height: "auto" }}
                    src={
                      vehicleHover
                        ? "../Images/Arrow_active.svg"
                        : "../Images/Arrow_inactive.svg"
                    }
                    alt="Button"
                  />

                </div>
              </div>
            </div>
          </div>
          {!admin.includes("1") && (
            <div
              style={{
                background: openModel ? "#C4DAEB" : "#0000004D",
                width: "22%",
                height: "22vh",
                display: "flex",
                borderRadius: "15px",
              }}
            >
              <div style={{ width: "20%", margin: "5%" }}>
                <img
                  src="../Images/Inward_Card.png"
                  alt="Logo"
                  style={{ height: "auto", width: "100%", cursor: "pointer" }}
                  onClick={() => { setInwardHover(false); setOpenModel(false) }}
                />
              </div>
              {openModel ? (
                <div
                  style={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "7%",
                  }}
                >
                  <div style={{ marginTop: "5%" }}>
                    <button
                      style={{
                        background: "#E78D00",
                        paddingTop: "4%",
                        paddingBottom: "4%",
                        width: "90%",
                        height: "auto",
                        border: "none",
                        borderRadius: "15px",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: "400",
                        fontFamily: "Roboto, sans-serif",
                        cursor: "pointer",
                        transition: "background 0.3s",
                      }}
                      onClick={() => navigate("/Inward/WithPO")}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#d77c00")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "#E78D00")
                      }
                    >
                      With Reference to PO/ASN
                    </button>
                  </div>
                  <div>
                    <button
                      style={{
                        background: "#E78D00",
                        paddingTop: "4%",
                        paddingBottom: "4%",
                        width: "90%",
                        height: "auto",
                        border: "none",
                        borderRadius: "15px",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: "400",
                        fontFamily: "Roboto, sans-serif",
                        cursor: "pointer",
                        transition: "background 0.3s",
                      }}
                      onClick={() => navigate("/Inward/WithoutPO")}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#d77c00")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "#E78D00")
                      }
                    >
                      Without PO/NRGP/RGP
                    </button>
                  </div>
                  <div>
                    <button
                      style={{
                        background: "#E78D00",
                        paddingTop: "4%",
                        paddingBottom: "4%",
                        width: "90%",
                        height: "auto",
                        border: "none",
                        borderRadius: "15px",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: "400",
                        fontFamily: "Roboto, sans-serif",
                        cursor: "pointer",
                        transition: "background 0.3s",
                      }}
                      onClick={() => navigate("/Inward/STO")}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#d77c00")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "#E78D00")
                      }
                    >
                      Against STO Invoice
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2%",
                    padding: "3%",
                    paddingTop: "4%",
                  }}
                >
                  <div
                    style={{
                      fontSize: "100%",
                      color: "#FFFFFF",
                      fontWeight: "700",
                      fontFamily: "Roboto, sans-serif",
                      height: "20%",
                    }}
                  >
                    Inward Gate Entry
                  </div>
                  <div
                    style={{
                      fontSize: "80%",
                      color: "#E9E9E9",
                      fontWeight: "400",
                      fontFamily: "Roboto, sans-serif",
                      height: "30%",
                    }}
                  >
                    Track the entry of goods into the premises.
                  </div>
                  <div style={{ height: "50%", paddingTop: "5%" }}>
                    <div
                      style={{
                        display: "flex",
                        textAlign: "right",
                        // justifyContent:"flex-end",
                        // width: "95%",
                        // fontSize: "11.5px",
                        // borderRadius: "15px",
                        // padding: "7.5px",
                        // backgroundColor: "#b9bbbd",
                        // color: "#f7ffff",
                        // border: "none",
                        // gap: "8%",
                        // alignItems: "center",
                        cursor: "pointer",
                        marginLeft: "-5%",
                        // fontFamily: "Roboto, sans-serif",
                        // transition: "background 0.3s",
                      }}
                      // {isAdmin}
                      onClick={() => { { openInwardsModel(); setOutwardHover(false); setReportHover(false); setVehicleHover(false); } }}
                      onMouseEnter={() => setInwardHover(true)}
                      onMouseLeave={() => setInwardHover(false)}
                    >
                      <img
                        style={{ width: "95%", height: "auto" }}
                        src={
                          inwardHover
                            ? "../Images/Inward_active.svg"
                            : "../Images/Inward_Inactive.svg"
                        }
                        alt="Button"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          {!admin.includes("1") && (
            <div
              style={{
                background: outHovered
                  ? "#A3C4D6"
                  : outwardModel
                    ? "#C4DAEB"
                    : "#0000004D",
                width: "22%",
                height: "22vh",
                display: "flex",
                borderRadius: "15px",
              }}
            // onMouseEnter={() => setOutHovered(true)}
            // onMouseLeave={() => setOutHovered(false)}
            >
              <div style={{ width: "20%", margin: "5%" }}>
                <img
                  src="../Images/Outward_Card.png"
                  alt="Logo"
                  style={{ height: "auto", width: "100%", cursor: "pointer" }}
                  onClick={() => { setoutwarModel(false); setOutwardHover(false) }}
                />
              </div>

              {outwardModel ? (
                <div
                  style={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "7%",
                  }}
                >
                  <div style={{ marginTop: "5%" }}>
                    <button
                      style={{
                        background: "#27B543",
                        paddingTop: "4%",
                        paddingBottom: "4%",
                        width: "90%",
                        height: "auto",
                        border: "none",
                        borderRadius: "15px",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: "400",
                        fontFamily: "Roboto, sans-serif",
                        cursor: "pointer",
                        transition: "background 0.3s",
                      }}
                      onClick={() => navigate("/Outward/NRGP")}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#1f9537")
                      } // Darker green on hover
                      onMouseLeave={(e) =>
                        (e.target.style.background = "#27B543")
                      } // Original green
                    >
                      Invoice Challan
                    </button>
                  </div>
                  <div>
                    <button
                      style={{
                        background: "#27B543",
                        paddingTop: "4%",
                        paddingBottom: "4%",
                        width: "90%",
                        height: "auto",
                        border: "none",
                        borderRadius: "15px",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: "400",
                        fontFamily: "Roboto, sans-serif",
                        cursor: "pointer",
                        transition: "background 0.3s",
                      }}
                      onClick={() => navigate("/Outward/STO")}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#1f9537")
                      } // Darker green on hover
                      onMouseLeave={(e) =>
                        (e.target.style.background = "#27B543")
                      } // Original green
                    >
                      With Return PO
                    </button>
                  </div>
                  <div>
                    <button
                      style={{
                        background: "#27B543",
                        paddingTop: "4%",
                        paddingBottom: "4%",
                        width: "90%",
                        height: "auto",
                        border: "none",
                        borderRadius: "15px",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: "400",
                        fontFamily: "Roboto, sans-serif",
                        cursor: "pointer",
                        transition: "background 0.3s",
                      }}
                      onClick={() => navigate("/Outward/RGP-RFA-Issue")}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#1f9537")
                      } // Darker green on hover
                      onMouseLeave={(e) =>
                        (e.target.style.background = "#27B543")
                      } // Original green
                    >
                      RGP/NRGP
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2%",
                    padding: "3%",
                    paddingTop: "4%",
                  }}
                >
                  <div
                    style={{
                      fontSize: "100%",
                      color: "#FFFFFF",
                      fontWeight: "700",
                      fontFamily: "Roboto, sans-serif",
                      height: "20%",
                    }}
                  >
                    Outward Gate Entry
                  </div>
                  <div
                    style={{
                      fontSize: "80%",
                      color: "#E9E9E9",
                      fontWeight: "400",
                      fontFamily: "Roboto, sans-serif",
                      height: "30%",
                    }}
                  >
                    Track the exit of goods from the premises.
                  </div>
                  <div style={{ height: "50%", paddingTop: "5%" }}>
                    <div
                      style={{
                        display: "flex",
                        textAlign: "right",
                        // justifyContent:"flex-end",
                        // width: "95%",
                        // fontSize: "11.5px",
                        // borderRadius: "15px",
                        // padding: "7.5px",
                        // backgroundColor: "#b9bbbd",
                        // color: "#f7ffff",
                        // border: "none",
                        // gap: "8%",
                        // alignItems: "center",
                        cursor: "pointer",
                        marginLeft: "-5%",
                        // fontFamily: "Roboto, sans-serif",
                        // transition: "background 0.3s",
                      }}
                      // onClick={openOutwardsModel}
                      onClick={() => { { openOutwardsModel(); setInwardHover(false); setReportHover(false); setVehicleHover(false); } }}
                      onMouseEnter={() => setOutwardHover(true)}
                      onMouseLeave={() => setOutwardHover(false)}
                    >
                      <img
                        style={{ width: "95%", height: "auto" }}
                        src={
                          outwardHover
                            ? "../Images/Outward_active.svg"
                            : "../Images/Outward_Inactive.svg"
                        }
                        alt="Button"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          <div
            style={{
              background: reportHovered
                ? "#A3C4D6"
                : reportModel
                  ? "#C4DAEB"
                  : "#0000004D",
              width: "22%",
              height: "22vh",
              display: "flex",
              borderRadius: "15px",
            }}
          >
            <div style={{ width: "20%", margin: "5%" }}>
              <img
                src="../Images/Report_icon.png"
                alt="Logo"
                style={{ height: "auto", width: "100%", cursor: "pointer" }}
                onClick={() => { setReportHover(false); setReportModel(false) }}
              />
            </div>

            {reportModel ? (
              <div
                style={{
                  width: "80%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "7%",
                }}
              >
                <div style={{ marginTop: "16%" }}>
                  <button
                    style={{
                      background: "#2096ED",
                      paddingTop: "4%",
                      paddingBottom: "4%",
                      width: "90%",
                      height: "auto",
                      border: "none",
                      borderRadius: "15px",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: "400",
                      fontFamily: "Roboto, sans-serif",
                      cursor: "pointer",
                      transition: "background 0.3s",
                    }}
                    onClick={() => navigate("/Reports/Register")}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "#1b7cc3")
                    } // Darker blue on hover
                    onMouseLeave={(e) =>
                      (e.target.style.background = "#2096ED")
                    } // Original blue
                  >
                    Gate Pass Register
                  </button>
                </div>
                <div>
                  <button
                    style={{
                      background: "#2096ED",
                      paddingTop: "4%",
                      paddingBottom: "4%",
                      width: "90%",
                      height: "auto",
                      border: "none",
                      borderRadius: "15px",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: "400",
                      fontFamily: "Roboto, sans-serif",
                      cursor: "pointer",
                      // transition: "background 0.3s",
                    }}
                    onClick={() => navigate("/Reports/ChangeLog")}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "#1b7cc3")
                    } // Darker blue on hover
                    onMouseLeave={(e) =>
                      (e.target.style.background = "#2096ED")
                    } // Original blue
                  >
                    Change Log
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: "80%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2%",
                  padding: "3%",
                  paddingTop: "4%",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontFamily: "Roboto, sans-serif",
                    height: "20%",
                  }}
                >
                  Reports Section
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#E9E9E9",
                    fontWeight: "400",
                    fontFamily: "Roboto, sans-serif",
                    height: "30%",
                  }}
                >
                  Information about Inward/Outward material on gate and change
                  logs.
                </div>
                <div
                  style={{
                    alignItems: "right",
                    height: "50%",
                    paddingTop: "5%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      textAlign: "right",
                      justifyContent: "flex-end",
                      // width: "95%",
                      // fontSize: "11.5px",
                      // borderRadius: "15px",
                      // padding: "7.5px",
                      // backgroundColor: "#b9bbbd",
                      // color: "#f7ffff",
                      // border: "none",
                      // gap: "8%",
                      // alignItems: "center",
                      // cursor: "pointer",
                      marginRight: "5%"
                      // marginLeft: "-5%",
                      // fontFamily: "Roboto, sans-serif",
                      // transition: "background 0.3s",
                    }}
                  // onClick={openReportModel}

                  >
                    <img
                      style={{ width: "22%", height: "auto", cursor: "pointer" }}
                      src={
                        reportHover
                          ? "../Images/Arrow_active.svg"
                          : "../Images/Arrow_Inactive.svg"
                      }
                      alt="Button"
                      onClick={() => { { openReportModel(); setOutwardHover(false); setInwardHover(false); setVehicleHover(false); } }}
                      onMouseEnter={() => setReportHover(true)}
                      onMouseLeave={() => setReportHover(false)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
      {/* <Footer>

                  </Footer> */}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isAdmin: state.loginreducer.isAdmin,
  };
};

export default connect(mapStateToProps, {})(Home);
