import axios from "axios";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import M from "materialize-css";
const Profile = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.userProfile);
  const userPosts = useSelector((state) => state.user.userPosts);
  const user = useSelector((state) => state.user.user);
  const { userid } = useParams();
  useEffect(() => {
    axios
      .get(`/user/${userid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        if (res.data.userProfile) {
          dispatch({ type: "GET_USER_PROFILE", payload: res.data });
        }
      });
  }, []);
  const followUser = () => {
    axios
      .put(
        "/follow",
        { followId: userid },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        if (res.data.updatedUser) {
          dispatch({ type: "UPDATE_FOLLOW", payload: res.data });
        } else {
          M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
        }
      });
  };
  const unfollowUser = () => {
    axios
      .put(
        "/unfollow",
        { unfollowId: userid },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        dispatch({ type: "UPDATE_UNFOLLOW", payload: res.data });
      })
      .catch((res) => {
        M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
      });
  };
  return userProfile ? (
    <div className="container py-3">
      <div className="d-flex justify-content-center flex-wrap">
        <div className="d-flex flex-column align-items-center col-md-4 flex-wrap">
          <img
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "80px",
              objectFit: "contain",
              backgroundColor: "black",
            }}
            src={userProfile.profilePic}
          />
        </div>
        <div className="col-md-8 d-flex flex-column justify-content-center align-items-center flex-wrap">
          <h4>{userProfile.name}</h4>
          <h5>{userProfile.email}</h5>
          <div className="d-flex pb-3">
            <h6 className="mx-3">{userPosts ? userPosts.length : 0} posts</h6>
          <Link to ={`/followers/${userid}`}>  <h6 className="mx-3">
              {userProfile.followers ? userProfile.followers.length : 0}{" "}
              followers
            </h6></Link>
            <Link to ={`/following/${userid}`}> <h6 className="mx-3">
              {userProfile.following ? userProfile.following.length : 0}{" "}
              following
            </h6></Link>
          </div>
          {userProfile._id !== user._id ? 
           <div>
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
          </div>: null
}
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-between flex-wrap p-2">
        {userPosts
          ? userPosts.map((item, index) => {
              return (
                <div
                  className=" card col-md-4 col-lg-3 text-center m-3 p-2"
                  style={{ maxHeight: "300px" }}
                >
                  <img
                    src={item.photo}
                    alt="photo"
                    key={index}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              );
            })
          : "loading"}
      </div>
    </div>
  ) : (
    "loading"
  );
};
export default Profile;
