import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import PostReducer from "./PostReducer";
const rootReducer = combineReducers({
  user: UserReducer, 
  post: PostReducer, 
});
export default rootReducer;
