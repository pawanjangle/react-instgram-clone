const initialState = {
  followedPost: [],
  allPosts: [],
  myPosts: []
};
const PostReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ALL_POSTS":
      return { ...state,
        allPosts: action.payload.posts
       };
    case "FOLLOWED_POSTS":
      return {
        ...state,
        followedPosts: action.payload.posts,
      };
    case "MY_POSTS":
      return {
        ...state,
        myPosts: action.payload.myposts
      };
    default:
      return state;
  }
};
export default PostReducer;
