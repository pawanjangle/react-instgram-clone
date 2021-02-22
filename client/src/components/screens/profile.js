import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import M from "materialize-css";
const Profile = () => {
  const [mypics, setPics] = useState([]);
  const [image, setImage] = useState("");
  const user = useSelector((state) => state.user.user);
  console.log(user);
  useEffect(() => {
    axios
      .get("/myposts", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        setPics(res.data.myposts);
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
            M.toast({
              html: res.data.message,
              classes: "#ff1744 green accent-3",
            });
          }
        });
    }
  });

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
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
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
            <h6>{mypics.length} posts</h6>
            <h6>{user ? user.followers.length : 0} followers</h6>
            <h6>{user ? user.following.length : 0} following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item) => {
          return (
            <img
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
        })}
      </div>
    </div>
  );
};
export default Profile;
