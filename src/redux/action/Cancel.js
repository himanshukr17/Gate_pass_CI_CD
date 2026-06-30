import axios from "axios";
import api from '../../utils/api'

export const Cancel = (entry) => async (dispatch, getState) => {
      // console.log("api--->", `${api.protocol}${api.url}${api.login}id=${entry}`);
      return new Promise((resolve, reject) => {
            axios.get(`${api.protocol}${api.url}${api.cancelEntry}id=${entry}`).then((response) => {

                  if (response.status == 200) {
                        resolve("success")
                        // console.log("comming-->", response.data);
                        // delete response.data[0].PASSWORD
                        dispatch({
                              type: "CANCEL", payload: {
                                    isAuth: true,
                                    // details: response.data[0].EMPLOYEE_ID
                              }
                        })
                  }
                  else {
                        resolve(404)
                        console.log("error");
                        // dispatch({type:"SET_MODAL",payload:{show:false}})
                  }
            }).catch((err) => {
                  reject(400)
                  console.log("err");

            })
      })
};