import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Link, redirect, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import '../../../Stylesheet/Inward.scss'
import Select from "react-select";
import { PoData } from '../../../redux/action/PoData';
import { connect } from 'react-redux';

const apiURL = process.env.REACT_APP_API_URL

function HomeReturnPO(props) {
      const navigate = useNavigate()
      // React state to manage selected options
      const [selectedOptions, setSelectedOptions] = useState();

      const [plantList, setPlantList] = useState([{ 'name': '', 'id': '' }]);
      const [plantName, setPlantName] = useState()
      const [data, setdata] = useState({
            "PLANT": "",
            "PO": "",
            "LINEITEM": [],
      })
      const setValue = (val) => {
            // console.log("val", val)
            setdata({ ...data, ...val })
      }

      useEffect(() => {
            const fetchData = async () => {
                  const response = await fetch(`${apiURL}Employee/plant`)
                  const newData = await response.json();
                  setPlantList(newData);

                  // console.log(newData)
            }
            fetchData();
      }, [])
      const [error, seterror] = useState({
      })
      const handleChange = (event) => (setPlantName(event.target.value), setValue({ PLANT: event.target.value }))

      let initialpo = []

      // Array of all options

      // const optionList = [
      //       { value: "Option", label: "Option" },
      //       { value: "Option1", label: "Option1" },
      //       { value: "Option2", label: "Option2" },
      //       { value: "Option3", label: "Option3" },
      //       { value: "Option4", label: "Option4" }
      // ];

      // function handleSelect(data) {
      //       setSelectedOptions(data);
      // }

      const [selectedOption, setSelectedOption] = useState('');

      const handleOptionChange = (event) => {
            setSelectedOption(event.target.value);
      };

      const handleSubmit = () => {
            let hasErr = false
            let require = ["PLANT", "PO"]
            let err = {
                  PLANT: "",
                  PO: "",
                  LINEITEM: "",
            }
            require.map((items) => {
                  if (data[items] == "" || data[items] == '' || data[items] == null) {
                        hasErr = true
                        err[items] = "This field is mandatory"
                  }
            })
// console.log(hasErr)
            seterror(err)
            if (!hasErr) {
                  let send_data = { "plant": plantName, "po": data.PO }
                  props.PoData(send_data).then(response=>{
                        if(response.status==200){
                              // console.log(response)
                              navigate('/Outward/ReturnPO/Details', {state: response.data})
                        }
                  }).catch((err)=>{console.log(err)})
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
                                                <h2 className='h3'>With Return PO/Return Challan</h2>
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

                                    <div className="inputs">

                                          <div className='grid-container'>
                                                <p className='heading'>Plant</p>
                                                <div className="dropdown-container">

                                                      <select className='dropdown-style' value={plantName} onChange={handleChange}>
                                                            <option value={""}>Select Plant</option>

                                                            {plantList.map((plant) => {
                                                                  return (
                                                                        <option key={plant.PLANT_ID} value={plant.PLANT_ID}>{plant.PLANT_ID} ({plant.PLANT_NAME})</option>
                                                                  );
                                                            })}
                                                      </select>
                                                </div>
                                          </div>

                                          <div className='grid-container'>
                                                <p className='heading'>Purchasing Document Number/Return Challan</p>

                                                <input
                                                      // class="form-control"
                                                      type="text"
                                                      required
                                                      placeholder="Please enter Purchasing Document Number"
                                                      style={{ padding: 10 }}
                                                      onChange={text =>  setValue({ "PO": text.target.value })}
                                                />
                                          </div>

                                          <div className='grid-container'>
                                                <label>
                                                      <input
                                                            type="radio"
                                                            value="po"
                                                            checked={selectedOption === 'po'}
                                                            onChange={handleOptionChange}
                                                      />
                                                      Return PO
                                                </label>

                                                <label>
                                                      <input
                                                            type="radio"
                                                            value="challan"
                                                            checked={selectedOption === 'challan'}
                                                            onChange={handleOptionChange}
                                                      />
                                                      Return Challan
                                                </label>

                                                {/* <p>Selected option: {selectedOption}</p> */}
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

export default connect(null, { PoData })(HomeReturnPO)