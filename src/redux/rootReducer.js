import {combineReducers} from 'redux'
 import gameSlice from './reducers/gameSlice';
import roomReducer from "./reducers/RoomSlice";
const rootReducer = combineReducers({
 game :gameSlice , // persisted
room: roomReducer,   // ❌ NOT persisted
})
export default rootReducer;