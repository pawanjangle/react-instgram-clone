import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
const NewPassword = () => {
  const history = useHistory();
  const [newPassword, setPassword] = useState("");
  const { token } = useParams();
  const logindata = () => {
    fetch("/new-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        newPassword,
        sentToken: token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#ff1744 red accent-3" });
        } else {
          M.toast({ html: data.message, classes: "#ff1744 green accent-3" });
          history.push("/login");
        }
      });
  };
  return (
    <div className="d-flex justify-content-center">
      <div className="card p-5 col-md-6">
        <h2 className="brand-logo text-center">Instagram</h2>
        <input
          type="password"
          placeholder="Enter a new password"
          value={newPassword}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-center my-3">
          <button
            className="waves-effect waves-light btn 64b5f6 blue lighten-2 white-text"
            onClick={() => logindata()}
          >
            Update Password
          </button>
        </div>
        <h5 className="text-center">
          <Link to="/signup">Don't have an Account ?</Link>
        </h5>
      </div>
    </div>
  );
};
export default NewPassword;
