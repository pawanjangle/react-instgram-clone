const mongoose = require( 'mongoose' );
const {ObjectId} = mongoose.Schema.Types;
const userSchema = new mongoose.Schema( {
name: {
type: String,
required: true
},
email: {
type: String,
required: true
},
password: {
type: String,
required: true
},
profilePic:{
    type: String,
    default: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg"
},
resetToken: String ,
expireToken: String,
followers: [ {type: ObjectId, ref: "User"} ],
following: [ {type: ObjectId, ref: "User"} ],
} );
module.exports = mongoose.model( "User", userSchema );