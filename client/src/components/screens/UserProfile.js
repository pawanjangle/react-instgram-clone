import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
const Profile = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(state=>state.user.userProfile)
  const userPosts = useSelector(state=>state.user.userPosts)
  const user = useSelector(state=>state.user.user)
  const { userid } = useParams();
  useEffect(() => {
    axios.get(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        console.log(res)
        if(res.data.userProfile){
     dispatch({type:"GET_USER_PROFILE", payload: res.data})
      }});
  }, []);
  const followUser = () => {
    axios.put("/follow", { followId: userid }, {   
      headers: {      
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },    
    }).then((res) => {
      
      if(res.data.updatedUser){
      dispatch({type:"UPDATE_FOLLOW", payload: res.data})
    }
      })   
  };
  const unfollowUser = () => {
    axios.put("/unfollow", { unfollowId: userid }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },  
    }).then((res) => {
      dispatch({type:"UPDATE_UNFOLLOW", payload: res.data})
      })
  };
  return (
    userProfile?
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={ userProfile.profilePic}
          />
        </div>
        <div>
          <h4>{userProfile.name}</h4>
          <h4>{userProfile.email}</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "108%",
            }}
          >
            <h6>{userPosts ? userPosts.length : 0} posts</h6>
            <h6>
              {userProfile.followers ? userProfile.followers.length : 0} followers
            </h6>
            <h6>
              {userProfile.following ? userProfile.following.length : 0} following
            </h6>
          </div>
          {userProfile.followers.includes(user._id) ? (
            <button
              className="waves-effect waves-light btn 64b5f6 blue lighten-2 white-text"
              onClick={() => unfollowUser()}
            >
              unfollow
            </button>
          ) : (
            <button
              className="waves-effect waves-light btn 64b5f6 blue lighten-2 white-text"
              onClick={() => followUser()}
            >
              follow
            </button>
          )}
        </div>
      </div>
      <div className="gallery">
        {userPosts ? userPosts.map((item) => {
          return (
            <img
              style={{
                height: "30%",
                justifyContent: "space-between",
                width: "30%",
              }}
              src={item.photo}
              alt="photo"
            />
          );
        }): "loading"}
      </div>
    </div>: "loading"
  ) 
};
export default Profile;
