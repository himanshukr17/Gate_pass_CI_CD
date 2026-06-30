import axios from 'axios';
const apiURL = process.env.REACT_APP_API_URL

export const vehicleRegister = (data) => async (dispatch, getState) => {
  // console.log(`${apiURL}Vehicle/Vehicle_Reporting`, data);

  // try {
  //     const response = await axios.post(`${apiURL}Vehicle/Vehicle_Reporting`, data);
  //     if (response.status === 200) {
  //         return response; 
  //     } else {
  //         throw new Error(`Unexpected response status: ${response.status}`);
  //     }
  // } catch (err) {
  //     console.error(err);
  //     throw err; 
  // }
  // console.log(data,"Reduxdata")
   return new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}Vehicle/Vehicle_Reporting`, data)
      .then((response) => {
        if (response.status === 200) {
          console.log("✅ API Success:", response);
          resolve(response);
        } else {
          console.warn("⚠️ Unexpected response status:", response.status);
          reject("Unexpected response status");
        }
      })
      .catch((err) => {
        console.log("❌ Full error response from API:", err.response);
        const errorData = err.response?.data;

        let errorMessage;

        if (typeof errorData === "string") {
          errorMessage = errorData; 
        } else if (typeof errorData === "object") {
          errorMessage =
            errorData.message ||
            errorData.error ||
            errorData.detail ||
            (Array.isArray(errorData.errors)
              ? errorData.errors.join(", ")
              : "Unknown API error");
        } else {
          errorMessage = "Something went wrong. Please try again.";
        }

        reject(errorMessage);
      });
  });
};
