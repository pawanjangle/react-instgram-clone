const express = require( 'express' );
const app = express(  );
const mongoose = require( 'mongoose' );
const bodyParser = require( 'body-parser' );
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const auth= require( './routes/auth' );
const User = require("./models/user")
const Post = require("./models/post")
const post = require( './routes/post' );
const user = require( './routes/user' );
const path = require("path");
dotenv.config();
mongoose.connect( process.env.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true}, ( err)=>{if ( err ){
console.log( "error", err )
}
else{
console.log( "mongodb connection successful" )
}});
// bodyparser middleware
app.use( express.json(  ) );
app.use(cors());
app.use( bodyParser.urlencoded( {extended: false} ) );
app.use(express.static( path.join( __dirname, "./client/build" ) ) )
app.use( "/", auth);
app.use( "/", post );
app.use( "/", user);
app.get( "/", ( req, res )=>{res.sendFile(path.join( __dirname, "./client/build/index.html" ));});
const server = http.createServer( app );
const PORT = process.env.PORT || 5000;
app.listen( PORT, ( err ) =>{if ( err ){
console.log( "error", err )
}
else
{
console.log( "express server is listening on port", PORT )}});