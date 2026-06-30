import React, { useState } from 'react'
import Content from '../../Components/Content';
import Footer from '../../Components/Footer';
import '../../Stylesheet/Inward.scss'
import { IconContext } from "react-icons";
import { AiFillCaretDown, AiFillCaretRight, AiFillCaretUp } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import OutwardContainer from '../../Components/OutwardContainer';


function OutwardHome() {

      const navigate = useNavigate()
      const [detail, setDetail] = useState(false)

      return (
            <>
                  <OutwardContainer>
                  </OutwardContainer>

                  <Content>
                        <div className='headingmain'><u>Outward Gate Entry</u></div>

                        <div className='list'>
                              <div className='Sectionlist'>
                                    <p className='listHeading'>Create Outward Gate Entry</p>

                                    <div className='iconStyle' onClick={() => setDetail(!detail)}>
                                          <IconContext.Provider value={{ color: "#ffffff", size: "23px" }}>
                                                {detail === false ? <AiFillCaretDown
                                                      type="button"
                                                /> :
                                                      <AiFillCaretUp
                                                            type="button"
                                                      />
                                                }
                                          </IconContext.Provider>
                                    </div>
                              </div>
                        </div>

                        {detail && <div>
                              {/* <div className='InwardList' onClick={() => navigate('/Outward/ReturnPO')}>
                                    <p className='listText'>With return PO/Retunr Challan</p>
                              </div> */}

                              <div className='InwardList' onClick={() => navigate('/Outward/NRGP')}>
                                    <p className='listText'>Invoice/Challan</p>
                              </div>

                              <div className='InwardList' onClick={() => navigate('/Outward/STO')}>
                                    <p className='listText'>With Return PO</p>
                              </div>

                              {/* <div className='InwardList' onClick={() => navigate('/Outward/SubContractChallan')}>
                                    <p className='listText'>With Sub Contract Challan</p>
                              </div> */}

                              {/* <div className='InwardList' onClick={() => navigate('/Outward/RGP-RFA-Issue')}>
                                    <p className='listText'>Job Work</p>
                              </div> */}



                        </div>}

                        <div className='list'>
                              <div className='Sectionlist1'>
                                    <p className='listHeading'>Change Outward Gate Entry</p>
                                    <div className='iconStyle'>
                                          <IconContext.Provider value={{ color: "#ffffff", size: "23px" }}>
                                                <AiFillCaretRight
                                                      type="button"
                                                      onClick={() => navigate("/ChangeOutward")}
                                                />
                                          </IconContext.Provider>
                                    </div>
                              </div>

                              <div className='Sectionlist2'>
                                    <p className='listHeading'>Display Outward Gate Entry</p>
                                    <div className='iconStyle'>
                                          <IconContext.Provider value={{ color: "#ffffff", size: "23px" }}>
                                                <AiFillCaretRight
                                                      type="button"
                                                      onClick={() => navigate("/DisplayOutward")}
                                                />
                                          </IconContext.Provider>
                                    </div>
                              </div>
                        </div>



                  </Content>

                  <Footer>

                  </Footer>
            </>
      )
}


export default OutwardHome