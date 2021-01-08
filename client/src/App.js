import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Navbar from "./components/navbar";
import Home from "./components/screens/home";
import Signup from "./components/screens/signup";
import Login from "./components/screens/login";
import Profile from "./components/screens/profile";
import CreatePost from "./components/screens/createPost";
import FollowPosts from "./components/screens/FollowPosts";
import UserProfile from "./components/screens/UserProfile";
import Reset from "./components/screens/reset";
import NewPassword from "./components/screens/newPassword";
const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={FollowPosts} />
      <Route path="/signup" component={Signup} />
      <Route exact path="/allposts" component={Home} />
      <Route path="/login" component={Login} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/create" component={CreatePost} />
      <Route path="/profile/:userid" component={UserProfile} />
      <Route exact path="/reset" component={Reset} />
      <Route path="/reset/:token" component={NewPassword} />
    </Switch>
  );
};
function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
  );
}

export default App;
