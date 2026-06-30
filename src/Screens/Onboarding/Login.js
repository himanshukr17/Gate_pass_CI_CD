import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { LoginAction } from "../../redux/action/LoginAction";
import toast from "react-hot-toast";

function Login(props) {
  const navigate = useNavigate();
  const [data, setdata] = useState({ USER: "", PASS: "" });
  const [error, seterror] = useState({});

  const setValue = (val) => {
    setdata({ ...data, ...val });
  };

  const handlelogin = (e) => {
    if (e) e.preventDefault(); // Prevent page refresh on form submit

    let hasErr = false;
    let require = ["USER", "PASS"];
    let err = { USER: null, PASS: null };

    require.forEach((item) => {
      if (!data[item]) {
        hasErr = true;
        err[item] = "This field is mandatory";
      }
    });

    seterror(err);

    if (!hasErr) {
      props
      .LoginAction(data.USER, data.PASS)
      .then((res) => {
        if (res.status === "success") {
          const empName = res.EMP_NAME;
          console.log("Data here", res.EMP_NAME);
          localStorage.setItem("EMP_NAME", empName);
          navigate("/Home", { state: { user: empName } });

          toast.success(`${empName} Logged In successfully`);
        } else {
          toast.error("Invalid username or password");
        }
      })
      .catch((err) => {
        toast.error("Invalid username or password");
        console.log(err);
      });
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#EAFAFF" }}>
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "3rem",
        }}
      >
        <div className="logo" style={{ marginLeft: "15%" }}>
          <img src="../Images/Frame_logo.png" alt="Logo" style={{ width: "80%", height: "auto" }} />
        </div>
        <div style={{ alignItems: "left" }}>
          <h1 style={{ fontSize: "25px", fontWeight: "400", color: "#005878", fontFamily: "Roboto, sans-serif", marginBottom: "2rem" }}>
            Hello! It’s great to see you.
          </h1>
          <h2 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "3rem" }}>Login here</h2>

          {/* Wrap inputs in a form and trigger submission on Enter */}
          <form onSubmit={handlelogin} style={{ marginTop: "20px", width: "100%" }}>
            <label style={{ display: "block", fontWeight: "500", color: "#074359" }}>Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              value={data.USER}
              onChange={(e) => setValue({ USER: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handlelogin(e)} // Submit on Enter
              style={{
                width: "100%",
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingLeft: "12px",
                marginTop: "5px",
                border: "1px solid #b3e0f0",
                borderRadius: "100px",
                fontSize: "16px",
              }}
            />
            {error.USER && <span className="error" style={{ color: "red" }}>{error.USER}</span>}

            <label style={{ display: "block", fontWeight: "500", color: "#074359", marginTop: "15px" }}>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={data.PASS}
              onChange={(e) => setValue({ PASS: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handlelogin(e)} // Submit on Enter
              style={{
                width: "100%",
                paddingTop: "10px",
                paddingBottom: "10px",
                marginTop: "5px",
                paddingLeft: "12px",
                border: "1px solid #b3e0f0",
                borderRadius: "100px",
                fontSize: "16px",
              }}
            />
            {error.PASS && <span className="error" style={{ color: "red" }}>{error.PASS}</span>}

            {/* Login button */}
            <button
              type="submit" // Triggers form submission when Enter is pressed
              style={{
                marginTop: "2rem",
                width: "105%",
                background: "radial-gradient(circle, #00B8EE, #17A1D4)",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>

      <div
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img src="../Images/Frame_1635.png" alt="Gate Access" style={{ width: "100%" }} />
      </div>
    </div>
  );
}

export default connect(null, { LoginAction })(Login);
