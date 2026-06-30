import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSignIn } from 'react-auth-kit';
import { Link, useLocation, useNavigate } from 'react-router-dom';



function UserLogin() {
      const [ConnectingDB, setConnectingDB] = useState('');
      const [connectingCompany, setConnectingCompany] = useState('');



      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      const connecting = queryParams.get('login_challenge');
      const connectingCompanyParam = queryParams.get('portal_login');
      const origin = window.location.origin; // Get the current origin
      const apiURL = btoa(`${origin}/userlogin`);



      useEffect(() => {
            setConnectingCompany(atob(connectingCompanyParam));
            setConnectingDB(atob(connecting));
            localStorage.setItem('login_challenge', connecting);
            localStorage.setItem('portal_login', connectingCompanyParam);
            localStorage.setItem('login_user', apiURL);
      }, [connecting, connectingCompanyParam, apiURL]);



      const companyAuth = localStorage.getItem('portal_login');



      const navigate = useNavigate();
      const signIn = useSignIn();
      const [userName, setUsername] = useState('');
      const [customerID, setCustomerID] = useState('');
      const [password, setPassword] = useState('');
      const [customerPassword, setCustomerPassword] = useState('');
      const [inavlidData, setInavlidData] = useState(false);
      const emp = 'emp';
      const cust = 'cust';
      const handleSubmit = (event) => {
            event.preventDefault();
            // console.log(`${ConnectingDB}Employee/emp_login?id=${userName}&password=${password}`)
            axios
                  .get(`${ConnectingDB}Employee/emp_login?id=${userName}&password=${password}`)
                  .then((response) => {
                        if (response.data.length === 0) {
                              setInavlidData(true);
                        } else {
                              localStorage.setItem('userDefine', emp);
                              signIn({
                                    token: response.data[0]._id,
                                    expiresIn: 3600,
                                    tokenType: 'Bearer',
                                    authState: { auth_id: response.data[0].EMP_ID }
                              });
                              window.location.assign('/dashboardEmp');
                        }
                  })
                  .catch((err) => console.log(err));
      };
      const handleSubmitCustomer = (event) => {
            event.preventDefault();
            console.log(`${ConnectingDB}Customer/customer_login?distributor_id=${customerID}&password=${customerPassword}`);
            axios
                  .get(`${ConnectingDB}Customer/customer_login?distributor_id=${customerID}&password=${customerPassword}`)
                  .then((response) => {
                        if (response.data.length === 0) {
                              setInavlidData(true);
                        } else {
                              localStorage.setItem('userDefine', cust);



                              signIn({
                                    token: response.data[0]._id,
                                    expiresIn: 3600,
                                    tokenType: 'Bearer',
                                    authState: { auth_id: response.data[0].DISTRIBUTOR_ID }
                              });
                              window.location.assign('/dashboard');
                        }
                  })
                  .catch((err) => console.log(err));
      };
      const [activeTab, setActiveTab] = useState(1);



      const handleTabChange = (tabNumber) => {
            setActiveTab(tabNumber);
      };



      return (



            <div className="login-page" style={{
                  backgroundImage: `url('dist/img/Agriculture.jpg')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundAttachment: 'fixed',
                  backgroundSize: '100% 100%',
            }}>
                  <p style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '26px',
                        color: '#fff',
                        top: 0,
                        marginTop: '-30px',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                  }}>
                        {atob(companyAuth)}
                  </p>



                  <div className="login-box">
                        <div className="card">



                              <div className=" login-card-body">
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                          <img src="dist/img/Suprsales.png" width={50} height={50} className="d-inline-block align-top" />
                                          <img src="dist/img/SuprsalesText.png" width="100%" height={60} className="d-inline-block align-top" />
                                    </div>
                                    <div >
                                          <ul className="nav nav-tabs" role="tablist">
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <li className="nav-item">
                                                      <a
                                                            className={`nav-link ${activeTab === 1 ? 'active' : ''}`}
                                                            onClick={() => handleTabChange(1)}
                                                            role="tab"
                                                            aria-selected={activeTab === 1}
                                                            style={{ cursor: 'pointer' }}
                                                      >
                                                            Employee
                                                      </a>
                                                </li>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <li className="nav-item">
                                                      <a
                                                            className={`nav-link ${activeTab === 2 ? 'active' : ''}`}
                                                            onClick={() => handleTabChange(2)}
                                                            role="tab"
                                                            aria-selected={activeTab === 2}
                                                            style={{ cursor: 'pointer' }}
                                                      >
                                                            Customer
                                                      </a>
                                                </li>
                                          </ul>
                                    </div>
                                    <br />
                                    <div >
                                          {activeTab === 1 && <div>



                                                <form onSubmit={handleSubmit}>
                                                      <div className="input-group mb-3">
                                                            <input
                                                                  type="text"
                                                                  className="form-control"
                                                                  placeholder="Employee ID"
                                                                  value={userName}
                                                                  required
                                                                  onChange={(event) => setUsername(event.target.value)}
                                                            />
                                                            <div className="input-group-append">
                                                                  <div className="input-group-text">
                                                                        <span className="fas fa-envelope"></span>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                      <div className="input-group mb-3">
                                                            <input
                                                                  type="password"
                                                                  className="form-control"
                                                                  placeholder="Password"
                                                                  value={password}
                                                                  required
                                                                  onChange={(event) => setPassword(event.target.value)}
                                                            />
                                                            <div className="input-group-append">
                                                                  <div className="input-group-text">
                                                                        <span className="fas fa-lock"></span>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                      {inavlidData &&
                                                            <p style={{ color: 'red', fontSize: '15px' }}>Invalid Username or Password</p>}
                                                      <div className="row">
                                                            <div className="col-8">
                                                                  <div className="icheck-primary">
                                                                  </div>
                                                            </div>
                                                            <div className="col-4">
                                                                  <button type="submit" className="btn btn-primary btn-block">
                                                                        Sign In
                                                                  </button>
                                                            </div>
                                                      </div>
                                                </form>
                                          </div>}
                                          {activeTab === 2 && <div>



                                                <form onSubmit={handleSubmitCustomer}>
                                                      <div className="input-group mb-3">
                                                            <input
                                                                  type="text"
                                                                  className="form-control"
                                                                  placeholder="Customer ID"
                                                                  value={customerID}
                                                                  required
                                                                  onChange={(event) => setCustomerID(event.target.value)}
                                                            />
                                                            <div className="input-group-append">
                                                                  <div className="input-group-text">
                                                                        <span className="fas fa-envelope"></span>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                      <div className="input-group mb-3">
                                                            <input
                                                                  type="password"
                                                                  className="form-control"
                                                                  placeholder="Password"
                                                                  value={customerPassword}
                                                                  required
                                                                  onChange={(event) => setCustomerPassword(event.target.value)}
                                                            />
                                                            <div className="input-group-append">
                                                                  <div className="input-group-text">
                                                                        <span className="fas fa-lock"></span>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                      {inavlidData &&
                                                            <p style={{ color: 'red', fontSize: '15px' }}>Invalid Username or Password</p>}
                                                      <div className="row">
                                                            <div className="col-8">
                                                                  <div className="icheck-primary">
                                                                        {/* <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
<label htmlFor="remember">
                  Remember Me
</label> */}
                                                                  </div>
                                                            </div>
                                                            <div className="col-4">
                                                                  <button type="submit" className="btn btn-primary btn-block">
                                                                        Sign In
                                                                  </button>
                                                            </div>
                                                      </div>
                                                </form>
                                          </div>}
                                    </div>




                                    {/* <div className="social-auth-links text-center mb-3">
<p></p>

 

              </div> */}
                                    <p className="mb-1">
                                          <Link to='/forget-password' style={{ textDecoration: 'none' }}>



                                                <a >I forgot my password</a>
                                          </Link>
                                    </p>
                                    <p className="mb-0">
                                          {/* <a href="register.html" className="text-center">
            Register a new membership
</a> */}
                                    </p>
                              </div>
                              <div className="card-footer text-left">
                                    Samishti Infotech Pvt Ltd
                              </div>
                        </div>
                  </div>
                  <div className="mobapp">
                        <form className="form-horizontal">
                              <a href="https://play.google.com/store/apps/details?id=com.vinderpos3" className="btn btn-info btn-lg"><i className="fas fa-download" />
                                    Click here to Download Mobile App
                              </a>
                        </form>
                  </div>



            </div>
      )
}



export default UserLogin