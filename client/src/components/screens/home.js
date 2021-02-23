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
        }
      });
  }, [liked, favorite, comment]);
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
      .then((res) => {
        setLiked(!liked)
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
        setLiked(!liked)
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
  setFavorite(!favorite)
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
          setFavorite(!favorite)
          M.toast({ html: res.data.message, classes: "#ff1744 red accent-3" });
        }
      });
  };
  return (
    <div className="container">
      {posts
        ? posts.map((item) => {
            return (
              <>
                <div className="card home-card" key={item._id}>
                  <h5
                    style={{
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                  >
                    <Link
                      to={
                        item.postedBy._id !== user._id
                          ? `/profile/${item.postedBy._id}`
                          : "/profile"
                      }
                    >
                      {item.postedBy.name}
                    </Link>
                    {item.postedBy._id == user._id && (
                      <i
                        class="material-icons"
                        style={{
                          float: "right",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          deletePost(item._id);
                        }}
                      >
                        delete
                      </i>
                    )}
                  </h5>
                  <div className="card-image">
                    <img
                      style={{
                        height: "500px",
                      }}
                      src={item.photo}
                      alt=""
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        paddingTop: "5px",
                      }}
                    >
                      {item.likes.includes(user._id) ? (
                        <i
                          className="material-icons"
                          style={{
                            color: "blue",
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
                          className="small material-icons"
                          style={{ cursor: "pointer" }}
                          onClick={() => likePost(item._id)}
                        >
                          thumb_up
                        </i>
                      )}
                      <div
                        style={{
                          paddingLeft: "10px",
                        }}
                      >
                        {item.favorites.includes(user._id) ? (
                          <i
                            className="small material-icons"
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
                            className="small material-icons"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              addToFavorite(item._id);
                            }}
                          >
                            favorite
                          </i>
                        )}
                      </div>
                    </div>
                    <h6>
                      {item.likes.length}
                      Likes
                    </h6>
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
