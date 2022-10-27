import React, { useState, useEffect } from "react";
import "./login.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { loginRoute } from "../../utils/APIRoutes";



export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ phonenumber: "", password: "" });
  const [phonenumber,setphone] = useState("")
  const [password,setpassword] = useState("")
  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  // useEffect(() => {
  //   if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
  //     navigate("/");
  //   }
  // }, []);
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const chanephone = (event) => {
    setphone(event.target.value)
  };
  const chanepass = (event) => {
    setpassword(event.target.value)
  };

  


  const validateForm = () => {
    if (phonenumber === "") {
      toast.error("SDT and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("SDT and Password is required.", toastOptions);
      return false;
    }
    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    
    if (validateForm()) {
     
      const { data } = await axios.post(loginRoute, {
        phonenumber,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        console.log(process.env.REACT_APP_LOCALHOST_KEY);
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );

        navigate("/");
        
      }
    }
  };
  return (
    <>
      <div className="FormContainer">
        <form action=""className="formLogin" onSubmit={(event) => handleSubmit(event)} >
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Chat</h1>
          </div>
          <input
            className="inputLogin"
            type="text"
            placeholder="SDT"
            name="phonenumber"
            onChange={(e) => chanephone(e)}
            min="3"
          />
          <input
          className="inputLogin"
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => chanepass(e)}
          />
          <button type="submit" className="buttonLogin">Log In</button>
  
          <span className="spanLogin">
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
        <ToastContainer></ToastContainer>
        </div>
      
    </>
  );
}

