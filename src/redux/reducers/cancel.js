import Fuse from "fuse.js"

const initialState = {
      isAuth: false,
      cancel: ""
}

export default function (state = initialState, action) {
      switch (action.type) {

            case 'CANCEL':
                  // console.log("reducer",action.payload)
                  return { ...state, ...action.payload }

            default:
                  return state
      }

}