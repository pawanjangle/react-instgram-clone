import React, { useState, useEffect } from "react";
import "../../App.css";
import M from 'materialize-css';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [favorite, setFavorite] = useState("");
  useEffect(() => {
    fetch("/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, [data, favorite]);
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };
  const makeComment = (text, id) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };
  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result.result._id;
        });
        setData(newData);
        M.toast( { html: result.message, classes: "#ff1744 red accent-3" } )
      });
  };
  const addToFavorite = (id) => {
    fetch("/addtofavorite", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setFavorite(true);
        M.toast( { html: result.message, classes: "#ff1744 green accent-3" } );
      });
  };
  const removeFromFavorite = (id) => {
    fetch("/removefromfavorite", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setFavorite(false);
        M.toast( { html: result.message, classes: "#ff1744 red accent-3" } )
      });
  };
  return (
    <div className="container">
      {data
        ? data.map((item) => {
            return (
              <>
                <div className="card home-card" key={item._id}>
                  <h5 style={{ paddingTop: "10px", paddingBottom: "10px" }}>
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
                        style={{ float: "right" }}
                        onClick={() => deletePost(item._id)}
                      >
                        delete
                      </i>
                    )}
                  </h5>
                  <div className="card-image">
                    <img style={{ height: "500px" }} src={item.photo} alt="" />
                  </div>
                  <div>
                    <div style= {{display: "flex", paddingTop: "5px"}}>
                    {item.likes.includes(user._id) ? (
                      <i
                        className="material-icons"
                        onClick={() => {
                          unlikePost(item._id);
                        }}
                      >
                        thumb_down
                      </i>
                    ) : (
                      <i
                        className="small material-icons"
                        onClick={() => likePost(item._id)}
                      >
                        thumb_up
                      </i>
                    )}
                    <div style= {{paddingLeft: "10px"}}>
                      {item.favorites.includes(user._id) ? (
                      <i
                        className="small material-icons"
                        style={{ color: "red" }}
                        onClick={() => removeFromFavorite(item._id)}
                      >
                        favorite
                      </i>
                    ) : (
                      <i
                        className="small material-icons"                   
                        onClick={() => addToFavorite(item._id)}
                      >
                        favorite
                      </i>
                    )}</div>
                    </div>
                    <h6>{item.likes.length} Likes</h6>
                    <h6>{item.title}</h6>
                    <p>{item.body}</p>
                    {item.comments.map((record) => {
                      return (
                        <h6 key={record._id}>
                          <span style={{ fontWeight: "500" }}>
                            {record.postedBy}
                          </span>{" "}
                          <span></span>
                          {record.text}
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
