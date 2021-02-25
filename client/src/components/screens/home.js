import React, { useState, useEffect } from "react";
import "../../App.css";
import M from "materialize-css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
const Home = () => {
  const user = useSelector((state) => state.user.user);
  const posts = useSelector((state) => state.post.allPosts);
  const [favorite, setFavorite] = useState(false);
  const [comment, setComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [DeleteUserPost, setDeleteUserPost] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get("/allposts", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        if (res.data.posts) {
          dispatch({
            type: "ALL_POSTS",
            payload: res.data,
          });
        } else {
          M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
        }
      });
  }, [liked, favorite, comment, DeleteUserPost]);
  const likePost = (id) => {
    axios
      .post(
        "/like",
        {
          postId: id,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then(() => {
        setLiked(!liked);
      })
      .catch((res) => {
        M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
      });
  };
  const unlikePost = (id) => {
    axios
      .post(
        "/unlike",
        {
          postId: id,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        setLiked(!liked);
      })
      .catch((res) => {
        M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
      });
  };
  const makeComment = (text, id) => {
    axios
      .put(
        "/comment",
        {
          postId: id,
          text,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        setComment(!comment);
      }).catch((res) => {
        M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
      });
  };
  const deletePost = (postId) => {
    axios
      .delete(`/deletepost/${postId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        if (res.data.message) {
          setDeleteUserPost(!DeleteUserPost)
          M.toast({ html: res.data.message, classes: "#ff1744 red accent-3" });
        }
      });
  };
  const addToFavorite = (id) => {
    axios
      .put(
        "/addtofavorite",
        {
          postId: id,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        if (res.data.message)
          M.toast({
            html: res.data.message,
            classes: "#ff1744 green accent-3",
          });
        setFavorite(!favorite);
      });
  };
  const removeFromFavorite = (id) => {
    axios
      .put(
        "/removefromfavorite",
        { postId: id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        if (res.data.message) {
          setFavorite(!favorite);
          M.toast({ html: res.data.message, classes: "#ff1744 red accent-3" });
        } else {
          M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
        }
      });
  };
  return (
    <div className="container-fluid d-flex flex-column align-items-center flex-wrap">
      {posts
        ? posts.map((item, index) => {
            return (
              <>
                <div
                  className="card d-flex flex-column col-md-5 flex-wrap py-3"
                  key={index}
                >
                  <div className="d-flex justify-content-between align-items-center p-3">
                    <h5 className="font-weight-bold" style={{}}>
                      <Link to={`/profile/${item.postedBy._id}`}>
                        {item.postedBy.name}
                      </Link>
                    </h5>

                    {user && item.postedBy._id == user._id && (
                      <i
                        class="material-icons"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          deletePost(item._id);
                        }}
                      >
                        delete
                      </i>
                    )}
                  </div>
                  <div className="text-center" style={{}}>
                    <img
                      className="card-img-top mb-3 "
                      style={{
                        height: "500px",
                        objectFit: "contain",
                      }}
                      src={item.photo}
                      alt=""
                    />
                  </div>
                  <div className="mx-3">
                    <div className="d-flex">
                      <div className="">
                        {user ? (
                          item.likes.includes(user._id) ? (
                            <i
                              className="material-icons"
                              style={{
                                color: "#2196f3",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                unlikePost(item._id);
                              }}
                            >
                              thumb_down
                            </i>
                          ) : (
                            <i
                              className="material-icons"
                              style={{ cursor: "pointer", color: "#2196f3" }}
                      
                              onClick={() => likePost(item._id)}
                            >
                              thumb_up
                            </i>
                          )
                        ) : null}
                      </div>
                      <div className="mx-3">
                      {user ? (
                        item.favorites.includes(user._id) ? (
                          <i
                            className="material-icons"
                            style={{
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              removeFromFavorite(item._id);
                            }}
                          >
                            favorite
                          </i>
                        ) : (
                          <i
                            className="material-icons"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              addToFavorite(item._id);
                            }}
                          >
                            favorite
                          </i>
                        )
                      ) : null}
                      </div>
                    </div>
                    <h6>{item.likes.length} Likes</h6>
                    <h6> {item.title} </h6> <p> {item.body} </p>
                    {item.comments.map((record, index) => {
                      return (
                        <h6 key={index}>
                          <span
                            style={{
                              fontWeight: "500",
                            }}
                          >
                            {record.postedBy}
                          </span>
                          <span> </span> {record.text}
                        </h6>
                      );
                    })}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        makeComment(e.target[0].value, item._id);
                      }}
                    >
                      <input type="text" placeholder="add a comment" />
                    </form>
                  </div>
                </div>
              </>
            );
          })
        : "loading"}
    </div>
  );
};
export default Home;
