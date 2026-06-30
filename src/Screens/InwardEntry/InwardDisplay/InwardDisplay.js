import React, { useState } from 'react'
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import '../../../Stylesheet/Inward.scss'
import { connect } from 'react-redux';
import { GetEntry } from '../../../redux/action/Entry';
import { useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';



function InwardDisplay(props) {

  const navigate = useNavigate()
  const [data, setdata] = useState([])
  const [id, setid] = useState("")
  const [error, seterror] = useState({
  })
  useEffect(() => {
    props.GetEntry(props.EmpId).then(res => setdata(res)).catch((err) => console.log(err))
  }, [])
  // console.log('====================================');
  // console.log("--------",data);
  // console.log('====================================');
  const handleSubmit = () => {
    // let hasErr = false
    // let require = ["GATE"]
    // let err = {
    //       GATE: "",
    // }
    // require.map((items) => {
    // if (data[items] == "" || data[items] == '' || data[items] == null) {
    // hasErr = true
    // err[items] = "This field is mandatory"
    // }
    // })

    // seterror(err)
    // if (!hasErr) {
    const filter = (data.filter(items => {
      return (items.GATE_ENTRY_NO.toString().toLowerCase() == id.toLowerCase() && (items.TYPE == 1 || items.TYPE == 2 || items.TYPE == 3))
    })
    )

    if (filter.length > 0) {
      // console.log(filter)
      navigate('/DisplayInward/Detail', { state: filter })
    }
    else {
      toast.error('Please enter valid gate number')
    }
  }

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
                <h1 className='h2'>Display Inward Entry</h1>
                <h2 className='h3'>Against all catogories</h2>
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
                <p className='Stoheading'>Gate Pass Number</p>
                <input
                  // class="form-control"
                  type="text"
                  placeholder="Please enter Gate Pass Number"
                  onChange={text => setid(text.target.value)}
                  style={{ padding: 10 }}
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
          <img src="../Images/Picture1.png" alt="Logo" className='footerlogo' />
        </div>

      </div>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    EmpId: state.loginreducer.details,
    // entryData: state.entryReducer.entryData
  }
}


export default connect(mapStateToProps, { GetEntry })(InwardDisplay)

