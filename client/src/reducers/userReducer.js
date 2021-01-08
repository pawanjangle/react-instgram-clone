import { SETUSER } from "../types";
const reducer = (state = [], action) => {
  switch (action.type) {
   
    case SETUSER:
      return {user: action.payload,
      authenticated: true}
    case "CLEAR":
      return {
        ...state,
        authenticated: false,
        user: null
      }
    default:
      return state
  }
};
export default reducer;
