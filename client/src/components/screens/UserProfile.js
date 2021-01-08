import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [follow, setFollow] = useState("");
  const [unfollow, setunfollow] = useState("");
  const [data, setData] = useState(null);
  const { userid } = useParams();
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      });
  }, [follow, unfollow]);
  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ followId: userid }),
    }).then((res) =>
      res.json().then((data) => {
        setFollow(data);
      })
    );
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ unfollowId: userid }),
    }).then((res) =>
      res.json().then((data) => {
        setunfollow(data);
      })
    );
  };
  return data ? (
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
            src={data.user.profilePic}
          />
        </div>
        <div>
          <h4>{data.user.name}</h4>
          <h4>{data.user.email}</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "108%",
            }}
          >
            <h6>{data.posts.length} posts</h6>
            <h6>
              {data.user.followers ? data.user.followers.length : 0} followers
            </h6>
            <h6>
              {data.user.following ? data.user.following.length : 0} following
            </h6>
          </div>
          {data.user.followers.includes(user._id) ? (
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
        {data.posts.map((item) => {
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
        })}
      </div>
    </div>
  ) : (
    "loading"
  );
};
export default Profile;
