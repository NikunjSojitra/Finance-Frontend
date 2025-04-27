// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BsEyeSlash, BsEye } from "react-icons/bs";



function Login() {
const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password");
    const navigate = useNavigate();
   
  
    const togglePassword = (event) => {
      event.preventDefault();
      if (passwordType === "password") {
        setPasswordType("text");
        return;
      }
      setPasswordType("password");
    };
  
    const handleSubmit = async (e) => {

      if(!email || !password) {
        alert("Please fill all the fields");
        return;
      }
      setLoading(true);
      e.preventDefault();
      axios
        .post("https://finance-backend-jvuy.onrender.com/login", {
          mode: "no-cors",
          email: email,
          password: password,
        })
        .then((response) => {
          if (response.data.token) {
            if (response.data.user.role == "Admin") {
              navigate("/manager-dashboard");
              setLoading(false);
              localStorage.setItem("role",response.data.user.role); 
            } else {
              let empRes = response.data.user;
              navigate(`/employee-dashboard/${empRes._id}`, {
                state: { empRes },
              });
            }
          } else {
            console.warn(response);
            alert(response.data.msg);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };

  return (
    <>
    {loading ?
     <div className="loader-4 center"><span></span></div>
        :
    <div >
        <div className="login_wrapper my-5">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-sm-12 mx-auto ">
                <form method="post">
                  <div className="login-wrap">
                    <h3 className="text-center">Login Form</h3>

                    <div className="form-group mt-4">
                      <span>Email</span>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputEmail1"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        aria-describedby="emailHelp"
                        required = {true}
                      />
                    </div>

                    <div className="form-group mt-4 position-relative">
                      <span>Password</span>
                      <input
                        type={passwordType}
                        className="form-control"
                        id="exampleInputPassword"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        aria-describedby="emailHelp"
                        required = {true}
                      />
                      <button
                        onClick={togglePassword}
                        id="toggle_btn"
                        className="login_password_toggle_btn"
                      >
                        {passwordType === "password" ? (
                          <BsEyeSlash className="cross_eye_icon_log" />
                        ) : (
                          <BsEye className="cross_eye_icon_log" />
                        )}
                      </button>
                    </div>

                    <div className="sps-sign mt-4 col-md-12">
                      <button
                        className="btn  login_btn"
                        style={{ width: "100%" }}
                        onClick={(e) => handleSubmit(e)}
                      >
                        Login
                      </button>
                    </div>
                    {/* <div className="sps-sign mt-3" style={{ textAlign: "end" }}>
                  <Link to="/" className="btn-btn sign_up_link">
                    Sign Up ?
                  </Link>
                </div> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
    }
    </>
  )
}

export default Login