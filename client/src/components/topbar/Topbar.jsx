import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
      <Link to={`/profile/${user.username}`}>
          <img
            src={
              "https://luv.vn/wp-content/uploads/2021/12/hinh-anh-gai-mat-vuong-xinh-dep-42.jpg"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
        
      </div>
      <div className="topbarCenter">
        
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          
        </div>
        <div className="space"></div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            
          </div>
          
          <div className="topbarIconItem">
            <Notifications />
            
          </div>
        </div>
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">CHAT</span>
        </Link>
      </div>
    </div>
  );
}
