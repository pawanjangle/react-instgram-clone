import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import axios from "axios";
const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const postData = () => {
    const user = {
      name,
      email,
      password,
    };
    axios.post("/signupuser", user).then((res) => {
      if (res.data.message) {
        M.toast({ html: res.data.message, classes: "#ff1744 green accent-3" });
        history.push("/login");
      } else {
        M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
      }
    });
  };
  return (
    <div className="d-flex flex-column align-items-center">
      <div className="card col-md-6 p-5">
        <h2 className="brand-logo text-center">Instagram</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-center my-3">
        <a
          className="waves-effect waves-light btn 64b5f6 blue lighten-2 white-text"
          onClick={() => postData()}
        >
          Signup
        </a>
        </div>
        <h5 className="text-center">
          <Link to="/login">Already have an Account ?</Link>
        </h5>
      </div>
    </div>
  );
};
export default Signup;
