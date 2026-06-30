// import React, { useEffect, useState } from 'react'
// import '../../../Stylesheet/Details.scss'
// import Footer from '../../../Components/Footer'
// import Header from '../../../Components/Header'
// import { Button } from '@material-ui/core';
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { LoginAction } from '../../../redux/action/LoginAction';
// import CustomDivider from '../../../Components/Divider'
// import { connect } from 'react-redux';
// import { getVehicleDetails } from '../../../redux/action/Entry';
// function DetailPO(props) {

// const apiURL = process.env.REACT_APP_API_URL

//   const navigate = useNavigate()
//   const location = useLocation();
//   const podata = location.state;
//   console.log("pooooooooooooooodata", podata)
//   const [selectedFile, setSelectedFile] = useState(null);
//   // console.log("data present here",vData)

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleFileUpload = () => {
//     if (selectedFile) {
//       // Perform your file upload logic here
//       console.log('Uploading file:', selectedFile);
//     } else {
//       console.log('No file selected');
//     }
//   };

//   const [data, setdata] = useState({
//     "INVOICE": podata[0].PO_NO,
//     "DOCDATE": podata[0].DOCUMENT_DATE,
//     "VENDORNAME": podata[0].VENDOR_NAME,
//     "DRIVERNAME": "",
//     "MOBILE": "",
//     "MOT": '',
//     "VEHICLENO": '',
//     "VEHCAT": '',
//     "ROADPERMIT": '',
//     "LR": '',
//     "LRDATE": "",
//     "PACKAGES": '',
//     "VEHICLEREPDATE": "",
//     "INDATE": new Date(),
//   })


//   const vData = props?.VehicleInfo
//   useEffect(() => {
//     const matchingVehicle = vData.find(
//       (item) => item.VEHICLE_NO === data.VEHICLENO
//     );
//     if (matchingVehicle) {
//       setdata((prev) => ({
//         ...prev,
//         DRIVERNAME: matchingVehicle.DRIVER_NAME || prev.DRIVERNAME,
//         MOT: matchingVehicle.MODE_OF_TRANSPORT || prev.MOT,
//         VEHCAT: matchingVehicle.VEHICLE_CATEGORY || prev.VEHCAT,
//         ROADPERMIT: matchingVehicle.ROAD_PERMIT_NUMBER || prev.ROADPERMIT,
//         MOBILE: matchingVehicle.DRIVER_MOBILE_NO || prev.MOBILE,
//         VEHICLEREPDATE: matchingVehicle.VEHICLE_REPORTING_TIME
//           ? new Date(matchingVehicle.VEHICLE_REPORTING_TIME).toISOString().slice(0, 16)
//           : prev.VEHICLEREPDATE,

//       }));
//       console.log("VEHICLEREPDATE:", new Date(matchingVehicle.VEHICLE_REPORTING_TIME));
//     }
//   }, [data.VEHICLENO, vData]);


//   const [error, seterror] = useState({
//   })
//   const setValue = (val) => {
//     setdata({ ...data, ...val })
//   }

//   const [motList, setMotList] = useState([{ 'name': '', 'id': '' }]);
//   const [motName, setMotName] = useState()

//   const [vcatList, setVcat] = useState([{ 'name': '', 'id': '' }]);
//   const [vcatName, setVcatName] = useState()

//   // const [Vname,setVname] = useState([{'vName':'','dName':'','mot':'','dMob':'','vCat':'','permitN':''}]);
//   // const[vName,setvName] = useState([])
//   // console.log(vName,"vName")



//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch(`${apiURL}Employee/mot`)
//       const response1 = await fetch(`${apiURL}Employee/vehicle_category`)

//       const newData = await response.json();
//       setMotList(newData);

//       const newData1 = await response1.json();
//       setVcat(newData1)

//     }
//     fetchData();
//   }, [])

//   const handleChange = (event) => (setMotName(event.target.value), setValue({ MOT: event.target.value }))
//   const handleChangeVcat = (event) => (setVcatName(event.target.value), setValue({ VEHCAT: event.target.value }))


//   const handleSubmit = () => {
//     let hasErr = false
//     let require = ["INVOICE", "DOCDATE", "VENDORNAME", "DRIVERNAME", "MOBILE", "MOT", "VEHICLENO", "VEHCAT", "ROADPERMIT", "LR", "LRDATE", "PACKAGES", "VEHICLEREPDATE", "INDATE"]
//     let err = {
//       INVOICE: null,
//       DOCDATE: null,
//       VENDORNAME: null,
//       DRIVERNAME: null,
//       MOBILE: null,
//       MOT: null,
//       VEHICLENO: null,
//       VEHCAT: null,
//       ROADPERMIT: null,
//       LR: null,
//       LRDATE: null,
//       PACKAGES: null,
//       VEHICLEREPDATE: null,
//       INDATE: null,
//     }
//     require.map((items) => {
//       if (data[items] == "" || data[items] == '' || data[items] == null) {
//         hasErr = true
//         err[items] = "This field is mandatory"
//       }
//     })

//     if (data.LR < 15) {
//       err.LR = ("Minimum lenght should be 15 characters")
//     }
//     if (data.MOBILE < 10) {
//       err.MOBILE = ("Minimum lenght should be 10 characters")
//     }
//     if (data.VEHICLENO < 9) {
//       err.VEHICLENO = ("Minimum lenght should be 9 characters")
//     }
//     seterror(err)
//     if (!hasErr) {
//       navigate('/Inward/PO/ItemFeild', { state: { podata, data, selectedFile } })
//     }
//   }


//   console.log(data)

//   return (
//     <>

//       <Header></Header>

//       <div className='headinggg'>
//         <div className='headingStyle'>
//          <Link to="/Home" style={{ color: 'black' }}><p>Inward Gate Entry - </p></Link>
//           <p className='po'>With PO</p>
//         </div>

//         {/* <Link
//           to="/Inward/PO/ItemFeild" state={{ podata, data }}
//           style={{ color: 'black' }}><p className='po' >View Item Feilds</p></Link> */}
//       </div>

//       <div className='InputBox'>
//         {/* <div className='entryHead'>
//           <p>Gate Entry Number - </p>
//           <p className='po'>I526</p>
//         </div>

//         <div className='dividerStyle'>
//           <CustomDivider color="#1897CE" thickness="0.8vh" />
//         </div> */}

//         <div className='inner'>

//           <div className='grid-container'>
//             <div className='inputFeildDesign'>
//               <p>Invoice Number*</p>
//               <input
//                 // onChange={text => (setValue({ "INVOICE": podata.INVOICE }), seterror({ ...error, INVOICE: '' }))}
//                 type="text"
//                 placeholder="Please enter Invoice Number"
//                 disabled
//                 value={podata[0].PO_NO}
//               />
//               {error.INVOICE && <span class="error">{error.INVOICE}</span>}
//             </div>

//             <div className='inputFeildDesign'>
//               <p>Document Date*</p>
//               <input
//                 //class="form-control"
//                 type="text"
//                 required
//                 // onChange={text => (setValue({ "DOCDATE": text.target.value }), seterror({ ...error, DOCDATE: '' }))}
//                 placeholder="Please enter Document Date"
//                 disabled
//                 value={new Date(podata[0].DOCUMENT_DATE).toDateString()}
//               />
//               {error.DOCDATE && <span class="error">{error.DOCDATE}</span>}

//             </div>
//           </div>

//           <div className='grid-container'>
//             <div className='inputFeildDesign'>
//               <p>Packages</p>
//               <input
//                 //class="form-control"
//                 type="text"
//                 // required
//                 onChange={text => (setValue({ "PACKAGES": text.target.value }), seterror({ ...error, PACKAGES: '' }))}
//                 placeholder="Please enter number of Packages"
//               />
//               {error.PACKAGES && <span class="error">{error.PACKAGES}</span>}

//             </div>

//             <div className='inputFeildDesign'>
//               <p>Transporter Vendor name*</p>
//               <input
//                 //class="form-control"
//                 type="text"
//                 required
//                 // onChange={text => (setValue({ "VENDORNAME": text.target.value }), seterror({ ...error, VENDORNAME: '' }))}
//                 value={podata[0].VENDOR_NAME}
//                 disabled
//                 placeholder="Please enter Transporter Vendor name"
//               />
//               {error.VENDORNAME && <span class="error">{error.VENDORNAME}</span>}

//             </div>
//           </div>

//           <div className='grid-container'>
//             <div className='inputFeildDesign'>
//               <p className='Text'> Transporter Driver name*</p>
//               <input
//                 //class="form-control"
//                 type="text"
//                 required
//                 value={data?.DRIVERNAME}
//                 onChange={text => (setValue({ "DRIVERNAME": text.target.value }), seterror({ ...error, DRIVERNAME: '' }))}
//                 placeholder="Please enter Transporter Driver name"
//               />
//               {error.DRIVERNAME && <span class="error">{error.DRIVERNAME}</span>}

//             </div>

//             <div className='inputFeildDesign'>
//               <p>Transporter Driver Mobile No.*</p>
//               <input
//                 //class="form-control"
//                 type="text"
//                 maxLength={10}
//                 // keyboard
//                 required
//                 value={data?.MOBILE}
//                 onChange={text => (setValue({ "MOBILE": text.target.value }), seterror({ ...error, MOBILE: '' }))}
//                 placeholder="Please enter Transporter Driver Mobile No."
//               />
//               {error.MOBILE && <span class="error">{error.MOBILE}</span>}

//             </div>
//           </div>

//           <div className='grid-container'>
//             <div className='inputFeildDesign'>
//               <p>Mode of Transport</p>
//               <div className="dropdown-mot">
//                 <select className='dropdown-mot' value={data.MOT} onChange={handleChange}>
//                   <option value={""}>Please select Mode of Transport</option>

//                   {motList.map((plant) => {
//                     return (
//                       <option key={plant.LABLE} value={plant.LABLE}>{plant.LABLE}</option>
//                     );
//                   })}
//                 </select>
//               </div>
//             </div>

//             <div className='inputFeildDesign'>
//               <p>Vehicle Number*</p>
//               <input
//                 //class="form-control"
//                 type="text"
//                 required
//                 // maxLength={11}
//                 minLength={10}
//                 onChange={text => (setValue({ "VEHICLENO": text.target.value }), seterror({ ...error, VEHICLENO: '' }))}
//                 placeholder="Please enter Vehicle Number"
//               />
//               {error.VEHICLENO && <span class="error">{error.VEHICLENO}</span>}

//             </div>
//           </div>

//           <div className='grid-container'>
//             <div className='inputFeildDesign'>
//               <p>Vehicle Category</p>
//               <div className="dropdown-mot">
//                 <select className='dropdown-mot' value={data.VEHCAT} onChange={handleChangeVcat}>
//                   <option value={""}>Please select Vehicle Category</option>

//                   {vcatList.map((plant) => {
//                     return (
//                       <option key={plant.LABLE} value={plant.LABLE}>{plant.LABLE}</option>
//                     );
//                   })}
//                 </select>
//               </div>
//             </div>

//             <div className='inputFeildDesign'>
//               <p>EWay Bill No.</p>
//               <input
//                 //class="form-control"
//                 type="text"
//                 required
//                 value={data.ROADPERMIT}
//                 onChange={text => (setValue({ "ROADPERMIT": text.target.value }), seterror({ ...error, ROADPERMIT: '' }))}
//                 placeholder="Please enter Road permit number"
//               />
//               {error.ROADPERMIT && <span class="error">{error.ROADPERMIT}</span>}

//             </div>
//           </div>

//           <div className='grid-container'>
//             <div className='inputFeildDesign'>
//               <p>LR Number*</p>
//               <input
//                 //class="form-control"
//                 type="text"
//                 required
//                 onChange={text => (setValue({ "LR": text.target.value }), seterror({ ...error, LR: '' }))}

//                 placeholder="Please enter LR Number"
//               />
//               {error.LR && <span class="error">{error.LR}</span>}

//             </div>

//             <div className='inputFeildDesign'>
//               <p>LR Date*</p>
//               <input
//                 //class="form-control"
//                 type="date"
//                 required
//                 max={new Date().toISOString().split('T')[0]}
//                 onChange={text => (setValue({ "LRDATE": text.target.value }), seterror({ ...error, LRDATE: '' }))}
//                 placeholder="Please enter LR Date"
//               />
//               {error.LRDATE && <span class="error">{error.LRDATE}</span>}

//             </div>
//           </div>

//           <div className='grid-container'>
//             <div className='inputFeildDesign'>
//               <p>Vehicle Reporting Date & Time*</p>
//               <input
//                 //class="form-control"
//                 type="datetime-local"
//                 required
//                 disabled
//                 value={data.VEHICLEREPDATE}
//                 onChange={text => (setValue({ "VEHICLEREPDATE": text.target.value }), seterror({ ...error, VEHICLEREPDATE: '' }))}
//                 placeholder="Please enter Vehicle Reporting Date & Time"
//               />
//               {error.VEHICLEREPDATE && <span class="error">{error.VEHICLEREPDATE}</span>}

//             </div>
//             <div className='inputFeildDesign'>
//               {/* <p>Vehicle Inward Date & Time*</p>
//               <input
//                 //class="form-control"
//                 type="datetime-local"
//                 required
//                 onChange={text => (setValue({ "INDATE": text.target.value }), seterror({ ...error, INDATE: '' }))}
//                 placeholder="Please enter Vehicle Inward Date & Time"
//               />
//               {error.INDATE && <span class="error">{error.INDATE}</span>} */}

//             </div>
//           </div>


//           {/* <div className='grid-container'>
//             <div className='inputFeildDesign'>
//               <p>Vehicle Weight at time of Reporting*</p>
//               <input
//                 //class="form-control"
//                 type="text"
//                 placeholder="Please enter Vehicle Weight"
//               />
//             </div>
           
//           </div> */}
//         </div>

//         <div className="inputFeildDesign2">
//           <p>Attach necessary Documents*</p>

//           <div className="attachStyle">
//             <input
//               type="file"
//               style={{ display: "none" }}
//               id="file-input"
//               multiple // Allow multiple file selection
//               onChange={(event) => {
//                 const files = Array.from(event.target.files); // Convert FileList to an array
//                 setSelectedFile(files); // Update state with selected files
//               }}
//             />

//             <div className="attachButton">
//               <label htmlFor="file-input">
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   component="span"
//                   startIcon={<CloudUploadIcon fontSize="large" />}
//                 >
//                   Select Files
//                 </Button>
//               </label>
//             </div>

//             <div className="attachButton">
//               <div>
//                 {selectedFile?.length > 0 && ( // Display file names if any are selected
//                   <div className="uploadStyle">
//                     <p>Selected Files:</p>
//                     <ul>
//                       {selectedFile.map((file, index) => (
//                         <li key={index}>{file.name}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>


//       </div>

//       <div className='buttonAlign'>
//         <button type="submit" className="feildBtn" onClick={() => handleSubmit()}>
//           View Item Fields
//         </button>
//       </div>

//       <div className='footerSpacing'>
//         <Footer>

//         </Footer>
//       </div>

//     </>
//   )
// }

// const mapStateToProps = (state) => {
//   return {
//     VehicleInfo: state?.entryReducer?.vehicleData
//   }
// }

// export default connect(mapStateToProps, { getVehicleDetails })(DetailPO)

import React from "react";
import '../../../Stylesheet/Details.scss'

const InwardGateEntry = () => {
  return (
    <div className="container">
      <div className="header_file" style={{textAlign:"left", fontFamily:"Roboto, sans-serif"}}><span className="sub-header" style={{marginLeft:"65px",fontWeight:"500"}}>Inward Gate Entry</span> WITHOUT PO</div>

      <div className="section" style={{marginLeft:"50px"}}>
        <h3 style={{color:"#717171"}}>Basic Details :</h3>
        <div style={{width:"80%", marginLeft:"150px", color:"#000000"}}>
        <div className="row">
          <div className="input-group"  style={{paddingRight:"50px"}}>
            <label style={{color:"#000000"}}>Invoice Number</label>
            <input type="text" style={{borderTop:"none",borderLeft:"none",borderRight:"none", borderBottom:"1px solid black"  }} />
          </div>
          <div className="input-group" style={{paddingRight:"50px"}}>
            <label style={{color:"#000000"}}>Document Date</label>
            <input type="date"  style={{borderTop:"none",borderLeft:"none",borderRight:"none", borderBottom:"1px solid black" }}/>
          </div>
        </div>
        <div className="row">
          <div className="input-group" style={{paddingRight:"50px"}}>
            <label style={{color:"#000000"}}>LR Number</label>
            <input type="text"style={{borderTop:"none",borderLeft:"none",borderRight:"none", borderBottom:"1px solid black" }} />
          </div>
          <div className="input-group" style={{paddingRight:"50px"}}>
            <label style={{color:"#000000"}}>LR Date</label>
            <input type="date"style={{borderTop:"none",borderLeft:"none",borderRight:"none", borderBottom:"1px solid black" }} />
          </div>
        </div>
        </div>
      </div>

      <div className="section" style={{marginLeft:"50px"}}>
        <h3 style={{color:"#717171"}}>Transport Details :</h3>
        <div style={{width:"80%", marginLeft:"150px"}}>
        <div className="row">
          <div className="input-group" style={{paddingRight:"50px"}}>
            <label style={{color:"#000000"}}>Mode of Transport</label>
            <input type="text" style={{borderTop:"none",borderLeft:"none",borderRight:"none", borderBottom:"1px solid black" }}/>
          </div>
          <div className="input-group" style={{paddingRight:"50px"}}>
            <label style={{color:"#000000"}}>Vehicle Category</label>
            <input type="text" style={{borderTop:"none",borderLeft:"none",borderRight:"none", borderBottom:"1px solid black" }}x />
          </div>
        </div>
        <div className="row">
          <div className="input-group" style={{paddingRight:"50px"}}>
            <label style={{color:"#000000"}}>Vehicle Number</label>
            <input type="text"style={{borderTop:"none",borderLeft:"none",borderRight:"none", borderBottom:"1px solid black" }} />
          </div>
          <div className="input-group" style={{paddingRight:"50px"}}>
            <label style={{color:"#000000"}}>Road Permit Number</label>
            <input type="text"style={{borderTop:"none",borderLeft:"none",borderRight:"none", borderBottom:"1px solid black" }} />
          </div>
        </div>
        </div>

      </div>

      <div className="section" style={{marginLeft:"50px"}}>
        <h3 style={{color:"#717171"}}>Driver And Reporting Details :</h3>
        <div style={{width:"80%", marginLeft:"150px"}}>
        <div className="row">
          <div className="input-group" style={{paddingRight:"50px"}}>
            <label style={{color:"#000000"}}>Transport Driver Name</label>
            <input type="text" style={{borderTop:"none",borderLeft:"none",borderRight:"none", borderBottom:"1px solid black" }}/>
          </div>
          <div className="input-group" style={{paddingRight:"50px"}}>
            <label style={{color:"#000000"}}>Transporter Mobile No.</label>
            <input type="text"style={{borderTop:"none",borderLeft:"none",borderRight:"none", borderBottom:"1px solid black" }} />
          </div>
        </div>
        <div className="row">
          <div className="input-group" style={{paddingRight:"50px"}}>
            <label style={{color:"#000000"}}>Reporting Date & Time</label>
            <input type="datetime-local"style={{borderTop:"none",borderLeft:"none",borderRight:"none", borderBottom:"1px solid black" }} />
          </div>
          <div className="input-group" style={{paddingRight:"50px"}}>
            <label style={{color:"#000000"}}>Packages</label>
            <input type="text"style={{borderTop:"none",borderLeft:"none",borderRight:"none", borderBottom:"1px solid black" }} />
          </div>
        </div>
        </div>

      </div>
      <div style={{textAlign:"right" ,marginTop:"52px", marginRight:"40px"}}>
        <button style={{ padding:"10px 28px",borderRadius:"50px",backgroundColor:"#0091FF",color:"#FFFFFF",border:"none",cursor:"pointer"}}> Submit</button>
      </div>
    </div>
  );
};

export default InwardGateEntry;
