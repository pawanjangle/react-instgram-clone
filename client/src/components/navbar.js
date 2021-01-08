import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
const Navbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useSelector(state=> state.user);

  const renderList = () => {
    if (auth) {
      return [
        <>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/create">create Post</Link>
          </li>
          <li>
            <Link to="/allposts">All posts</Link>
          </li>
          <li>
            <button
              className=" btn #000000 black "
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/login");
              }}
            >
              Logout
            </button>
          </li>
        </>,
      ];
    } else {
      return [
        <>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
        </>,
      ];
    }
  };
  return (
    <div>    
      <nav>
        
        <div className="nav-wrapper white">
          
          <Link to={auth ? "/" : "/login"} className="brand-logo left">
            Instagram
          </Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;