import { combineReducers } from 'redux';
import loginreducer from './loginreducer';
import entryReducer from './entryReducer';
export default combineReducers({
     loginreducer:loginreducer,
     entryReducer:entryReducer
})