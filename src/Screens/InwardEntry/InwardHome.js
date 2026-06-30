import React, { useState } from 'react'
import Container from '../../Components/Container';
import Content from '../../Components/Content';
import Footer from '../../Components/Footer';
import '../../Stylesheet/Inward.scss'
import { IconContext } from "react-icons";
import { AiFillCaretDown, AiFillCaretRight, AiFillCaretUp } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import OutwardContainer from '../../Components/OutwardContainer';

function InwardHome() {

      const navigate = useNavigate()
      const [detail, setDetail] = useState(false)

      return (
            <>
                  {/* <Container>
                  </Container> */}
                  <OutwardContainer>
                        
                  </OutwardContainer>

                  <Content>
                        <div className='headingmain'><u>Inward Gate Entry</u></div>

                        <div className='list'>
                              <div className='Sectionlist'>
                                    <p className='listHeading'>Create Inward Gate Entry</p>

                                    <div className='iconStyle' onClick={() => setDetail(!detail)}>
                                          <IconContext.Provider value={{ color: "#ffffff", size: "23px" }}>
                                                {detail == false ? <AiFillCaretDown
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
                              <div className='InwardList' onClick={() => navigate('/Inward/WithPO')}>
                                    <p className='listText'>With reference to PO</p>
                              </div>

                              <div className='InwardList' onClick={() => navigate('/Inward/WithoutPO')}>
                                    <p className='listText'>Without PO/NRGP</p>
                              </div>

                              <div className='InwardList' onClick={() => navigate('/Inward/STO')}>
                                    <p className='listText'>Against STO Invoice</p>
                              </div>

                              {/* <div className='InwardList' onClick={() => navigate('/Inward/RGP')}>
                                    <p className='listText'>Against RGP/RFA - Receive</p>
                              </div> */}

                        </div>}
                        
                        <div className='list'>
                              <div className='Sectionlist1'>
                                    <p className='listHeading'>Change Inward Gate Entry</p>
                                    <div className='iconStyle'>
                                          <IconContext.Provider value={{ color: "#ffffff", size: "23px" }}>
                                                <AiFillCaretRight
                                                      type="button"
                                                      onClick={() => navigate("/ChangeInward")}
                                                />
                                          </IconContext.Provider>
                                    </div>
                              </div>

                              <div className='Sectionlist2'>
                                    <p className='listHeading'>Display Inward Gate Entry</p>
                                    <div className='iconStyle'>
                                          <IconContext.Provider value={{ color: "#ffffff", size: "23px" }}>
                                                <AiFillCaretRight
                                                      type="button"
                                                      onClick={() => navigate("/DisplayInward")}
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

export default (InwardHome)
