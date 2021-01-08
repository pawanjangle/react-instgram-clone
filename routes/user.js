const express = require( 'express' );
const router = express.Router(  );
const User = require("../models/user")
const Post = require( '../models/post' );
const multer = require("multer");
const shortId = require("shortid")
const requireLogin = require( '../middleware/requireLogin' );
const { API } = require("../config/keys");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/")
    },
    filename: function (req, file, cb) {
      cb(null, shortId.generate() + "-" + file.originalname)
    }
  });
  const upload = multer({ storage: storage });
router.get("/user/:id", requireLogin, (req, res)=>{
User.findOne({_id: req.params.id}).select("-password").then(user=>{
    Post.find({postedBy: req.params.id}).populate("postedBy", "_id name").exec((err, posts)=>{
       if(err) {
           return res.status(422).json({error: err})
       }
       return res.status(200).json({user, posts});     
    })
}).catch(err=>{
    return res.status(400).json({error: err})
});
});
router.put("/follow", requireLogin, (req, res)=>{
    User.findByIdAndUpdate(req.user._id, {
        $push:{
            following: req.body.followId
        }
    }, {new: true}, (err)=>{
        if(err){
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.body.followId, {
            $push:{ followers: req.user._id}
        },
        {new: true}).select("-password").then(result=>{
            return res.json(result);
            
        }).catch(err=>{
            return res.status(422).json({error: err})
        })
    })
})
router.put("/unfollow", requireLogin, (req, res)=>{
    User.findByIdAndUpdate(req.user._id, {
        $pull:{
            following: req.body.unfollowId
        }
    }, {new: true}, (err, result)=>{
        if(err){
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.body.unfollowId, {
            $pull:{ followers: req.user._id}
        },
        {new: true}).select("-password").then(result=>{
            return res.json(result)
        }).catch(err=>{
            return res.status(422).json({error: err})
        })
    })
});
router.post("/setprofilepic", upload.single("pic"), requireLogin, (req, res)=>{
    if(req.file){
        const url = process.env.API + "/public/" + req.file.filename 
    User.findByIdAndUpdate(req.user._id, {
         profilePic: url
    }, {new: true}).then(result =>{
        return res.json(result.data)
    })
}
});
router.get("/userdata", requireLogin, (req, res)=>{
    User.findOne({_id: req.user._id}).then(result=>{
        return res.status(422).json(result)
    })
})
module.exports = router;