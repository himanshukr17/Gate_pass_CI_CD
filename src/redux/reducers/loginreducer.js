import Fuse from "fuse.js"

const initialState = {
      isAuth: false,
      details: "",
      isAdmin:1,
      name:""
}

export default function (state = initialState, action) {
      switch (action.type) {

            case 'PROFILE':
                  console.log("reducer",action.payload)
                  return { ...state, ...action.payload }

            default:
                  return state
      }

}