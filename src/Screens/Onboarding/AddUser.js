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
import Select from 'react-select';
import Container from '../../Components/Container'

const apiURL = process.env.REACT_APP_API_URL

function AddUser(props) {

      const navigate = useNavigate()

      const roleOptions = [
            { label: "Admin", value: "2" },
            { label: "Plant", value: "3" },
            { label: "Security", value: "1" },
            { label: "Reviewer", value: "4" }
      ];

      const [data, setdata] = useState({
            "NAME": "",
            "MOB": "",
            "MAIL": "",
            "PLANT": [],
            "ROLE": [] // Added ROLE to the state
      })

      

      console.log("data",data)
      const [selectedOptions, setSelectedOptions] = useState([]);
      const handleSelectChange = (selected, { name }) => {
            const selectedValues = selected ? selected.map((item) => item.value) : [];
            setdata((prevData) => ({
                  ...prevData,
                  [name]: selectedValues, // Update the PLANT field in the `data` state
            }));
            setSelectedOptions(selected); // Update the selected options for display
      };
      const [error, seterror] = useState({
      })
      const setValue = (val) => {
            setdata({ ...data, ...val })
      }
      // console.log("logggg--->",email,pass)

      const [plantList, setPlantList] = useState([{ 'name': '', 'id': '' }]);
      const [plantOptions, setPlantOptions] = useState([])
      const [plantName, setPlantName] = useState()
      const [plantHover, setPlantHover] = useState(false)

      useEffect(() => {
            // console.log("inside api")
            const fetchData = async () => {
                  const response = await fetch(`${apiURL}Employee/plant`)

                  const newData = await response.json();
                  const transformedData = newData.map((item) => ({
                        label: `${item.PLANT_DESCRIPTION}-${item.PLANT_ID}`,
                        value: item.PLANT_ID,
                  }));
                  setPlantOptions(transformedData)
                  setPlantList(newData);
                  console.log("plants", plantOptions)


                  // console.log(newData)
            }
            fetchData();
      }, [])

      // console.log("plantList", plantList)

      const handleChange = (event) => (setPlantName(event.target.value), setValue({ PLANT: event.target.value }))


      const handleSubmit = (email, pass) => {

            let hasErr = false
            let require = ["NAME", "MOB", "MAIL", "PLANT"]
            let err = {
                  NAME: null,
                  MOB: null,
                  MAIL: null,
                  PLANT: null,
                  ROLE: null

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
                        // console.log("in then",res)
                        if (res.status == 200) {

                              navigate('/Home')

                              toast.success(`${res.data} Created Succesfully.`);
                              // console.log("User Created successfully")

                        }

                        else if (res.status == 406) {
                              //     console.log("errormsg",res.data)
                              toast.error(`${res.data}`);

                        }
                  }
                  ).catch((err) => {
                        console.log("in catch")

                        console.log("errormsg", err)
                        toast.error(`${err.response.data}`);
                        // console.log("Unable to create new User, Please try again later!")
                  })
            }
      }

      return (
            <>
                  <Container></Container>


                  <div className='headinggg'>
                        <div className='headingStyle'>
                              <Link to="/Home" style={{ color: 'black' }}><p>Home - </p></Link>
                              <p className='po'>Add New User</p>
                        </div>
                        <div>
                              <button
                                    style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          gap: "10px",
                                          background: plantHover ? "#1D7BCC" : "#2FA5FF",
                                          borderRadius: "30px",
                                          padding: "8px",
                                          color: "#FFFFFF",
                                          paddingLeft: "7px",
                                          fontFamily: "Roboto, sans-serif",
                                          fontWeight: "400",
                                          border: "none",
                                          cursor: "pointer",
                                          fontSize: "14px",
                                          // opacity: plantHover ? 0.7 : 1, // Reduce opacity on hover
                                          transition: "opacity 0.3s ease-in-out, background 0.3s ease-in-out",
                                    }}
                                    onMouseEnter={() => setPlantHover(true)}
                                    onMouseLeave={() => setPlantHover(false)}
                                    onClick={() => navigate('/UserReport')}
                              >
                                    All Users
                              </button>
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
                                          <p>Plant*</p>
                                          <div className="dropdown-mot" style={{ width: "84.5%" }}>
                                                {/* <select className='dropdown-mot' value={plantName} onChange={handleChange} >
                                                      <option value={""}>Please select Plant</option>
                                                      {plantList.map((plant) => {
                                                            return (
                                                                  <option key={plant.PLANT_ID} value={plant.PLANT_ID}>{plant.PLANT_ID} ({plant.PLANT_NAME})</option>
                                                            );
                                                      })}
                                                </select> */}
                                                <Select
                                                      styles={{
                                                            control: (baseStyles, state) => ({
                                                                  ...baseStyles,
                                                                  borderColor: state.isFocused ? 'rgb(25, 139, 198)' : 'black',
                                                                  height: "6vh",
                                                                  boxShadow: state.isFocused ? '0 0 5px rgb(25, 139, 198)' : '',
                                                                  overflowY: 'auto', // Enables scrolling for overflow
                                                                  scrollbarWidth: "none",
                                                                  maxHeight: '100px', // Limits the height of the control
                                                            }),
                                                            option: (baseStyles, state) => ({
                                                                  ...baseStyles,
                                                                  backgroundColor: state.isFocused ? '#198bc6' : 'white',
                                                                  color: state.isSelected ? 'white' : 'black',
                                                                  ':hover': {
                                                                        backgroundColor: '#198bc6',
                                                                        color: 'white',
                                                                  },
                                                            }),
                                                            multiValue: (baseStyles) => ({
                                                                  ...baseStyles,
                                                                  backgroundColor: '#198bc6',
                                                                  color: 'white',
                                                            }),
                                                            multiValueLabel: (baseStyles) => ({
                                                                  ...baseStyles,
                                                                  color: 'white',
                                                            }),
                                                            multiValueRemove: (baseStyles) => ({
                                                                  ...baseStyles,
                                                                  color: 'white',
                                                                  ':hover': {
                                                                        backgroundColor: 'red',
                                                                        color: 'white',
                                                                  },
                                                            }),
                                                      }}
                                                      isMulti
                                                      value={plantOptions.filter((item) => data.PLANT.includes(item.value))}
                                                      onChange={handleSelectChange}
                                                      options={plantOptions}
                                                      name="PLANT"
                                                      placeholder="Select options..."
                                                />

                                          </div>
                                          {/* {error.PLANT && <span class="error">{error.PLANT}</span>} */}
                                    </div>


                              </div>

                              <div className='grid-container'>
                                    <div className='inputFeildDesign'>
                                          <p>Role*</p>
                                          <div className="dropdown-mot" style={{ width: "84.5%" }}>
                                                <Select

                                                      styles={{
                                                            control: (baseStyles, state) => ({
                                                                  ...baseStyles,
                                                                  borderColor: state.isFocused ? 'rgb(25, 139, 198)' : 'black',
                                                                  height: "6vh",
                                                                  boxShadow: state.isFocused ? '0 0 5px rgb(25, 139, 198)' : '',
                                                                  overflowY: 'auto', // Enables scrolling for overflow
                                                                  scrollbarWidth: "none",
                                                                  maxHeight: '100px', // Limits the height of the control
                                                            }),
                                                            option: (baseStyles, state) => ({
                                                                  ...baseStyles,
                                                                  backgroundColor: state.isFocused ? '#198bc6' : 'white',
                                                                  color: state.isSelected ? 'white' : 'black',
                                                                  ':hover': {
                                                                        backgroundColor: '#198bc6',
                                                                        color: 'white',
                                                                  },
                                                            }),
                                                            multiValue: (baseStyles) => ({
                                                                  ...baseStyles,
                                                                  backgroundColor: '#198bc6',
                                                                  color: 'white',
                                                            }),
                                                            multiValueLabel: (baseStyles) => ({
                                                                  ...baseStyles,
                                                                  color: 'white',
                                                            }),
                                                            multiValueRemove: (baseStyles) => ({
                                                                  ...baseStyles,
                                                                  color: 'white',
                                                                  ':hover': {
                                                                        backgroundColor: 'red',
                                                                        color: 'white',
                                                                  },
                                                            }),
                                                      }}
                                                      isMulti
                                                      value={roleOptions.filter((item) => data.ROLE.includes(item.value))}
                                                      onChange={handleSelectChange}
                                                      options={roleOptions}
                                                      name="ROLE"
                                                      placeholder="Select Role..."
                                                />
                                                {error.ROLE && <span class="error">{error.ROLE}</span>}
                                          </div>

                                    </div>

                                    <div className='inputFeildDesign'>
                                    </div>
                              </div>






                        </div>

                  </div>

                  <div className='buttonAlign'>
                        <button type="submit" className="feildBtn" onClick={() => handleSubmit()}>
                              Submit
                        </button>
                  </div>


                  {/* 
                  <div className='footerSpacing'>
                        <Footer>

                        </Footer>
                  </div> */}

            </>
      )
}

const mapStateToProps = (state) => {
      return {
            EmpId: state.loginreducer.details
      }
}

export default connect(mapStateToProps, { SignupData })(AddUser);