import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { useDispatch} from "react-redux";
import { SETUSER } from '../../types';
const Login = () =>{
const history = useHistory(  );
const [ email, setEmail ] = useState( "" );
const [ password, setPassword ] = useState( "" );
const [ user, setUser ] = useState( "" );
const dispatch = useDispatch();
const logindata = (  ) =>{
fetch( "/login", {
method: "post",
headers: {
    "Content-Type": "application/json",    
    },
    body: JSON.stringify( {
    email,
    password
    } )
} ).then( res =>res.json(  ) ).then( data =>{
if( data.error ){
M.toast( { html: data.error, classes: "#ff1744 red accent-3" } )
}
else{
    M.toast( { html: data.message, classes: "#ff1744 green accent-3" } );
    localStorage.setItem("jwt", data.token);
    localStorage.setItem("user", JSON.stringify(data.user))
    history.push("/")
    dispatch({type: SETUSER, payload: data.user})
}
} )
}
return(
<div className = "my-card">
<div className="card auth-card input-field"> 
<h2 className ="brand-logo">Instagram</h2>
<input type ="text" placeholder ="email" value = {email} onChange = {( e )=>setEmail( e.target.value )}/>
<input type ="password" placeholder ="password" value = { password } onChange = {( e )=>setPassword( e.target.value )}
/>

<button className="waves-effect waves-light btn 64b5f6 blue lighten-2 white-text" onClick = { (  )=>logindata(  )}>Login</button>
<h6><Link to ="/reset">Forgot Password  ?
</Link></h6>
<h5><Link to ="/signup">Don't have an Account ?
</Link></h5>
</div>
</div>
);
}
export default Login;