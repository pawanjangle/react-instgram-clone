const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const requireLogin = require("../middleware/requireLogin");
const { uploadS3 } = require("../middleware/uploadS3");
router.post("/createpost", requireLogin, uploadS3.single("pic"), (req, res) => {
  const { title, body } = req.body;
  if (req.file) {
    const newPost = new Post({
      title,
      body,
      photo: req.file.location,
      postedBy: req.user._id,
    });
    const post = newPost.save();
    if (post) {
      return res.status(200).json({ message: "Post created", file: req.file });
    } else {
      return res.json({ error: "Failed to create Post" });
    }
  }
});
router.get("/allposts", async (req, res) => {
  const posts = await Post.find()
    .populate("postedBy", "_id name")
    .sort({ _id: "-1" });
  if (posts) {
    return res.status(200).json({ posts });
  } else {
    return res.json({ error: "Something went wrong" });
  }
});
router.get("/followeduserpost", requireLogin, async (req, res) => {
  const posts = await Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .sort({ _id: "-1" });
  if (posts) {
    return res.status(200).json({ posts });
  }
});
router.get("/myposts", requireLogin, async (req, res) => {
  const myposts = await Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .sort({ _id: "-1" });
  if (myposts) {
    return res.status(200).json({ myPosts: myposts });
  } else {
    return res.json({ error: "Something went wrong" });
  }
});
router.post("/like", requireLogin, async (req, res) => {
  const post = await Post.findOne({ _id: req.body.postId });
  if (!post.likes.includes(req.user._id)) {
    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        return res.json({ error: err });
      } else {
        res.status(200).json(result);
      }
    });
  }
});
router.post("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.json({ error: err });
    } else {
      res.status(200).json(result);
    }
  });
});
router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user.name,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.json({ error: err });
    } else {
      res.status(200).json(result);
    }
  });
});
router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.json({ error: err });
      }
      post
        .remove()
        .then(() => {
          return res.status(200).json({ message: "Post Deleted successfully" });
        })
        .catch((err) => {
          return res.json({ error: err });
        });
    });
});
router.put("/addtofavorite", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $push: {
      favorites: req.user._id,
    },
  })
    .then(() => {
      return res.status(200).json({ message: "Added to favorites" });
    })
    .catch(() => {
      return res.json({ error: "Failed to add to favorite" });
    });
});
router.put("/removefromfavorite", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $pull: {
      favorites: req.user._id,
    },
  })
    .then(() => {
      return res.status(200).json({ message: "remove from favorites" });
    })
    .catch(() => {
      return res.json({ error: "Failed to remove from favorite" });
    });
});
module.exports = router;
