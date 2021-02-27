import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
const Followers = () => {
  const [userData, setUserData] = useState("");
  const { userid } = useParams();
  useEffect(() => {
    axios
      .get(`/userfollowdata/${userid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        if (res.data.userdata) {
          setUserData(res.data.userdata);
        }
      });
  }, []);
  return (
    <div className="container-fluid d-flex flex-column align-items-center">
      <h4 className="font-weight-bold text-center">FOLLOWERS</h4>
      <div className="d-flex flex-column card col-lg-4 col-md-6 p-3">
        {userData
          ? userData.followers.map((follower, index) => {
              return (
                <Link to={`/profile/${follower._id}`}>               
                  <div className="d-flex justify-content-between align-items-center flex-wrap my-2">
                    <img
                      src={follower.profilePic}
                      alt=""
                      style={{
                        height: "80px",
                        width: "80px",
                        objectFit: "contain",
                        borderRadius: "40px",
                      }}
                    />
                    <h6 className="font-weight-bold">{follower.name}</h6>
                  </div>
                </Link>
              );
            })
          : "loading"}
      </div>
    </div>
  );
};

export default Followers;
