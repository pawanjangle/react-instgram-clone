import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { useDispatch } from "react-redux";
import axios from "axios";
const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const dispatch = useDispatch();
  const logindata = () => {
    const body = {
      email,
      password,
    };
    axios.post("/login", body ).then((res) => {
      if (res.data.message) {
        M.toast({ html: res.data.message, classes: "#ff1744 green accent-3" });
        localStorage.setItem("jwt", res.data.token);
        history.push("/followposts");
        dispatch({ type: "SET_USER", payload: res.data });
        axios
        .get("/followeduserpost", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
        .then((res) => {            
          dispatch({ type: "FOLLOWED_POSTS", payload: res.data });
        });  
        axios
        .get("/allposts", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
        .then((res) => {
          if (res.data.posts) {
            dispatch({ type: "ALL_POSTS", payload: res.data });
          }
        });
      } else {
        M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
        history.push("/")
      }
    });
  };
  return (
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2 className="brand-logo">Instagram</h2>
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

        <button
          className="waves-effect waves-light btn 64b5f6 blue lighten-2 white-text"
          onClick={() => logindata()}
        >
          Login
        </button>
        <h6>
          <Link to="/reset">Forgot Password ?</Link>
        </h6>
        <h5>
          <Link to="/signup">Don't have an Account ?</Link>
        </h5>
      </div>
    </div>
  );
};
export default Login;
