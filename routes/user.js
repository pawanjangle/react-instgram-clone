const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const multer = require("multer");
const shortId = require("shortid");
const requireLogin = require("../middleware/requireLogin");
const { uploadS3 } = require("../middleware/uploadS3");
router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.json({ error: err });
          }
          return res.status(200).json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
});
router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        following: req.body.followId,
      },
    },
    { new: true },
    (err) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.body.followId,
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});
router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        following: req.body.unfollowId,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.body.unfollowId,
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});
router.post(
  "/setprofilepic",
  uploadS3.single("pic"),
  requireLogin,
  (req, res) => {
    if (req.file) {
      User.findByIdAndUpdate(
        req.user._id,
        {
          profilePic: req.file.location,
        },
        { new: true }
      ).then((data) => {
        return res
          .status(200)
          .json({ message: "Profile Pic ipdated successfully" });
      });
    }
  }
);
router.get("/userdata", requireLogin, async (req, res) => {
  user = await User.findOne({ _id: req.user._id }).select("-password");
  if (user) {
    return res.status(200).json({ user });
  } else {
    return res.json({ error: "something went wrong" });
  }
});
module.exports = router;
