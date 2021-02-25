const initialState = {
  userProfile: null,
  userPosts: [],
  user: null,
  authenticated: false,
  token: null
};
const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload.user, token: action.payload.token, authenticated: true };
    case "SET_PROFILE_PIC":
      return { ...state, user: action.payload.updatedUser };
    case "GET_USER_PROFILE":
      return { ...state, userProfile: action.payload.userProfile,
      userPosts: action.payload.posts };
    case "UPDATE_FOLLOW":
      return { ...state, userProfile: action.payload.updatedUser,
      };
    case "UPDATE_UNFOLLOW":
      return { ...state, userProfile: action.payload.updatedUser,
      };
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
