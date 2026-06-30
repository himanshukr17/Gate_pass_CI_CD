import axios from "axios";
import api from '../../utils/api'

export const LoginAction = (email, pass) => async (dispatch, getState) => {
      console.log("api--->", `${api.protocol}${api.url}${api.login}id=${email}&pass=${pass}`);
      return new Promise((resolve, reject) => {
        axios
          .get(`${api.protocol}${api.url}${api.login}id=${email}&pass=${pass}`)
          .then((response) => {
            if (response.status === 200 && response.data.length > 0) {
              const userData = response.data[0];
              delete userData.PASSWORD;
    
              dispatch({
                type: "PROFILE",
                payload: {
                  isAdmin: userData.ISADMIN,
                  isAuth: true,
                  details: userData.EMPLOYEE_ID,
                  name: userData.EMPLOYEE_NAME,
                },
              });
    
              // Now resolve with full user data
              resolve({
                status: "success",
                EMP_NAME: userData.EMPLOYEE_NAME,
                ID: userData.EMPLOYEE_ID,
              });
            } else {
              resolve({ status: "error" });
              console.log("error");
            }
          })
          .catch((err) => {
            reject({ status: "error", error: err });
            console.log("err", err);
          });
      });
    };
    

export const Logout = () => async (dispatch, getState) => {
      dispatch({
            type: "PROFILE", payload: {
                  isAdmin:1,
                  isAuth: false,
                  details: []
            }
      })

      window.location.reload();
}