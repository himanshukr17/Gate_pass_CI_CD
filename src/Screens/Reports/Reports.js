import React, { useState } from 'react'
import { AiOutlineCloseCircle, AiOutlineDoubleRight } from "react-icons/ai";
import { Link, redirect, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import '../../Stylesheet/Inward.scss'

function Reports() {
  const navigate = useNavigate()
  // React state to manage selected options
  // const [selectedOptions, setSelectedOptions] = useState();

  // function handleSelect(data) {
  //   setSelectedOptions(data);
  // }

  // const [selectedOption, setSelectedOption] = useState('');

  // const handleOptionChange = (event) => {
  //   setSelectedOption(event.target.value);
  // };

  return (
    <>
      <div className='poMain'>

        <div className='poLogin'>

          <div className='rightdiv'>
            <img src="../Images/reports.png" alt="Logo" style={{ width: "100%", height: "100%" }} />
          </div>

          <div className='rightdiv'>

            <div className='rightIcon'>
              <div>
                <h1 className='h2'>Reports Section</h1>
                <h2 className='h3'>Please select below!</h2>
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

            <div className="inputsSTO">

              <div className='grid-container'>

                <div className='reportOption' onClick={() => navigate("/Reports/Register")}>

                  <div>
                    <p className='reportText'>Gate Pass Register</p>
                  </div>

                  <div className='reportIcon'>
                    <IconContext.Provider value={{ color: "#ffffff", size: "20px" }}>
                      <AiOutlineDoubleRight
                        type="button"
                      // onClick={() => navigate("/Outward")}
                      />
                    </IconContext.Provider>
                  </div>

                </div>

                <div className='reportOption' onClick={() => navigate("/Reports/ChangeLog")}>

                  <div>
                    <p className='reportText1'>Change Log</p>
                  </div>

                  <div className='reportIcon'>
                    <IconContext.Provider value={{ color: "#ffffff", size: "20px" }}>
                      <AiOutlineDoubleRight
                        type="button"
                      // onClick={() => navigate("/Outward")}
                      />
                    </IconContext.Provider>
                  </div>

                </div>

              </div>

              {/* <button className="loginBtn" style={{marginLeft:"20%"}} onClick={() => navigate('/Outward/RGP-RFA-Issue/Details')}>
                Proceed
              </button> */}
            </div>
          </div>
        </div>

        <div className='footerStyle'>
          <p className='footerText' >Powered by</p>
          <img src="../Images/Picture1.png" alt="Logo" />
        </div>

      </div>

      {/* <div className='footerSpacing'>
        <Footer>

        </Footer>
      </div> */}
    </>
  )
}

export default Reports