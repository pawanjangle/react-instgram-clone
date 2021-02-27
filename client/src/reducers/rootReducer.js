import { combineReducers } from "redux";
import UserReducer from "./userReducer";
import PostReducer from "./PostReducer";
const rootReducer = combineReducers({
  user: UserReducer, 
  post: PostReducer, 
});
export default rootReducer;
