import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
import axios from "axios";
const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const postDetails = () => {
    if (image) {
      const form = new FormData();
      form.append("title", title);
      form.append("body", body);
      form.append("pic", image);
      axios
        .post("/createpost", form, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
        .then((res) => {
          M.toast({
            html: res.data.message,
            classes: "#ff1744 green accent-3",
          });
          history.push("/");
        }).catch((res) => {
          M.toast({ html: res.data.error, classes: "#ff1744 red accent-3" });
        });
    }
  };
  return (
    <div className="container-fluid">
    <div
      className="card"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />   
        <form>
            <div className="file-field input-field">
              <div className="btn">
                <span>Choose File</span>
                <input
                  type="file"
                  name="pic"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
          </form>
      <a
        className=" waves-effect waves-light btn 
#1e88e5 blue darken-1 white-text"
        onClick={() => {
          postDetails();
        }}
      >
        Submit Post
      </a>
      </div>
    </div>
  );
};
export default CreatePost;
