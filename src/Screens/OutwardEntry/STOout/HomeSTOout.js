import React, { useState } from 'react'
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Link, redirect, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import '../../../Stylesheet/Inward.scss'
import Select from "react-select";
import { toast } from 'react-hot-toast';
import { connect } from 'react-redux';
import { outstoData } from '../../../redux/action/PoData';

const apiURL = process.env.REACT_APP_API_URL

function HomeSTOout(props) {
      const navigate = useNavigate()
      // React state to manage selected options
      const [data, setdata] = useState({
            "PO": "",
      })
      const [error, seterror] = useState({
      })
      console.log(error)
      const setValue = (val) => {
            // console.log("val", val)
            setdata({ ...data, ...val })
      }
      const handleSubmit = () => {
            let hasErr = false
            let require = ["PO"]
            let err = {
                  PO: null,
            }
            require.map((items) => {
                  if (data[items] == "" || data[items] == '' || data[items] == null) {
                        hasErr = true
                        err[items] = "This field is mandatory"
                        toast.error("Please enter Bill number")
                  }
            })
            // console.log(hasErr)
            seterror(err)
            if (!hasErr) {
                  props.outstoData({ po: data.PO }).then(response => {
                        if (response.status == 200) {
                              // console.log(response)
                              navigate('/Outward/STO/Details', { state: response.data })
                        }
                  }).catch((err) => {
                        toast.error("Please enter valid Bill number")
                  })
                  // axios.post("${apiURL}Employee/po_data",send_data).then(response=>{})
                  // navigate(`/Inward/PO/Details/${{hi:"ho"}}`)
            }
      }

      return (
            <>
                  <div className='poMain'>

                        <div className='poLogin'>

                              <div className='rightdiv'>
                                    <img src="../Images/outwardEntry.png" alt="Logo" style={{ width: "85%", height: "100%", marginLeft: 20 }} />
                              </div>

                              <div className='rightdiv'>

                                    <div className='rightIcon'>
                                          <div>
                                                <h1 className='h2'>Outward Gate Entry</h1>
                                                <h2 className='h3'>With Return PO</h2>
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
                                                <p className='Stoheading'>PO Number*</p>
                                                <input
                                                      // class="form-control"
                                                      type="text"
                                                      placeholder="Please enter PO Number Number"
                                                      style={{ padding: 10 }}
                                                      onChange={text => (setValue({ "PO": text.target.value }), seterror({ ...error, PO: '' }))}
                                                />
                                          </div>

                                          <button className="loginBtn" onClick={() => handleSubmit()}>
                                                Proceed
                                          </button>
                                    </div>
                              </div>
                        </div>

                        <div className='footerStyle'>
                              <p className='footerText' >Powered by</p>
                              <img src="../Images/Picture1.png" alt="Logo" />
                        </div>

                  </div>
            </>
      )
}

export default connect(null, { outstoData })(HomeSTOout)