import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL

export const StoData = (data) => async (dispatch, getState) => {
    // console.log(`${apiURL}Employee/sto_data`, data)
    return new Promise((resolve, reject) => {
      axios.post(`${apiURL}Employee/sto_data`, data
      ).then((response) => {
        // console.log(response)
        if (response.status == 200) {
          resolve(response)
          // console.log("res")
        }
        else {
          reject(404)
          console.log("error");
        }
      }).catch((err) => {
            reject(400)
        console.log(err)
      })
    })
  };