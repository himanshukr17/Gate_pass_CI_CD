import React, { useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import Login from './Screens/Onboarding/Login';
import AddUser from './Screens/Onboarding/AddUser';
import Home from './Screens/Dashboard/Home';
import InwardHome from './Screens/InwardEntry/InwardHome';
import InwardChange from './Screens/InwardEntry/InwardChange/InwardChange';
import InwardDisplay from './Screens/InwardEntry/InwardDisplay/InwardDisplay';
import HomePO from './Screens/InwardEntry/WithPO/HomePO';
import HomeSTO from './Screens/InwardEntry/STO/HomeSTO';
import HomeRGP from './Screens/InwardEntry/RGP/HomeRGP';
import DetailPO from './Screens/InwardEntry/WithPO/DetailPO';
import ItemFeild from './Screens/InwardEntry/WithPO/ItemFeild';
import DetailSTO from './Screens/InwardEntry/STO/DetailSTO';
import ItemFeildSTO from './Screens/InwardEntry/STO/ItemFeildSTO';
import DetailRGP from './Screens/InwardEntry/RGP/DetailRGP';
import ItemFeildRGP from './Screens/InwardEntry/RGP/ItemFeildRGP';
import HomeWithoutPO from './Screens/InwardEntry/WithoutPO/HomeWithoutPO';
import DetailWithoutPO from './Screens/InwardEntry/WithoutPO/DetailWithoutPO';
import FeildsWithoutPO from './Screens/InwardEntry/WithoutPO/FeildsWithoutPO';
import DetailDisplay from './Screens/InwardEntry/InwardDisplay/DetailDisplay';
import DetailChange from './Screens/InwardEntry/InwardChange/DetailChange';
import ItemFeildsChange from './Screens/InwardEntry/InwardChange/ItemFeildsChange';
import ActiveUser from './Screens/Onboarding/ActiveUser';
import SignUser from './Screens/Onboarding/SignUser';
import {getVehicleDetails} from "./redux/action/Entry"
import DetailASN from './Screens/InwardEntry/WithASN/DetailASN';
import ItemFieldASN from './Screens/InwardEntry/WithASN/ItemField';

// Outward Gate Entry
import OutwardHome from './Screens/OutwardEntry/OutwardHome';
import HomeReturnPO from './Screens/OutwardEntry/ReturnPO/HomeReturnPO';
import DetailReturnPO from './Screens/OutwardEntry/ReturnPO/DetailReturnPO';
import FieldReturnPO from './Screens/OutwardEntry/ReturnPO/FieldReturnPO';
import HomeSTOout from './Screens/OutwardEntry/STOout/HomeSTOout';
import DetailSTOout from './Screens/OutwardEntry/STOout/DetailSTOout';
import FieldSTOout from './Screens/OutwardEntry/STOout/FieldSTOout';
import HomeContract from './Screens/OutwardEntry/SubContract/HomeContract';
import DetailContract from './Screens/OutwardEntry/SubContract/DetailContract';
import FieldContract from './Screens/OutwardEntry/SubContract/FieldContract';
import HomeRGPout from './Screens/OutwardEntry/RGPout/HomeRGPout';
import DetailsRGPout from './Screens/OutwardEntry/RGPout/DetailsRGPout';
import FieldsRGPout from './Screens/OutwardEntry/RGPout/FieldsRGPout';
import HomeNRGPout from './Screens/OutwardEntry/NRGPout/HomeNRGPout';
import DetailsNRGPout from './Screens/OutwardEntry/NRGPout/DetailsNRGPout';
import FieldsNRGPout from './Screens/OutwardEntry/NRGPout/FieldsNRGPout';
import OutwardChange from './Screens/OutwardEntry/OutwardChange/OutwardChange';
import DetailChangeout from './Screens/OutwardEntry/OutwardChange/DetailChangeout';
import FieldChangeout from './Screens/OutwardEntry/OutwardChange/FieldChangeout';
import OutwardDisplay from './Screens/OutwardEntry/OutwardDisplay/OutwardDisplay';
import DetailDisplayout from './Screens/OutwardEntry/OutwardDisplay/DetailDisplayout';


// Reports
import Reports from './Screens/Reports/Reports';
import Register from './Screens/Reports/Register/Register';
import ChangeLog from './Screens/Reports/ChangeLog/ChangeLog';
import RegisterDetail from './Screens/Reports/Register/RegisterDetail';
import ChangeLogDetails from './Screens/Reports/ChangeLog/ChangeLogDetails';
import { connect } from 'react-redux';
import PrivateRoute from './Components/Route/PrivateComponent';


// Vehicle Reporting
import VehicleReport from './Screens/VehicleReporting/VehicleReport';

// ADD user
import UserReport from './Screens/Reports/UserReport/userReport';
import ChangePassword from './Screens/Dashboard/ChangePassword';

function Main(props) {
      console.log("In routeer ",props.EmpId)
      useEffect(() => {
            window.scrollTo(0, 0)
            props.getVehicleDetails()
      }, [])
      

      return (
            <>
                  <Routes>
                        <Route exact path='/' element={<Login />} />
                        <Route exact path='/AddUser' element={<PrivateRoute auth={props.EmpId}><AddUser /></PrivateRoute>} />
                        <Route exact path='/SignUser' element={<SignUser />} />
                        <Route exact path='/AddUser/ActiveUser' element={<PrivateRoute auth={props.EmpId}><ActiveUser /></PrivateRoute>} />
                        <Route exact path='/Home' element={<PrivateRoute auth={props.EmpId}><Home /></PrivateRoute>} />
                        <Route exact path = "/ChangePassword" element={<PrivateRoute auth={props.EmpId}><ChangePassword emp_ID={props.EMPID}/></PrivateRoute>} />
                        <Route exact path='/Inward' element={<PrivateRoute auth={props.EmpId}><InwardHome /></PrivateRoute>} />
                        <Route exact path='/ChangeInward' element={<PrivateRoute auth={props.EmpId}><InwardChange /></PrivateRoute>} />
                        <Route exact path='/DisplayInward' element={<PrivateRoute auth={props.EmpId}><InwardDisplay /></PrivateRoute>} />
                        <Route exact path='/Inward/WithPO' element={<PrivateRoute auth={props.EmpId}><HomePO /></PrivateRoute>} />
                        <Route exact path='/Inward/STO' element={<PrivateRoute auth={props.EmpId}><HomeSTO /></PrivateRoute>} />
                        <Route exact path='/Inward/RGP' element={<PrivateRoute auth={props.EmpId}><HomeRGP /></PrivateRoute>} />
                        <Route exact path='/Inward/PO/Details' element={<PrivateRoute auth={props.EmpId}><DetailPO /></PrivateRoute>} />
                        <Route exact path='/Inward/PO/ItemFeild' element={<PrivateRoute auth={props.EmpId}><ItemFeild /></PrivateRoute>} />
                        <Route exact path='/Inward/STO/DetailSTO' element={<PrivateRoute auth={props.EmpId}><DetailSTO /></PrivateRoute>} />
                        <Route exact path='/Inward/STO/ItemFeildSTO' element={<PrivateRoute auth={props.EmpId}><ItemFeildSTO /></PrivateRoute>} />
                        <Route exact path='/Inward/RGP/DetailRGP' element={<PrivateRoute auth={props.EmpId}><DetailRGP /></PrivateRoute>} />
                        <Route exact path='/Inward/RGP/ItemFeildRGP' element={<PrivateRoute auth={props.EmpId}><ItemFeildRGP /></PrivateRoute>} />
                        <Route exact path='/Inward/WithoutPO' element={<PrivateRoute auth={props.EmpId}><HomeWithoutPO /></PrivateRoute>} />
                        <Route exact path='/Inward/WithoutPO/Details' element={<PrivateRoute auth={props.EmpId}><DetailWithoutPO /></PrivateRoute>} />
                        <Route exact path='/Inward/WithoutPO/ItemFeilds' element={<PrivateRoute auth={props.EmpId}><FeildsWithoutPO /></PrivateRoute>} />
                        <Route exact path='/DisplayInward/Detail' element={<PrivateRoute auth={props.EmpId}><DetailDisplay /></PrivateRoute>} />
                        <Route exact path='/ChangeInward/Detail' element={<PrivateRoute auth={props.EmpId}><DetailChange /></PrivateRoute>} />
                        <Route exact path='/ChangeInward/ItemFields' element={<PrivateRoute auth={props.EmpId}><ItemFeildsChange /></PrivateRoute>} />
                        <Route exact path ='/Inward/ASN/Details' element={<PrivateRoute auth={props.EmpId}><DetailASN /></PrivateRoute>} />
                        <Route exact path ='/Inward/ASN/ItemFields' element={<PrivateRoute auth={props.EmpId}><ItemFieldASN /></PrivateRoute>} />



                        {/* Outward Gate Entry */}
                        <Route exact path='/Outward' element={<PrivateRoute auth={props.EmpId}><OutwardHome /></PrivateRoute>} />
                        <Route exact path='/Outward/ReturnPO' element={<PrivateRoute auth={props.EmpId}><HomeReturnPO /></PrivateRoute>} />
                        <Route exact path='/Outward/ReturnPO/Details' element={<PrivateRoute auth={props.EmpId}><DetailReturnPO /></PrivateRoute>} />
                        <Route exact path='/Outward/ReturnPO/ItemFields' element={<PrivateRoute auth={props.EmpId}><FieldReturnPO /></PrivateRoute>} />
                        <Route exact path='/Outward/STO' element={<PrivateRoute auth={props.EmpId}><HomeSTOout /></PrivateRoute>} />
                        <Route exact path='/Outward/STO/Details' element={<PrivateRoute auth={props.EmpId}><DetailSTOout /></PrivateRoute>} />
                        <Route exact path='/Outward/STO/ItemFields' element={<PrivateRoute auth={props.EmpId}><FieldSTOout /></PrivateRoute>} />
                        <Route exact path='/Outward/SubContractChallan' element={<PrivateRoute auth={props.EmpId}><HomeContract /></PrivateRoute>} />
                        <Route exact path='/Outward/SubContractChallan/Details' element={<PrivateRoute auth={props.EmpId}><DetailContract /></PrivateRoute>} />
                        <Route exact path='/Outward/SubContractChallan/ItemFields' element={<PrivateRoute auth={props.EmpId}><FieldContract /></PrivateRoute>} />
                        <Route exact path='/Outward/RGP-RFA-Issue' element={<PrivateRoute auth={props.EmpId}><HomeRGPout /></PrivateRoute>} />
                        <Route exact path='/Outward/RGP-RFA-Issue/Details' element={<PrivateRoute auth={props.EmpId}><DetailsRGPout /></PrivateRoute>} />
                        <Route exact path='/Outward/RGP-RFA-Issue/ItemFields' element={<PrivateRoute auth={props.EmpId}><FieldsRGPout /></PrivateRoute>} />
                        <Route exact path='/Outward/NRGP' element={<PrivateRoute auth={props.EmpId}><HomeNRGPout /></PrivateRoute>} />
                        <Route exact path='/Outward/NRGP/Details' element={<PrivateRoute auth={props.EmpId}><DetailsNRGPout /></PrivateRoute>} />
                        <Route exact path='/Outward/NRGP/ItemFields' element={<PrivateRoute auth={props.EmpId}><FieldsNRGPout /></PrivateRoute>} />
                        <Route exact path='/ChangeOutward' element={<PrivateRoute auth={props.EmpId}><OutwardChange /></PrivateRoute>} />
                        <Route exact path='/ChangeOutward/Detail' element={<PrivateRoute auth={props.EmpId}><DetailChangeout /></PrivateRoute>} />
                        <Route exact path='/ChangeOutward/ItemFields' element={<PrivateRoute auth={props.EmpId}><FieldChangeout /></PrivateRoute>} />
                        <Route exact path='/DisplayOutward' element={<PrivateRoute auth={props.EmpId}><OutwardDisplay /></PrivateRoute>} />
                        <Route exact path='/DisplayOutward/Detail' element={<PrivateRoute auth={props.EmpId}><DetailDisplayout /></PrivateRoute>} />



                        {/* Reports */}
                        <Route exact path='/Reports' element={<PrivateRoute auth={props.EmpId}><Reports /></PrivateRoute>} />
                        <Route exact path='/Reports/Register' element={<PrivateRoute auth={props.EmpId}><Register /></PrivateRoute>} />
                        <Route exact path='/Reports/ChangeLog' element={<PrivateRoute auth={props.EmpId}><ChangeLog /></PrivateRoute>} />
                        <Route exact path='/Reports/ChangeLog/Details' element={<PrivateRoute auth={props.EmpId}><ChangeLogDetails /></PrivateRoute>} />
                        <Route exact path='/Reports/Register/Details' element={<PrivateRoute auth={props.EmpId}><RegisterDetail /></PrivateRoute>} />


                        {/* Vehicle Reporting */}
                        <Route exact path='/VehicleReport' element={<PrivateRoute auth={props.EmpId}><VehicleReport /></PrivateRoute>} />

                        <Route exact path='/UserReport' element = {<PrivateRoute auth={props.EmpId}><UserReport /></PrivateRoute>} />



                  </Routes>
            </>
      );
}

const mapStateToProps = (state) => {
      return {
            EmpId: state.loginreducer.isAuth,
            EMPID: state.loginreducer.details
      }
}

export default connect(mapStateToProps, {getVehicleDetails})(Main);