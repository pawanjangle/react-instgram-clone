import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
const Following = () => {
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
      <h4 className="font-weight-bold text-center">FOLLOWING</h4>
      <div className="d-flex flex-column card col-lg-4 col-md-6 p-3">
        {userData
          ? userData.following.map((followed, index) => {
              return (
                <Link to={`/profile/${followed._id}`}>
                  <div className="d-flex justify-content-between align-items-center flex-wrap my-2">
                    <img
                      src={followed.profilePic}
                      alt=""
                      style={{
                        height: "80px",
                        width: "80px",
                        objectFit: "contain",
                        borderRadius: "40px",
                      }}
                    />
                    <h6 className="font-weight-bold">{followed.name}</h6>
                  </div>
                </Link>
              );
            })
          : "loading"}
      </div>
    </div>
  );
};
export default Following;
