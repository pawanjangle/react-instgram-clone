import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import M from "materialize-css";
const Profile = () => {
  const [image, setImage] = useState("");
  const [profilePic, setProfilePic] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const myPosts = useSelector((state) => state.post.myPosts);
  useEffect(()=>{
    axios
    .get("/userdata", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
    .then((res) => {
      dispatch({ type: "SET_USER", payload: res.data });
    });
  }, [profilePic])
  useEffect(() => {
    axios
      .get("/myposts", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        if (res.data.myPosts) {
          dispatch({ type: "MY_POSTS", payload: res.data });
        }
      });
  }, []);
  useEffect(() => {
    if (image) {
      const form = new FormData();
      form.append("pic", image);
      axios
        .post("/setprofilepic", form, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
        .then((res) => {
          if (res.data.message) {
            setProfilePic(!profilePic);
            M.toast({
              html: res.data.message,
              classes: "#ff1744 green accent-3",
            });
            dispatch({ type: "SET_PROFILE_PIC", payload: res.data });
          } else {
            M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
          }
        })       
    }
  }, [image]);

  return (
    <div className="container py-3">
      <div className="d-flex flex-wrap">
        <div className="d-flex flex-column align-items-center col-md-4">
          <img
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "80px",
              objectFit: "contain",
              backgroundColor: "black",
            }}
            src={user ? user.profilePic : "loading"}
          />
          <form>
            <div className="file-field input-field">
              <div className="btn">
                <span>set Profile Picture</span>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-8 d-flex flex-column justify-content-center align-items-center">
          <h4>{user ? user.name : "loading..."}</h4>
          <h6>{user ? user.email : "loading..."}</h6>
          <div className="d-flex">
            <h6 className="mx-3">{myPosts.length} posts</h6>

            <Link to={`/followers/${user._id}`}>
              <h6 className="mx-3">
                {user ? user.followers.length : 0} followers
              </h6>
            </Link>
            <Link to={`/following/${user._id}`}>
              <h6 className="mx-3">
                {user ? user.following.length : 0} following
              </h6>
            </Link>
          </div>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-between flex-wrap p-2">
        {myPosts
          ? myPosts.map((item, index) => {
              return (
                <div
                  className=" card col-md-4 col-lg-3 text-center m-3 p-2"
                  style={{ maxHeight: "300px" }}
                >
                  <img
                    key={index}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    src={item.photo}
                    alt="photo"
                  />
                </div>
              );
            })
          : "loading"}
      </div>
    </div>
  );
};
export default Profile;
