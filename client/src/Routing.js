import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import jwt from "jsonwebtoken";
import Home from "./components/screens/home";
import Signup from "./components/screens/signup";
import Login from "./components/screens/login";
import Profile from "./components/screens/profile";
import CreatePost from "./components/screens/createPost";
import FollowPosts from "./components/screens/FollowPosts";
import UserProfile from "./components/screens/UserProfile";
import Reset from "./components/screens/reset";
import NewPassword from "./components/screens/newPassword";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
const Routing = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const verified = jwt.verify(token, process.env.REACT_APP_JwtSecret);
      if (verified) {
      axios.get("/userdata", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      } ).then(res=>{
        console.log(res)
        dispatch({type: "SET_USER", payload: res.data})
      });
        history.push("/followposts");
        axios
          .get("/followeduserpost", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          })
          .then((res) => {            
            dispatch({ type: "FOLLOWED_POSTS", payload: res.data });
          }) ;
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
        history.push("/");
      }
    } else {
      if(!history.location.pathname.startsWith("/reset")){
        history.push("/");
      }      
    }
  });
  const SecuredRoute = (props) => { 
    const auth = useSelector((state) => state.user.authenticated);
    return (
      <Route
        path={props.path}
        render={(data) =>
          auth ? (
            <props.component {...data}></props.component>
          ) : (
            null          
          )
        }
      />
    );
  };
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/signup" component={Signup} />
      <Route exact path="/followposts" component={FollowPosts} />
      <Route path="/login" component={Login} />
      <SecuredRoute exact path="/profile" component={Profile} />
      <SecuredRoute path="/create" component={CreatePost} />
      <SecuredRoute path="/profile/:userid" component={UserProfile} />
      <Route exact path="/reset" component={Reset} />
      <Route path="/reset/:token" component={NewPassword} />
    </Switch>
  );
};
export default Routing;
