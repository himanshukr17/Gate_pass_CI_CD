import axios from "axios";
import api from '../../utils/api'

export const ChangeData = (resImg, data, id) => async (dispatch, getState) => {
      // console.log("api--->",`${api.protocol}${api.url}${api.login}`,{...data});
      return new Promise((resolve, reject) => {
            dispatch({ type: "SET_MODAL", payload: { show: true } })
            var formData = new FormData();
            // if (resImg)
            //       formData.append('image', {
            //             name: resImg[0].name,
            //             type: resImg[0].type,
            //             uri: resImg[0].uri
            //       });
            // formData.append("REPORTING_DATETIME", (data.VEHICLEREPDATE).toString());
            // formData.append("INWARD_DATETIME", (data.INDATE).toString());
            // formData.append("INVOICE_NO", data.INVOICE);
            // formData.append("DOCUMENT_DATE", (data.DOCDATE).toString());
            // formData.append("VENDOR_NAME", data.VENDORNAME);
            // formData.append("VENDOR_ID", data.VENDOR_ID);
            // formData.append("MODE_OF_TRANSPORT", data.MOT);
            // formData.append("VEHICLE_NO", data.VEHICLENO);
            // formData.append("VEHICLE_CATEGORY", data.VEHCAT);
            // formData.append("TYPE", 1);
            // formData.append("DRIVER_NAME", data.DRIVERNAME);
            // formData.append("MOBILE_NUMBER", data.MOBILE);
            // formData.append("ROAD_PERMIT_NUMBER", data.ROADPERMIT);
            // formData.append("PLANT", data.PLANT);
            // formData.append("LR_NO", data.LR);
            // // formData.append("LR_DATE", data.LRDATE);
            // formData.append("PACKAGES", data.PACKAGES);
            // formData.append("LR_DATE", (data.LRDATE).toString());

            formData.append("OUTWARD_DATETIME", (data.OUTDATE).toString());

            // console.log("Details.toString()",Details.toString())
            // formData.append("Details", Details);


            // console.log(`${api.protocol}${api.url}${api.changeEntry}id=${id}`,
            //       formData)
            axios.post(`${api.protocol}${api.url}${api.changeEntry}id=${id}`,
                  formData
                  , {
                        headers: {
                              'Accept': '*/*',
                              'Content-Type': 'multipart/form-data'
                        }
                  }).then((response) => {
                        // console.log(response.data, response.status);
                        if (response.status == 200) {
                              resolve("success")
                              // console.log("sucess")
                              // console.log(response.data)
                        }
                        else {
                              resolve(404)
                              console.log("error");
                        }

                  }).catch((err) => {
                        console.log(err);
                        resolve("success")

                  })
      })
};