import React, { useState } from "react";
import Header from "../../Components/Header";
import toast from "react-hot-toast";

function ChangePassword(props) {

  console.log("props", props.emp_ID)
  const [emp_ID, setEmp_ID] = useState(props.emp_ID);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(""); 

    try {
      const response = await fetch("https://gateentryapi.rrparkon.net:6008/Employee/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EMPLOYEE_ID: props.emp_ID,
          PASSWORD: newPassword,
          currentPass: currentPassword
        }),
      });

      const text = await response.text();

      if (response.status == 201) {
        toast.success("Password updated successfully");
        handleCancel(); 
      } else {
        setError(text || "Failed to update password");
      }
    } catch (err) {
      toast.error("Failed to update password");
      console.error(err);
      setError("Something went wrong");
    }
  };



  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };


  return (
    <>
      <Header />
      <div
        style={{
          backgroundColor: "#eaf6fc",
          height: "91.5vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            width: "400px",
          }}
        >
          <div style={{ marginBottom: "2rem", fontFamily: "Inter", fontWeight: "600" }}>
            Create New Password
          </div>

          {/* Current Password */}
          {/* Current Password */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={labelStyle}>Enter Current Password</div>
            <div style={inputWrapperStyle}>
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={inputStyle}
                required
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
              />
              {currentPassword && (
                <span onClick={() => setShowCurrent(!showCurrent)} style={eyeStyle}>
                 {showCurrent ? "🐵" : "🙈"}
                </span>
              )}
            </div>
          </div>

          {/* New Password */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={labelStyle}>Enter New Password</div>
            <div style={inputWrapperStyle}>
              <input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
                required
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
              />
              {newPassword && (
                <span onClick={() => setShowNew(!showNew)} style={eyeStyle}>
                  {showNew ? "🐵" : "🙈"}
                </span>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={labelStyle}>Confirm New Password</div>
            <div style={inputWrapperStyle}>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                required
              />
              {confirmPassword && (
                <span onClick={() => setShowConfirm(!showConfirm)} style={eyeStyle}>
                 {showConfirm ? "🐵" : "🙈"}
                </span>
              )}
            </div>
          </div>
          {error && (
            <div style={{ color: "#d32f2f", marginLeft: "1rem", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}


          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button
              type="button"
              onClick={handleCancel}
              style={cancelStyle}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={submitStyle}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const inputWrapperStyle = {
  position: "relative",
  width: "80%",
  marginLeft: "1rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.5rem 1rem",
  paddingRight: "2.5rem",
  borderRadius: "20px",
  border: "1px solid #00a1e0",
  outline: "none",
};

const eyeStyle = {
  position: "absolute",
  top: "50%",
  right: "-40px",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "1.2rem",
};

const labelStyle = {
  fontWeight: "500",
  color: "#074359",
  marginBottom: "0.2rem",
  marginLeft: "1rem",
  fontFamily: "Roboto",
};

const cancelStyle = {
  backgroundColor: "#fff",
  color: "#d32f2f",
  border: "1px solid #d32f2f",
  borderRadius: "6px",
  padding: "0.4rem 1rem",
  cursor: "pointer",
};

const submitStyle = {
  background: "radial-gradient(circle, #00B8EE 100%, #17A1D4 100%)",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "0.4rem 1.2rem",
  cursor: "pointer",
};

export default ChangePassword;
