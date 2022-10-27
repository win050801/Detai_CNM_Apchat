import "./message.css";
import { format } from "timeago.js";

export default function Message() {
  return (
    <div className={ "message own" }>
      <div className="messageTop">
      <p className="messageText">Hi </p>
        <img
          className="messageImg"
          src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt=""
        />
       
      </div>
      <div className="messageBottom"> now</div>
    </div>
  );
}