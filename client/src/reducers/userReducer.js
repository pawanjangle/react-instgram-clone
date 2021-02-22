const initialState = {
  user: null,
  authenticated: false,
};
const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload.user, authenticated: true };
    case "CLEAR":
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    default:
      return state;
  }
};
export default UserReducer;
