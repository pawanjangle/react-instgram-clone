import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import M from "materialize-css";
const Profile = () => {
  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const myPosts = useSelector((state) => state.post.myPosts);
  console.log(myPosts);
  useEffect(() => {
    axios
      .get("/myposts", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        dispatch({ type: "MY_POSTS", payload: res.data });
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
          console.log(res);
          if (res.data.message) {
            M.toast({
              html: res.data.message,
              classes: "#ff1744 green accent-3",
            });
            dispatch({ type: "SET_PROFILE_PIC", payload: res.data });
          }
        });
    }
  }, [image]);

  return (
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
            style={{ width: "160px", height: "160px", borderRadius: "80px"}}
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
        <div>
          <h4>{user ? user.name : "loading..."}</h4>
          <h6>{user ? user.email : "loading..."}</h6>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "108%",
            }}
          >
            <h6>{myPosts.length} posts</h6>
            <h6>{user ? user.followers.length : 0} followers</h6>
            <h6>{user ? user.following.length : 0} following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {myPosts
          ? myPosts.map((item, index) => {
              return (
                <img key={index}
                  style={{
                    height: "200px",
                    justifyContent: "space-between",
                    width: "150px",
                    padding: "10px",
                  }}
                  src={item.photo}
                  alt="photo"
                />
              );
            })
          : "loading"}
      </div>
    </div>
  );
};
export default Profile;
