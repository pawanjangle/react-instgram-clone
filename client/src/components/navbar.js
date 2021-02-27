import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import M from "materialize-css";
const Navbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems);
  });
  const renderList = () => {
    if (user.authenticated === true) {
      return [
        <>
          <li className="nav-item sidenav-close">
            <Link to="/profile">
              <li className="nav-item sidenav-close">
                <Link to="/profile">
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "30px",
                      objectFit: "contain",
                      backgroundColor: "black",
                    }}
                    src={user.user.profilePic}
                  />
                </Link>
              </li>
            </Link>
          </li>
          <li className="nav-item sidenav-close">
            <Link to="/profile">Profile</Link>
          </li>
          <li className="nav-item sidenav-close">
            <Link to="/create">create Post</Link>
          </li>
          <li className="nav-item sidenav-close">
            <Link to="/">All posts</Link>
          </li>         
        </>,
      ];
    } else {
      return [
        <>
          <li className="nav-item sidenav-close">
            <Link to="/login">Login</Link>
          </li>
          <li className="nav-item sidenav-close">
            <Link to="/signup">Sign Up</Link>
          </li>
        </>,
      ];
    }
  };
  return (
    <div >
      <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper white px-3">
          <Link
            to={user.authenticated ? "/followposts" : "/login"}
            className="brand-logo"
          >
            Instagram
          </Link>
          {user.authenticated ? (
            <li className="right">
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
          ) : null}
          <a href="#" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>
          <ul class="right hide-on-med-and-down">{renderList()}</ul>
        </div>
      </nav>
      </div>
      <ul class="sidenav text-center" id="mobile-demo">
        <div
          className="bg-dark d-flex align-items-center justify-content-center mb-3"
          style={{ width: "100%", height: "70px" }}
        >
          <li className="nav-item">
            <Link
              to={user.authenticated ? "/followposts" : "/login"}
              className="brand-logo text-white"
            >
              <h4>Instagram </h4>
            </Link>
          </li>
        </div>
        {renderList()}
      </ul>
  
    </div>
  );
};
export default Navbar;
