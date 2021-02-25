const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv")
const sendgridTransport = require("nodemailer-sendgrid-transport");
dotenv.config();
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.myInstagram
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
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.json({ error: "user already registered" });
  }
  const hash_password = await bcrypt.hash(password, 12);
  const newUser = new User({
    email,
    password: hash_password,
    name,
  });
  const user = await newUser.save();
  if(user){
        transporter.
          sendMail({
            to: user.email,
            from: "pawandjangle@outlook.com",
            subject: "signup success",
            html: "<h1>Welcome to Instagram<h1>"
          });
        return res.status(200).json({ message: "user registered successfully" });
  }
  else{
    return res.json({ error: "failed to register user" });     
  }
});       
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (passwordMatched) {
      const token = jwt.sign({ _id: user._id }, process.env.jwtSecret);
      return res.status(200).json({ message: "login successful", token, user });
    } else {
      return res.json({ error: "Invalid email or password" });
    }
  } else {
    return res.json({ error: "Invalid email or password" });
  }
});
router.post("/reset-password", (req, res)=>{
crypto.randomBytes(32, (err, buffer)=>{
  const token = buffer.toString("hex");
  User.findOne({email: req.body.email}).then(user=>{
    if(!user){
      return res.json({error: "User does no exist with this email"})
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
      return res.json({error: "session expired. Please try again later" })
    }
    bcrypt.hash(newPassword, 12).then(hashedPassword=>{
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.expireToken = undefined;
      user.save().then(savedUser=>{
        res.json({ message: "password updated successsfully"})
      })
    })
  }).catch(err=>{
   return res.json({error: err})
  })
})
module.exports = router;
