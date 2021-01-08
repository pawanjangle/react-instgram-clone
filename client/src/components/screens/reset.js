import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { useDispatch} from "react-redux";
const Reset = () =>{
const history = useHistory(  );
const [ email, setEmail ] = useState( "" );
const dispatch = useDispatch()
const postdata = (  ) =>{
fetch( "/reset-password", {
method: "post",
headers: {
"Content-Type": "application/json",
"Authorization": "Bearer "+ localStorage.getItem("jwt")
},
body: JSON.stringify( {
email
} )
} ).then( res =>res.json(  ) ).then( data =>{
if( data.error ){
M.toast( { html: data.error, classes: "#ff1744 red accent-3" } )
}
else{
    M.toast( { html: data.message, classes: "#ff1744 green accent-3" } );
    history.push("/login")
}
} )
}
return(
<div className = "my-card">
<div className="card auth-card input-field"> 
<h2 className ="brand-logo">Instagram</h2>
<input type ="text" placeholder ="email" value = {email} onChange = {( e )=>setEmail( e.target.value )}/>
<button className="waves-effect waves-light btn 64b5f6 blue lighten-2 white-text" onClick = { (  )=>postdata(  )}>Reset Password</button>
<h5><Link to ="/signup">Don't have an Account ?
</Link></h5>
</div>
</div>
);
}
export default Reset;