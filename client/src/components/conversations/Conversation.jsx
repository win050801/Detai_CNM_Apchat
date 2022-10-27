import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

export default function Conversation({contact}) {
  

  
  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={
         "https://icdn.24h.com.vn/upload/1-2022/images/2022-01-06/271315454_504958790867873_8361631472902378352_n-1641435493-158-width1080height1349.jpg"

        }
        alt=""
      />
      <div className="mess">
        <span className="conversationName">{contact.username}</span>
        {/* <span className="converMess">Chung:hi</span> */}
      </div>
      
    </div>
  );
}
