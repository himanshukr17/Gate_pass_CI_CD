import axios from "axios";
import api from '../../utils/api'
const apiURL = process.env.REACT_APP_API_URL

export const SignupData = (data, id) => async (dispatch, getState) => {
      return new Promise((resolve, reject) => {
            //   console.log("api--->", data);

            let senddata = {
                  // "EMPLOYEE_ID": data.USER,
                  "EMPLOYEE_NAME": data.NAME,
                  "MOBILE": data.MOB,
                  "EMAIL": data.MAIL,
                  "PLANT": Array.isArray(data.PLANT) ? data.PLANT : [data.PLANT],
                  "ROLE": Array.isArray(data.ROLE) ? data.ROLE : [data.ROLE],
                  // "FLAG": 1,
                  // "ISADMIN": 1
            }

            console.log("hello there api and data",`${apiURL}Employee/Emp_signup?id=${id}`,senddata)
            axios.post(`${apiURL}Employee/Emp_signup?id=${id}`,
                  senddata).then((response) => {
                        console.log("inside then",response.status)
                        // console.log(response.data, response.status);
                        if (response.status == 200) {
                              resolve(response)
                              // console.log("sucess")
                              // console.log(response.data)
                        }
                        else {
                              reject(404)
                              console.log("error");
                        }

                  }).catch((err) => {
                        console.log("inside catch",err);
                        reject(err)

                  })
      })
};