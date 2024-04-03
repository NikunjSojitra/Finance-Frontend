
import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("");
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
    //     let logData = await fetch("http://localhost:7000/login", {
    //         method: "Post",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ email, password })
    //     });
    //     let logResult = await logData.json();
    //     console.warn(logResult);
    //     localStorage.setItem("user", JSON.stringify(logResult)); 
            // const { email} = data;
            axios.post('http://localhost:8000/login',{
                mode: 'no-cors',
                email: email,
                password: password
            })
            .then((response) => {
                if(response.data.message){
                    setLoginStatus(response.data.message);
                    console.warn(response);
                }else{
                    navigate("/email-send");
                    
                    console.warn(response);
                }
            })
            // .then(res => console.warn(res.data.message))
            .catch(err => {
            console.error(err);
            });

    }
    
    return (
        <div className="login-popup">
            <form  method="post">
                <div className="login-wrap">
                    <h3>Login</h3>
                    <h5 className="status">{loginStatus}</h5>

                    <div className="i-block">
                        <label>Email Address</label> <br />
                        <input type="text" name="email" onChange={(e) =>  setEmail(e.target.value) } value={email} />
                    </div>
                    <div className="i-block">
                        <label>Password</label> <br />
                        <input type="password" name="password" onChange={(e) => { setPassword(e.target.value) }} value={password} /> <br /> <br />
                        <button onClick={login}>Login</button>
                    </div>
                    <h5 className="sps-sign"><Link to="/forget-password" className="btn-btn" style={{color:"blue"}}>Forget Password ?</Link></h5>

                </div>
            </form>
        </div>
    );
}

export default Login;