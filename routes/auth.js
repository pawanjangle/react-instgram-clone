const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { jwtSecret, myInstagram} = require("../config/keys");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: myInstagram
  }
}));
router.get("/dashboard", requireLogin, (req, res) => {
  res.send("hello");
});
router.post("/signupuser", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ error: "please add all the fields !!!" });
  }
  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    return res.json({ error: "Invalid email" });
  }
 
 const userExist = await User.findOne({ email })
 if(userExist){
  return res.status(422).json({ error: "user already exist" });
 }
   const hashedpassword = await bcrypt.hash(password, 12);
        const newUser = new User({
          email,
          password: hashedpassword,
          name,
        });
      const user =  await newUser.save()
      if(user){
        console.log(user);
            transporter.
              sendMail({
                to: user.email,
                from: "pawandjangle@outlook.com",
                subject: "signup success",
                html: "<h1>Welcome to Instagram<h1>"
              });
            return res.json({ message: "user registered successfully" });
      }
      else{
        return res.json({ error: "failed to register user" });     
      }
});        
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign(
            { _id: savedUser._id, name: savedUser.name },
            jwtSecret
          );
          const { _id, name, email, followers, following } = savedUser;
          res.json({
            token: token,
            user: { _id, name, email, followers, following },
            message: "Login Successful",
          });
        } else {
          return res.status(422).json({ error: "invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
router.post("/reset-password", (req, res)=>{
crypto.randomBytes(32, (err, buffer)=>{
  if(err){
    console.log(err)
  }
  const token = buffer.toString("hex");
  User.findOne({email: req.body.email}).then(user=>{
    if(!user){
      return res.status(422).json({error: "User does no exist with this email"})
    }
    user.resetToken = token;
    user.expireToken = Date.now() + 3600000;
    user.save().then(result=>{
      transporter.sendMail({
        to: result.email,
        from: "pawandjangle@outlook.com",
        subject: "password reset",
        html: `<p>You requested for password</p> <h5>click this <a href = "http://localhost:3000/reset/${token}">link </a> to reset</h5>`
      })
      res.json({ message: "check your email inbox"})
    })
  })
})
});
router.post("/new-password", (req, res)=>{
  const {sentToken, newPassword} = req.body;
  User.findOne({resetToken: sentToken, expireToken: {$gt: Date.now()} }).then(user=>{
    if(!user){
      return res.status(422).json({error: "session expired. Please try again later" })
    }
    bcrypt.hash(newPassword, 12).then(hashedPassword=>{
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.expireToken = undefined;
      user.save().then(savedUser=>{
        console.log(savedUser);
        res.json({ message: "password updated successsfully"})
      })
    })
  }).catch(err=>{
    console.log(err)
  })
})
module.exports = router;
