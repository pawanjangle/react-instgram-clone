const express = require( 'express' );
const router = express.Router(  );
const Post = require( '../models/post' );
const requireLogin = require( '../middleware/requireLogin' );
const multer = require("multer");
const shortId = require("shortid")
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/")
    },
    filename: function (req, file, cb) {
      cb(null, shortId.generate() + "-" + file.originalname)
    }
  }) 
  const upload = multer({ storage: storage })
router.post( "/createpost",  upload.single("pic"), requireLogin, ( req, res ) =>{

        let url = process.env.API + "/public/" + req.file.filename
const {title, body} = req.body;
const newPost = new Post({
    title, body, photo: url, postedBy: req.user._id
})
newPost.save().then(data=>{
return res.json({message: "post created",})
}).catch(err=> console.log(err))
});
router.get( "/allposts", requireLogin, ( req, res )=>{
Post.find(  )
.populate("postedBy", "_id name")
.then( posts =>{
res.json( {posts} )
} )
} );
router.get( "/followeduserpost", requireLogin, ( req, res )=>{
Post.find( {postedBy: {$in: req.user.following} })
.populate("postedBy", "_id name")
.then( posts =>{
res.json( {posts} )
} )
} );
router.get( "/myposts",  requireLogin, ( req, res ) =>{
Post.find( { postedBy:req.user._id} ).populate("postedBy", "_id name")
.then( myposts =>{
res.json( {myposts} )
} )
.catch( error=>{
res.json( {error: error} )
} )
} );
router.put("/like",  requireLogin, (req, res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes: req.user._id}
    }, {
        new: true
    }
    ).exec((err, result)=>{
        console.log(result)
        if(err){
            return res.status(422).json({err})
        }
        else{
            res.json(result);
        }
    })
});
router.put("/unlike", requireLogin, (req, res)=>{
    
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes: req.user._id}
    }, {
        new: true
    }
    ).exec((err, result)=>{
        if(err){
            return res.status(422).json({err})
        }
        else{
            res.json(result);
        }
    })
});
router.put("/comment",  requireLogin, (req, res)=>{
    const comment= {
        text: req.body.text,
        postedBy: req.user.name
    }
     Post.findByIdAndUpdate(req.body.postId, {
         $push:{comments: comment}
     }, {
         new: true
     }
     )
    .exec((err, result)=>{
         if(err){
             return res.status(422).json({err})
         }
         else{
             res.json(result);
     console.log(result);
         }
     })
 });
 router.delete("/deletepost/:postId", requireLogin, (req, res)=>{
     console.log(req.params.postId);
Post.findOne({_id: req.params.postId}).populate("postedBy", "_id").exec((err, post)=>{
console.log(post)
    if(err || !post){
        return res.status(422).json({error : err})
    }
        post.remove().then(result=>{
            return res.status(200).json({result, message: "Post Deleted successfully"})
        }).catch(err=>{
            console.log(err)
        })
})
 });
 router.put("/addtofavorite", requireLogin, (req, res)=>{
     Post.findByIdAndUpdate(req.body.postId, {
         $push:{
             favorites: req.user._id
         }
     }).then(result=>{
         return res.json({ message: "Added to favorites"})
     })
 })
 router.put("/removefromfavorite", requireLogin, (req, res)=>{
     Post.findByIdAndUpdate(req.body.postId, {
         $pull:{
             favorites: req.user._id
         }
     }).then(result=>{
         return res.json({ message: "remove from favorites"})
     })
 })
module.exports = router;