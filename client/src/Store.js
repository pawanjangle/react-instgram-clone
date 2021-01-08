import { createStore, applyMiddleware } from "redux";
import  reducer  from "./reducers/userReducer";
import thunk  from "redux-thunk"
const Store = createStore(reducer, applyMiddleware(thunk));
export default Store;