const initialState = {
  followedPost: [],
  allPosts: [],
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
    default:
      return state;
  }
};
export default PostReducer;
