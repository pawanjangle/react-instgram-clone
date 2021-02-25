import React, { useState } from "react";
import { Link} from "react-router-dom";
import M from "materialize-css";
const Reset = () => {
  const [email, setEmail] = useState("");
  const postdata = () => {
    fetch("/reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#ff1744 red accent-3" });
        } else {
          M.toast({ html: data.message, classes: "#ff1744 green accent-3" });        
        }
      });
  };
  return (
    <div className="d-flex justify-content-center">
      <div className="card p-5 col-md-6">
        <h2 className="brand-logo text-center">Instagram</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="text-center my-3">
          <button
            className="waves-effect waves-light btn 64b5f6 blue lighten-2 white-text"
            onClick={() => postdata()}
          >
            Reset Password
          </button>
        </div>

        <h5 className="text-center">
          <Link to="/signup">Don't have an Account ?</Link>
        </h5>
      </div>
    </div>
  );
};
export default Reset;
