const jwt = require( 'jsonwebtoken' );
const User = require("../models/user");
module.exports = async ( req, res, next ) =>{
const { authorization } = req.headers;
if( !authorization ){
return res.status( 422 ).json( {error: "You must be logged in1"} )
}
const token = authorization.replace( "Bearer ", "" );
const verified = jwt.verify( token, process.env.jwtSecret);
if( !verified ){
return res.status( 422 ).json( { error: "You must be logged in2" } )
}
const {_id} = verified;
const userdata = await User.findById(_id);
req.user = userdata;
next();
}