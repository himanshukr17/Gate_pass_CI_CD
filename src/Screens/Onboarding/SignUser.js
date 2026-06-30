import React, { useMemo, useEffect, useState } from 'react'
import '../../Stylesheet/Details.scss'
import { useTable } from 'react-table'
import Header from '../../Components/Header'
import CustomDivider from '../../Components/Divider'
import Footer from '../../Components/Footer'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SignupData } from '../../redux/action/Signup'
import { connect } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast';

const apiURL = process.env.REACT_APP_API_URL

function SignUser(props) {

      const navigate = useNavigate()

      const [data, setdata] = useState({
            "NAME": "",
            // "CODE": "",
            "MOB": "",
            "MAIL": "",
            "PLANT": "",
            "USER": "",
            // "PASS": "",
            // "CONFIRM": "",

      })
      const [error, seterror] = useState({
      })
      const setValue = (val) => {
            setdata({ ...data, ...val })
      }
      // console.log("logggg--->",email,pass)

      const [plantList, setPlantList] = useState([{ 'name': '', 'id': '' }]);
      const [plantName, setPlantName] = useState()

      useEffect(() => {
            const fetchData = async () => {
                  const response = await fetch(`${apiURL}Employee/plant`)

                  const newData = await response.json();
                  setPlantList(newData);

                  // console.log(newData)
            }
            fetchData();
      }, [])

      const handleChange = (event) => (setPlantName(event.target.value), setValue({ PLANT: event.target.value }))

      const handleSubmit = (email, pass) => {

            let hasErr = false
            let require = ["NAME", "MOB", "MAIL", "PLANT", "USER"]
            let err = {
                  NAME: null,
                  MOB: null,
                  MAIL: null,
                  PLANT: null,
                  USER: null,

            }
            require.map((items) => {
                  if (data[items] == "" || data[items] == '' || data[items] == null) {
                        hasErr = true
                        err[items] = "This field is mandatory"
                  }
            })
            seterror(err)

            if (!hasErr) {
                  // navigate('/Home')

                  props.SignupData(data, props.EmpId).then(res => {
                        if (res.status == 200) {

                              navigate('/Home')

                              toast.success(`User Created successfully.`)
                              // console.log("User Created successful")

                        }
                  }
                  ).catch((err) => {
                        console.log(err)
                        toast.error(`Unable to create new User, Please try again later!`)
                        // console.log("Unable to create new User, Please try again later!")
                  })
            }
      }

      return (
            <>
                  <Header></Header>

                  <div className='headinggg'>
                        <div className='headingStyle'>
                              <Link to="/Home" style={{ color: 'black' }}><p>Home - </p></Link>
                              <p className='po'>Sign Up</p>
                        </div>
                        {/* <Link to="/Signup/ActiveUser" style={{ color: 'black' }}><p className='po' >View Active Users</p></Link> */}

                  </div>

                  <div className='InputBox'>

                        <div className='inner'>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Name of User*</p>
                                          <input
                                                type="text"
                                                placeholder="Name of Employee"
                                                required
                                                onChange={text => (setValue({ "NAME": text.target.value }), seterror({ ...error, NAME: '' }))}

                                          />
                                          {error.NAME && <span class="error">{error.NAME}</span>}
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Mobile Number*</p>
                                          <input
                                                type="text"
                                                placeholder="Please enter Mobile Number"
                                                required
                                                maxLength={10}
                                                onChange={text => (setValue({ "MOB": text.target.value }), seterror({ ...error, MOB: '' }))}

                                          />
                                          {error.MOB && <span class="error">{error.MOB}</span>}
                                    </div>

                                    {/* <div className='inputFeildDesign'>
                                          <p>Employee Code*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Employee Code"
                                                required
                                                onChange={text => (setValue({ "CODE": text.target.value }), seterror({ ...error, CODE: '' }))}

                                          />
                                          {error.CODE && <span class="error">{error.CODE}</span>}

                                    </div> */}
                              </div>

                              <div className='grid-container'>

                                    <div className='inputFeildDesign'>
                                          <p>Email Id*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Email Id"
                                                required
                                                onChange={text => (setValue({ "MAIL": text.target.value }), seterror({ ...error, MAIL: '' }))}

                                          />
                                          {error.MAIL && <span class="error">{error.MAIL}</span>}

                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Username*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Username"
                                                required
                                                onChange={text => (setValue({ "USER": text.target.value }), seterror({ ...error, USER: '' }))}

                                          />
                                          {error.USER && <span class="error">{error.USER}</span>}

                                    </div>
                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Plant*</p>
                                          <div className="dropdown-mot">
                                                <select className='dropdown-mot' value={plantName} onChange={handleChange}>
                                                      <option value={""}>Please select Plant</option>

                                                      {plantList.map((plant) => {
                                                            return (
                                                                  <option key={plant.PLANT_ID} value={plant.PLANT_ID}>{plant.PLANT_ID} ({plant.PLANT_NAME})</option>
                                                            );
                                                      })}
                                                </select>
                                          </div>
                                          {/* {error.PLANT && <span class="error">{error.PLANT}</span>} */}
                                    </div>

                                    <div className='inputFeildDesign'>
                                          {/* <p>Username*</p>
                                          <input
                                                //class="form-control"
                                                type="text"
                                                placeholder="Please enter Username"
                                                required
                                                onChange={text => (setValue({ "USER": text.target.value }), seterror({ ...error, USER: '' }))}

                                          />
                                          {error.USER && <span class="error">{error.USER}</span>} */}

                                    </div>
                              </div>

                              {/* <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Password*</p>
                                          <input
                                                type="text"
                                                placeholder="Please enter Password"
                                                required
                                                onChange={text => (setValue({ "PASS": text.target.value }), seterror({ ...error, PASS: '' }))}

                                          />
                                          {error.PASS && <span class="error">{error.PASS}</span>}
                                    </div>

                                    <div className='inputFeildDesign'>
                                          <p>Confirm Password*</p>
                                          <input
                                                type="text"
                                                placeholder="Please enter Password"
                                                required
                                                onChange={text => (setValue({ "CONFIRM": text.target.value }), seterror({ ...error, CONFIRM: '' }))}

                                          />
                                          {error.CONFIRM && <span class="error">{error.CONFIRM}</span>}
                                    </div>
                              </div> */}


                        </div>

                  </div>

                  <div className='buttonAlign'>
                        <button type="submit" className="feildBtn" onClick={() => handleSubmit()}>
                              Submit
                        </button>
                  </div>

                  <div className='footerSpacing'>
                        <Footer>

                        </Footer>
                  </div>

            </>
      )
}

const mapStateToProps = (state) => {
      return {
            EmpId: state.loginreducer.details
      }
}

export default connect(mapStateToProps, { SignupData })(SignUser);