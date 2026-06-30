import Fuse from "fuse.js"

const initialState = {
      entryData: [],
      vehicleData:[],
      

}

export default function (state = initialState, action) {
      switch (action.type) {
            case 'ENTRY_DATA':
                  return { ...state, entryData: action.payload }
            case 'VEHICLE_DATA':
                  // console.log("reducer",action.payload)     
                  return{...state,vehicleData:action.payload} 

            default:
                  return state
      }
}