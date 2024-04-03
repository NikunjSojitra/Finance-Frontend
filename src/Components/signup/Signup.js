import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [house, setHouse] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");

  const togglePassword = (event) => {
    event.preventDefault();
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };



  const navigate = useNavigate();

  const submitData = async (e, signupUser) => {
    console.warn(fname, lname, email, mobile, password,house, role);

    e.preventDefault();
    axios
      .post("http://localhost:8000/signup", {
        mode: "no-cors",
        fname,
        lname,
        email,
        mobile,
        password,
        house,
        role,
      })
      .then((response) => {
        if (response.data.msg) {
          if (response.data.data.role === "Admin") {
            navigate("/manager-dashboard");
            console.warn(response.data);
          } else {
            let empRes = response.data.data;
            navigate(`/employee-dashboard/${empRes._id}`  , {
              state: { empRes },
            });
            console.warn("empRes", empRes);
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

  const notify = (text, type) => {
    toast(text, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: type,
      theme: "colored",
    });
  };

  //   const { onChange, onSubmit, values } = useForm(signupUser, {
  //     email: "",
  //     mobile: "",
  //     password: "",
  //     fullName: "",
  //     confirmpassword: "",
  //   });

  function signupUser() {
    if (!email || !fname || lname || !password || !mobile) {
      toast("Please Fill All The Fields");
      return;
    } else if (password !== confirmpassword) {
      toast("Password and Confirm Password does not match");
      return;
    } else if (email.includes("@") === false) {
      toast("Please Enter Valid Email");
      return;
    } else if (mobile.length > 15) {
      toast("Please Enter Valid Mobile Number");
      return;
    } else if (mobile.length < 8) {
      toast("Please Enter Valid Mobile Number");
      return;
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="signup d-flex  pt-5 pb-5">
        <div className="container ">
          <div className="login-wrap text-center mb-4">
            <h3>Registration</h3>
          </div>
          <div className="">
            <form className="row needs-validation">
              <div className="col-md-6 d-flex align-items-center mb-3">
                <i className="zmdi zmdi-account"></i>
                <input
                  type="text"
                  className="form-control pl-5"
                  id="validationCustom01"
                  placeholder="First Name"
                  name="name"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 d-flex align-items-center mb-3">
                <i className="zmdi zmdi-email"></i>
                <input
                  type="text"
                  className="form-control pl-5"
                  id="validationCustom02"
                  placeholder="Last Name"
                  name="email"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 d-flex align-items-center mb-3">
                <i className="zmdi zmdi-case"></i>
                <input
                  type="email"
                  className="form-control pl-5"
                  id="validationCustom03"
                  placeholder=" Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 d-flex align-items-center mb-3">
                <i className="zmdi zmdi-phone"></i>
                <input
                  type="number"
                  className="form-control pl-5"
                  id="validationCustom04"
                  placeholder="Mobile Number"
                  name="phone"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 d-flex align-items-center mb-3 position-relative">
                <i className="zmdi zmdi-key"></i>
                <input
                  type={passwordType}
                  className="form-control pl-5"
                  id="validationCustom07"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  onClick={togglePassword}
                  id="toggle_btn"
                  className="password_toggle_btn"
                >
                  {passwordType === "password" ? (
                    <BsEyeSlash className="cross_eye_icon_log" />
                  ) : (
                    <BsEye className="cross_eye_icon_log" />
                  )}
                </button>
              </div>

              <div className="col-md-6 d-flex align-items-center mb-3">
                <i className="zmdi zmdi-case"></i>
                <input
                  type="text"
                  className="form-control pl-5"
                  id="validationCustom03"
                  placeholder=" House No."
                  name="house"
                  value={house}
                  onChange={(e) => setHouse(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4 d-flex align-items-start justify-content-start mb-3 ">
                <div>
                  <input
                    type="radio"
                    className="mx-2 "
                    required="required"
                    name="empType"  
                    value="Admin"
                    checked={role === "Admin"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Admin
                </div>
                <div>
                  <input
                    type="radio"
                    className="mx-2"
                    required="required"
                    name="empType"
                    value="User"
                    checked={role === "User"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  User
                </div>
              </div>

              <div className="col-12 mt-3">
                <button
                  className="btn sign_up"
                  type="submit"
                  onClick={submitData}
                >
                  Sign Up
                </button>
                {/* <Link className="btn sign_up" to="/login">
                  Login
                </Link> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
