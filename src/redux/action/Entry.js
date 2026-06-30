import axios from "axios";
import api from '../../utils/api'
import { error } from "jquery";
const apiURL = process.env.REACT_APP_API_URL;

export const EntryData = (resImg, data, Details, type, id) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        // console.log("Input Data:", { resImg, data, Details, type, id });

        const formData = new FormData();

        if (resImg && Array.isArray(data.ATTACHMENT)) {
            data.ATTACHMENT.forEach((file) => {
                formData.append("ATTACHMENT", file); 
            });
        }

        // Safely append values
        formData.append("REPORTING_DATETIME", data?.VEHICLEREPDATE?.toString() || "");
        
        formData.append("INVOICE_NO", data?.INVOICE?.toString() || "");
        formData.append("DOCUMENT_DATE", data?.DOCDATE?.toString() || "");
        formData.append("VENDOR_NAME", data?.VENDORNAME?.toString() || "");
        formData.append("VENDOR_ID", data?.VENDOR_ID?.toString() || "");
        formData.append("MODE_OF_TRANSPORT", data?.MOT?.toString() || "");
        formData.append("VEHICLE_NO", data?.VEHICLENO?.toString() || "");
        formData.append("VEHICLE_CATEGORY", data?.VEHCAT?.toString() || "");
        formData.append("TYPE", type?.toString() || "");
        formData.append("DRIVER_NAME", data?.DRIVERNAME?.toString() || "");
        formData.append("MOBILE_NUMBER", data?.MOBILE?.toString() || "");
        formData.append("ROAD_PERMIT_NUMBER", data?.ROADPERMIT?.toString() || "");
        formData.append("PLANT", data?.PLANT?.toString() || "");
        formData.append("LR_NO", data?.LR?.toString() || "");
        formData.append("VEHICLE_KEY", data?.VEHICLE_KEY?.toString() || "");
        formData.append("LR_DATE", data?.LRDATE?.toString() || "");
        formData.append("PACKAGES", data?.PACKAGES?.toString() || "");
        formData.append("Flag_Updation", data?.FLAG_UPDATION?.toString() || "");
        formData.append("Details", (Details)); // Ensure JSON format

        // Debug FormData
        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        axios.post(`${apiURL}Entry/EntryWithPo?id=${id}`, formData, {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            if (response.status === 200) {
                resolve(response);
                // console.log("Success:", response.data);
            } else {
                resolve(404);
                console.log("Error: Unexpected status code");
            }
        })
        .catch(err => {
            console.error("API Error:", err);
            reject(err);
        });
    });
};
export const OutData = (resImg, data, Details, type, id) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        // console.log("Input Data:", { resImg, data, Details, type, id });

        const formData = new FormData();

        if (resImg && Array.isArray(data.ATTACHMENT)) {
            data.ATTACHMENT.forEach((file) => {
                formData.append("ATTACHMENT", file); // Appending files properly
            });
        }

        // Safely append values
        formData.append("REPORTING_DATETIME", data?.VEHICLEREPDATE?.toString() || "");
        
        formData.append("INVOICE_NO", data?.INVOICE?.toString() || "");
        formData.append("DOCUMENT_DATE", data?.DOCDATE?.toString() || "");
        formData.append("VENDOR_NAME", data?.VENDORNAME?.toString() || "");
        formData.append("VENDOR_ID", data?.VENDOR_ID?.toString() || "");
        formData.append("MODE_OF_TRANSPORT", data?.MOT?.toString() || "");
        formData.append("VEHICLE_NO", data?.VEHICLENO?.toString() || "");
        formData.append("VEHICLE_CATEGORY", data?.VEHCAT?.toString() || "");
        formData.append("TYPE", type?.toString() || "");
        formData.append("DRIVER_NAME", data?.DRIVERNAME?.toString() || "");
        formData.append("MOBILE_NUMBER", data?.MOBILE?.toString() || "");
        formData.append("ROAD_PERMIT_NUMBER", data?.ROADPERMIT?.toString() || "");
        formData.append("PLANT", data?.PLANT?.toString() || "");
        formData.append("LR_NO", data?.LR?.toString() || "");
        formData.append("VEHICLE_KEY", data?.VEHICLE_KEY?.toString() || "");
        formData.append("LR_DATE", data?.LRDATE?.toString() || "");
        formData.append("PACKAGES", data?.PACKAGES?.toString() || "");
        formData.append("Details", (Details)); // Ensure JSON format

        // Debug FormData
        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        axios.post(`${apiURL}outward/outwardentry?id=${id}`, formData, {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            if (response.status === 200) {
                resolve(response);
                // console.log("Success:", response.data);
            } else {
                resolve(404);
                console.log("Error: Unexpected status code");
            }
        })
        .catch(err => {
            console.error("API Error:", err);
            reject(err);
        });
    });
};

  export const EntryDataWithoutPo = (resImg, data, Details, type, id) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        // console.log("Input Data:", { resImg, data, Details, type, id });

        const formData = new FormData();

        // Handle Attachments
        if (resImg && Array.isArray(data.ATTACHMENT)) {
            data.ATTACHMENT.forEach((file) => {
                formData.append("ATTACHMENT", file); 
            });
        }

        // Append Fields with Safe Defaults
        formData.append("REPORTING_DATETIME", data.VEHICLEREPDATE?.toString() || "");
        formData.append("INVOICE_NO", data.INVOICE?.toString() || "");
        formData.append("DOCUMENT_DATE", data.DOCDATE?.toString() || "");
        formData.append("VENDOR_NAME", data.VENDORNAME?.toString() || "");
        formData.append("VENDOR_ID", data.VENDOR_ID?.toString() || "");
        formData.append("MODE_OF_TRANSPORT", data.MOT?.toString() || "");
        formData.append("VEHICLE_NO", data.VEHICLENO?.toString() || "");
        formData.append("VEHICLE_CATEGORY", data.VEHCAT?.toString() || "");
        formData.append("TYPE", type?.toString() || "");
        formData.append("DRIVER_NAME", data.DRIVERNAME?.toString() || "");
        formData.append("MOBILE_NUMBER", data.MOBILE?.toString() || "");
        formData.append("ROAD_PERMIT_NUMBER", data.ROADPERMIT?.toString() || "");
        formData.append("PLANT", data.PLANT?.toString() || "");
        formData.append("LR_NO", data.LR?.toString() || "");
        formData.append("VEHICLE_KEY", data.VEHICLE_KEY?.toString() || "");
        formData.append("LR_DATE", data.LRDATE?.toString() || "");
        formData.append("PACKAGES", data.PACKAGES?.toString() || "");
        formData.append("Details", Details || "[]");
        
        // Debugging - Check if any field is undefined
        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        // API Call
        axios.post(`${apiURL}Entry/EntryDataWithoutPo?id=${id}`, formData, {
            headers: { 'Accept': '*/*' }
        })
        .then(response => {
            if (response.status === 200) {
                resolve(response);
                // console.log("Success:", response.data);
            } else {
                resolve(404);
                console.log("Error: Unexpected status code");
            }
        })
        .catch(err => {
            console.error("API Error:", err);
            reject(err);
        });
    });
};


export const GetEntry = (id) => async (dispatch, getState) => {
      // console.log("api--->",`${api.protocol}${api.url}${api.login}`,{...data});
      return new Promise((resolve, reject) => {
            console.log("---->", `${api.protocol}${api.url}${api.getEntry}id=${id}`)
            axios.get(`${api.protocol}${api.url}${api.getEntry}id=${id}`).then((response) => {
                  // console.log(response.data, response.status);       
                  if (response.status == 200) {
                        resolve(response.data)
                        // dispatch({ type: "ENTRY_DATA", payload: response.data })
                        // console.log(response.data)
                  }
                  else {
                        resolve(404)
                        // dispatch({ type: "ENTRY_DATA", payload: [] })

                        console.log("error");
                  }

            }).catch((err) => {
                  console.log("error", err);
                  // dispatch({ type: "ENTRY_DATA", payload: [] })
                  // reject("success")

            })
      })
};

export const getVehicleDetails = () => async (dispatch,getState)=>{
 
    return new Promise ((resolve,reject)=>{
        axios.get(`${apiURL}Vehicle/GetAllVehicle`).then ((response)=>{
            if(response.status == 200){
                // console.log("action",response.data)
                resolve(response.data)
                dispatch({type:"VEHICLE_DATA",payload:response.data})
            }
            else{
                resolve(404)
                console.log(error)
                dispatch({type:"VEHICLE_DATA",payload:[]})
            }
            
        }).catch((err)=>{
            console.log("errror",err)
        })
    })

}

export const OutNRGP = (resImg, data, Details, type, id) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        // console.log("Input Data:", { resImg, data, Details, type, id });

        const formData = new FormData();

        // Handle Attachments
        if (resImg && Array.isArray(data.ATTACHMENT)) {
            data.ATTACHMENT.forEach((file) => {
                formData.append("ATTACHMENT", file); 
            });
        }

        // Append Fields with Safe Defaults
        formData.append("REPORTING_DATETIME", data.VEHICLEREPDATE?.toString() || "");
        formData.append("INWARD_DATETIME", data.INDATE?.toString() || "");
        formData.append("INVOICE_NO", data.INVOICE?.toString() || "");
        formData.append("DOCUMENT_DATE", data.DOCDATE?.toString() || "");
        formData.append("VENDOR_NAME", data.VENDORNAME?.toString() || "");
        formData.append("VENDOR_ID", data.VENDOR_ID?.toString() || "");
        formData.append("MODE_OF_TRANSPORT", data.MOT?.toString() || "");
        formData.append("VEHICLE_NO", data.VEHICLENO?.toString() || "");
        formData.append("VEHICLE_CATEGORY", data.VEHCAT?.toString() || "");
        formData.append("TYPE", type?.toString() || "");
        formData.append("DRIVER_NAME", data.DRIVERNAME?.toString() || "");
        formData.append("MOBILE_NUMBER", data.MOBILE?.toString() || "");
        formData.append("ROAD_PERMIT_NUMBER", data.ROADPERMIT?.toString() || "");
        formData.append("PLANT", data.PLANT?.toString() || "");
        formData.append("LR_NO", data.LR?.toString() || "");
        formData.append("VEHICLE_KEY", data.VEHICLE_KEY?.toString() || "");
        formData.append("LR_DATE", data.LRDATE?.toString() || "");
        formData.append("PACKAGES", data.PACKAGES?.toString() || "");
        formData.append("Details", Details || "[]"); // Ensure Details is a valid string

        // Debugging - Check if any field is undefined
        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        // API Call
        axios.post(`${apiURL}outward/outwardRGP?id=${id}`, formData, {
            headers: { 'Accept': '*/*' }
        })
        .then(response => {
            if (response.status === 200) {
                resolve(response);
                // console.log("Success:", response.data);
            } else {
                resolve(404);
                console.log("Error: Unexpected status code");
            }
        })
        .catch(err => {
            console.error("API Error:", err);
            reject(err);
        });
    });
};

export const EntryASN = (resImg, data, Details, type, id) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        // console.log("Input Data:", { resImg, data, Details, type, id });

        const formData = new FormData();

        if (resImg && Array.isArray(data.ATTACHMENT)) {
            data.ATTACHMENT.forEach((file) => {
                formData.append("ATTACHMENT", file); // Appending files properly
            });
        }

        // Safely append values
        formData.append("ASN",data?.ASN?.toString() || "");
        formData.append("REPORTING_DATETIME", data?.VEHICLEREPDATE?.toString() || "");
        
        formData.append("INVOICE_NO", data?.INVOICE?.toString() || "");
        formData.append("DOCUMENT_DATE", data?.DOCDATE?.toString() || "");
        formData.append("VENDOR_NAME", data?.VENDORNAME?.toString() || "");
        formData.append("VENDOR_ID", data?.VENDOR_ID?.toString() || "");
        formData.append("MODE_OF_TRANSPORT", data?.MOT?.toString() || "");
        formData.append("VEHICLE_NO", data?.VEHICLENO?.toString() || "");
        formData.append("VEHICLE_CATEGORY", data?.VEHCAT?.toString() || "");
        formData.append("TYPE", type?.toString() || "");
        formData.append("DRIVER_NAME", data?.DRIVERNAME?.toString() || "");
        formData.append("MOBILE_NUMBER", data?.MOBILE?.toString() || "");
        formData.append("ROAD_PERMIT_NUMBER", data?.ROADPERMIT?.toString() || "");
        formData.append("PLANT", data?.PLANT?.toString() || "");
        formData.append("LR_NO", data?.LR?.toString() || "");
        formData.append("VEHICLE_KEY", data?.VEHICLE_KEY?.toString() || "");
        formData.append("LR_DATE", data?.LRDATE?.toString() || "");
        formData.append("PACKAGES", data?.PACKAGES?.toString() || "");
        formData.append("Details", (Details)); // Ensure JSON format

        // Debug FormData
        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        axios.post(`${apiURL}Entry/EntryDataWithASN?id=${id}`, formData, {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            if (response.status === 200) {
                resolve(response);
                // console.log("Success:", response.data);
            } else {
                resolve(404);
                console.log("Error: Unexpected status code");
            }
        })
        .catch(err => {
            console.error("API Error:", err);
            reject(err);
        });
    });
};