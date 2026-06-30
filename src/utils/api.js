const apiURL = process.env.REACT_APP_API_URL1;
const apiProtocol = process.env.REACT_APP_API_PROTOCOL;


module.exports = {

  protocol: apiProtocol,

  // url: "103.25.131.12:3045/",
  //  url:"103.25.131.12:3045/",
  url: apiURL,
  // url:"localhost:3045/",

  login: 'Employee/Emp_login?',
  // getPlant: 'Employee/plant',
  // getPOdata: 'Employee/po_data',
  // createEntry: 'Entry/EntryWithPo?',
  getEntry: 'Entry/GetAllEntry?',
  changeEntry: 'Entry/changeEntry?',
  cancelEntry: 'Entry/cancelEntry?',
  signup: 'Employee/Emp_signup?',
  Report :'Vehicle/Vehicle_Reporting'
  //   file: 'images/'
}