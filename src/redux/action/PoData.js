import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

export const PoData = (data) => async (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    axios.post(`${apiURL}Employee/po_data`, data)
      .then((response) => {
        if (response.status === 200) {
          resolve(response); 
        } else {
          reject({ status: response.status, message: "Unexpected error occurred" });
        }
      })
      .catch((err) => {
        console.log("error we have",err)
        const errorMsg = err.response?.data || "Something went wrong!";
        reject({ status: err.response?.status || 500, message: errorMsg });
      });
  });
};

export const AsnData = (data) => async (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const asn = data.asn;
    axios
      .get(`${apiURL}Entry/getAdvanceShipment?ASN_ID=${asn}`)
      .then((response) => {
        console.log("response from ASN", response);
        resolve({
          status: response.status,
          data: response.data,
        });
      })
      .catch((err) => {
        console.error("ASN API error:", err);
        const errorMsg = err.response?.data?.message || err.response?.data || "Something went wrong!";
        reject({
          status: err.response?.status || 500,
          message: errorMsg,
        });
      });
  });
};


  export const outstoData = (data) => async (dispatch, getState) => {
    // console.log(`${apiURL}Employee/out_data`, data)
    return new Promise((resolve, reject) => {
      axios.post(`${apiURL}Employee/out_data`, data
      ).then((response) => {
        // console.log(response)
        if (response.status == 200) {
          resolve(response)
        }
        else {
          resolve(404)
          console.log("error");
        }
      }).catch((err) => {
        reject(400)
        console.log("err")
      })
    })
  };