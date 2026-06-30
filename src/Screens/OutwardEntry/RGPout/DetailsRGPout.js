import React, { useEffect, useState } from 'react'
import '../../../Stylesheet/Details.scss'
import Footer from '../../../Components/Footer'
import Header from '../../../Components/Header'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconContext } from "react-icons";
import { IoIosAddCircleOutline } from "react-icons/io";
import AddMore from '../../../Components/AddMore';

function DetailWithoutPO() {

      const navigate = useNavigate()

      const location = useLocation();
      const itemdata = location.state;
      const [previousdata, setpreviousdata] = useState(itemdata)
      console.log("previousdata",previousdata)
      const  [details,setDetails] = useState([])
       const [plantList, setPlantList] = useState([]); // Raw API data
            const [plantOptions, setPlantOptions] = useState([]); // Transformed data for dropdown
            const [plantName, setPlantName] = useState("")
      // console.log("-----", itemdata)
      useEffect(() => {
            setpreviousdata(itemdata)
      }, [])
      let insert = {
            "MATERIAL": "",
            "MATERIAL_DESC": '',
            "PLANT": "",
            "QUANTITY": "",
            "VENDOR_ID": "",
            "VENDOR_NAME": '',
            // "DISTRICT": '',
            // "BILED_QTY": ''
      }

      const [everyitemdata, setdata] = useState([{
            "MATERIAL": "",
            "MATERIAL_DESC": '',
            "PLANT": "",
            "QUANTITY": "",
            "VENDOR_ID": "",
            "VENDOR_NAME": '',
            // "DISTRICT": '',
            // "BILED_QTY": ''
      }])
      // console.log("everyData",everyitemdata)

         useEffect(() => {
                  const fetchData = async () => {
                        try {
                              // console.log("url", `https://gateentryapi.rrparkon.net:6008/Employee/allocated_plant?id=${details}`);
                              const response = await fetch(`https://gateentryapi.rrparkon.net:6008/Employee/allocated_plant?id=${details}`);
                              const newData = await response.json();
      
                              // Update plantList with raw data
                              setPlantList(newData);
      
                              // Transform data into { label, value } format
                              const options = newData.map((plant) => ({
                                    label: plant.PLANT_NAME,
                                    value: plant.PLANT_ID,
                              }));
                              setPlantOptions(options);
                        } catch (error) {
                              console.error("Error fetching plant data:", error);
                        }
                  };
      
                  fetchData();
            }, [details]);

      const additem = (val) => {
            // let data = [...ndata]
            let fields = [...everyitemdata]
            return (
                  // data.push(val),
                  // setn(data),
                  fields.push(insert),
                  setdata(fields)
            )
      }
      const handleChange = (event) => (setPlantName(event.target.value), setvalue({ PLANT: event.target.value }))

      const setvalue = (val, index) => {
            setdata((prevData) => {
                let data = [...prevData];
        
                // If index is out of bounds, return previous state
                if (index >= data.length || !data[index]) {
                    console.error("Index out of bounds:", index);
                    return prevData;
                }
        
                let fieldkey = Object.keys(val)[0];
                data[index][fieldkey] = val[fieldkey];
        
                return data;
            });
        };
        
      // console.log("detail screen", everyitemdata)

      useEffect(() => {
            const persistRoot = localStorage.getItem("persist:root");
            if (persistRoot) {
                  try {
                        const parsedPersist = JSON.parse(persistRoot); // Parse the JSON string
                        const loginReducer = JSON.parse(parsedPersist.loginreducer); // Parse loginReducer
                        setDetails(loginReducer.details); // Update state with `details`
                  } catch (error) {
                        console.error("Error parsing persist:root data:", error);
                  }
            }
      }, []);





      return (
            <>
                  <Header></Header>

                  <div className='headinggg'>
                        <div className='headingStyle'>
                              <p>Outward Gate Entry - </p>
                              <p className='po'>Without PO/NRGP</p>
                        </div>
                  </div>

                  <div className='centerHeading'>
                        <p className='centerHeadingStyle'>Please enter necessary details to proceed further</p>
                  </div>



                  {everyitemdata.map((count, index) => {
                        // console.log("------count",index);
                        return (
                              <div className='InputBox1'>

                                    <div className='inner'>

                                          <div className='grid-container'>
                                          <div className='inputFeildDesign'>
                                                      <p>Material Description*</p>
                                                      <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Please enter Material Description"
                                                            onChange={text => { setvalue({ MATERIAL_DESC: text.target.value }, index) }}

                                                      />
                                                </div>
                                          <div className='inputFeildDesign'>
                                                      <p>Vendor Name*</p>
                                                      <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Please enter Vendor Name"
                                                            onChange={text => { setvalue({ VENDOR_NAME: text.target.value }, index) }}

                                                      />
                                                </div>

                                          
                                          </div>

                                          <div className='grid-container'>
                                                <div
                                                 className='inputFeildDesign'
                                                 >
                                                      <p>Plant*</p>
                                                      <select
                                                      style={{height:"7vh",width:"30vw",borderRadius:"50px",padding:"0px 10px",marginTop:"5px",border:"none"}}
                                                           className="form-control"
                                                            value={plantName}
                                                            onChange={handleChange}
                                                      >
                                                            {/* <option value={""}>Select Plant</option> */}
                                                            {plantOptions.map((plant) => (
                                                                  <option key={plant.value} value={plant.value}>
                                                                        {plant.value} ({plant.label})
                                                                  </option>
                                                            ))}
                                                      </select>
                                                </div>

                                                <div className='inputFeildDesign'>
                                                      <p>Quantity*</p>
                                                      <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Please enter Quantity"
                                                            onChange={text => { setvalue({ QUANTITY: text.target.value }, index) }}

                                                      />
                                                </div>
                                          </div>

                                          <div className='grid-container'>
                                                {/* <div className='inputFeildDesign'>
                                                      <p>Vendor Id*</p>
                                                      <input
                                                            class="form-control"
                                                            type="text"
                                                            placeholder="Please enter Vendor"
                                                            onChange={text => { setvalue({ VENDOR_ID: text.target.value }, index) }}

                                                      />
                                                </div> */}

                                          
                                          </div>

                                          {/* <div className='grid-container'>
                                                <div className='inputFeildDesign'>
                                                      <p>District*</p>
                                                      <input
                                                            class="form-control"
                                                            type="text"
                                                            placeholder="Please enter District"
                                                            onChange={text => { setvalue({ DISTRICT: text.target.value }, index) }}

                                                      />
                                                </div>

                                                <div className='inputFeildDesign'>
                                                      <p>Billed Quantity*</p>
                                                      <input
                                                            class="form-control"
                                                            type="text"
                                                            placeholder="Please enter Billed Quantity"
                                                            onChange={text => { setvalue({ BILED_QTY: text.target.value }, index) }}

                                                      />
                                                </div>
                                          </div> */}

                                          {/* <div className='Reviewbutton'>
                                    <button className="ReviewbuttonStyle" onClick={() => navigate('/Inward/WithoutPO/ItemFeilds')}>
                                          View Item Fields
                                    </button>
                              </div> */}
                                    </div>
                              </div>
                        )
                  })}


                  <div className='addMore' onClick={() => additem()}>
                        <Link style={{ color: 'red' }}><p className='addMoreStyle'>Add More</p></Link>

                        <div className='addMoreIcon'>
                              <IconContext.Provider value={{ color: "red", size: "23px" }}>
                                    <IoIosAddCircleOutline
                                          type="button"
                                    />
                              </IconContext.Provider>
                        </div>
                  </div>

                  <div className='Reviewbutton'>
                        <button className="ReviewbuttonStyle" onClick={() => navigate('/Outward/RGP-RFA-Issue/ItemFields', { state: { previousdata, everyitemdata } })}>
                              View Item Fields
                        </button>
                  </div>

                  <div className='footerSpacing'>
                        <Footer>

                        </Footer>
                  </div>
            </>
      )
}

export default DetailWithoutPO