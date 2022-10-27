import React, { useState, useEffect } from "react";

import { registerRoute } from "../../utils/APIRoutes";
import { KtraRoute } from "../../utils/APIRoutes";
import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
import Logo from "../../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./register.css";
import { useHistory } from "react-router";
import PhoneInput from "react-phone-number-input";
import axios from "axios";
import styled from "styled-components";
import {RecaptchaVerifier,signInWithPhoneNumber,getAuth} from 'firebase/auth'
import { app } from "../../firebse-config";
import "react-phone-number-input/style.css";
export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [phonenumber, setNumber] = useState("");
  const [username, setname] = useState("");
  const [password, setpass] = useState("");
  const [cfpass, setcfpass] = useState("");

  const [flag, setFlag] = useState(false);
  const [otp, setOtp] = useState("");
  const [ktotp, setKTOtp] = useState(false);
  const [result, setResult] = useState("");
  const auth = getAuth(app);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };





  function setUpRecaptha(phonenumber) {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        // size:"invisible"
      },
      auth
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, phonenumber, recaptchaVerifier);
  }

  const getOtp = async (e) => {
    e.preventDefault();

    const { data } = await axios.post(KtraRoute, {
      phonenumber:phonenumber.replace('+84','0')
    });
   
    if(data.status===true)
    {
      setError("");
      if (phonenumber === "" || phonenumber === undefined)
        return setError("Please enter a valid phone number!");
      try {
        const response = await setUpRecaptha(phonenumber);
        setResult(response);
        setFlag(true);
      } catch (err) {
        toast.error(err.message, toastOptions);
      }
      
    }
    else{
      toast.error(data.msg, toastOptions);
    }


    // console.log(number);
    
  };
  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    
    if (otp === "" || otp === null) return;
    try {
      await result.confirm(otp);
      setKTOtp(true)
    } catch (err) {
      // setError(err.message);
      toast.error("Mã OTP không hợp lệ", toastOptions);
    }
  };
  const chaneName=(e)=>{
    setname(e.target.value)
  }
  const chanePass=(e)=>{
    setpass(e.target.value)
  }
  const chaneCFPass=(e)=>{
    setcfpass(e.target.value)
  }
  const handleValidation = () => {
    
    if (password !== cfpass) {
      toast.error(
        "Password và confirm password không đúng",
        toastOptions
      );
      return false;
    } else if (username.length < 1) {
      toast.error(
        "Tên không được bỏ trống",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } 
    return true;
    }
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if(handleValidation())
    {
      
      const { data } = await axios.post(registerRoute, {
        phonenumber:phonenumber.replace('+84','0'),
        username,
        password,
      });
      
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }

     
  }

  return (
    <>
      <div className="FormContainerR">
        <div style={{ display: !ktotp ? "block" : "none" }}>
        <form action="" className="formregis" onSubmit={(event) => getOtp(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Register</h1>
          </div>
          <div style={{ display: !flag ? "block" : "none" }}>
            <PhoneInput
                
                className="inputregis"
                
                defaultCountry="VN"
                value={phonenumber}
                onChange={setNumber}
                placeholder="Phone Number"
              />
          </div>

            <input style={{ display: flag ? "block" : "none" }} type="text" placeholder="Confirm otp" className="inputregis" onChange={(e) => setOtp(e.target.value)}></input>

            <button style={{ display: !flag ? "block" : "none" }} type="button" className="buttonregis"  onClick={(event) => getOtp(event)} >send otp</button>

            <button style={{ display: flag ? "block" : "none" }} type="button" className="buttonregis"  onClick={(event) => verifyOtp(event)} >confirm otp</button>

            <span className="spanregis">
              Already have an account ? <Link to="/login">Login.</Link>
            </span>
            <div id="recaptcha-container"></div>
          </form>
          </div>
          <div style={{ display: ktotp ? "block" : "none" }}>
          <form  action="" className="formregis" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Chat</h1>
          </div>
          <input
            type="text"
            placeholder="Name"
            name="name"
            className="inputregis"
            onChange={(e) => chaneName(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="inputregis"
            onChange={(e) => chanePass(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            className="inputregis"
            onChange={(e) => chaneCFPass(e)}
            />
            <button type="submit" className="buttonregis">Create User</button>

            <span className="spanregis">
              Already have an account ? <Link to="/login">Login.</Link>
            </span>
           
          </form>
          </div>
          <ToastContainer></ToastContainer>
          </div>
     
    </>
  );
}
