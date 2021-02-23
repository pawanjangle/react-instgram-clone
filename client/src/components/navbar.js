import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
const Navbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state=> state.user);
  const renderList = () => {
    if (user.authenticated === true ) {
      return [
        <>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/create">create Post</Link>
          </li>
          <li>
            <Link to="/">All posts</Link>
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
          
          <Link to={user.authenticated ? "/followposts" : "/login"} className="brand-logo left">
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
