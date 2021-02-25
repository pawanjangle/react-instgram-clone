import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link} from "react-router-dom";
import M from "materialize-css";
import { useSelector, useDispatch } from "react-redux";
const FollowPosts = () => {
  const user = useSelector((state) => state.user.user);
  const [favorite, setFavorite] = useState(false);
  const [comment, setComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const dispatch = useDispatch();
  const followedPosts = useSelector((state) => state.post.followedPosts);
  useEffect(() => {
    axios
      .get("/followeduserpost", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        console.log(res)
        if(res.data.posts){
          dispatch({ type: "FOLLOWED_POSTS", payload: res.data });
        }        
      else{
        M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" })
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
        setLiked(!liked);
      }).catch((res) => {
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

      .then(() => {
        setLiked(!liked);
      }) .catch((res) => {
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
      }) .catch((res) => {
        M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
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
        if (res.data.message) {
          setFavorite(!favorite);
          M.toast({
            html: res.data.message,
            classes: "#ff1744 green accent-3",
          });
        }
        else{
          M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
        }
      })
  };
  const removeFromFavorite = (id) => {
    axios
      .put(
        "/removefromfavorite",
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
        if (res.data.message) {
          setFavorite(!favorite);
          M.toast({ html: res.data.message, classes: "#ff1744 red accent-3" });
        }
        else{
          M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
        }
      });
  };
  return (
    <div className=" d-flex flex-column justify-content-center align-items-center flex-wrap">
      {followedPosts
        ? followedPosts.map((item, index) => {
            return (
              <>
                <div className="card col-md-5 p-3" key={index}>
                  <div className="" >
                    <h5 style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                      <Link to={`/profile/${item.postedBy._id}`}>
                        {item.postedBy.name}
                      </Link>
                    </h5>
                  </div>
                  <div className="card-image mb-3">
                    <img
                      style={{ height: "500px", objectFit: "contain" }}
                      src={item.photo}
                      alt=""
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        paddingTop: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {item.likes.includes(user._id) ? (
                        <i
                          className="material-icons"
                          style={{ color: "blue" }}
                          onClick={() => {
                            unlikePost(item._id);
                          }}
                        >
                          thumb_down
                        </i>
                      ) : (
                        <i
                          className="material-icons"
                          onClick={() => likePost(item._id)}
                        >
                          thumb_up
                        </i>
                      )}

                      <div style={{ paddingLeft: "10px" }}>
                        {item.favorites.includes(user._id) ? (
                          <i
                            className="material-icons"
                            style={{ color: "red" }}
                            onClick={() => removeFromFavorite(item._id)}
                          >
                            favorite
                          </i>
                        ) : (
                          <i
                            className="material-icons"
                            onClick={() => addToFavorite(item._id)}
                          >
                            favorite
                          </i>
                        )}
                      </div>
                    </div>

                    <h6>{item.likes.length} Likes</h6>
                    <h6>{item.title}</h6>
                    <p>{item.body}</p>
                    {item.comments.map((record, index) => {
                      return (
                        <div key={index}>
                          <h6>
                            <span style={{ fontWeight: "500" }}>
                              {record.postedBy}
                            </span>
                            <span> </span>
                            {record.text}
                          </h6>
                        </div>
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
}
export default FollowPosts;
