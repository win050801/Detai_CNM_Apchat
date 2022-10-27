import "./messenger.css";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute, host } from "../../utils/APIRoutes";
import Conversation from "../../components/conversations/Conversation";
import Conversationtb from "../../components/conversations/conversationtopbar";
import Message from "../../components/message/Message";
import Messageown from "../../components/message/Messageown";
import { sendMessageRoute, recieveMessageRoute } from "../../utils/APIRoutes";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { Search } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";
import Picker from "emoji-picker-react";
import { BsEmojiLaughingFill } from "react-icons/bs";


export default function Messenger() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sk,setsk]=useState()
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  useEffect(async () => {
    if(currentChat)
    {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    }
    
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);
  useEffect(() => {
    // console.log(currentUser);
    if (currentUser) {
      
      socket.current = io(host);
      
      socket.current.emit("add-user", currentUser._id);
      if (socket.current) {
        console.log(socket.current);
        socket.current.on("msg-recieve", (msg) => {
          setArrivalMessage({ fromSelf: false, message: msg });
        });
      }
    }
  }, [currentUser]);
  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  
  
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);
  
  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        const { data1 } = await axios.post(`${setAvatarRoute}/${currentUser._id}`, {
          image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
        });
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
        const user = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        
        // navigate("/")
      }
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    handleChatChange(contact);
    // console.log(currentChat.username);
  };
  // useEffect(() => {
  //   if (socket.current) {
      
  //     socket.current.on("msg-recieve", (msg) => {
  //       setArrivalMessage({ fromSelf: false, message: msg });
  //     });
  //   }
    
  // }, []);
  return (
    
    <Container>
      <div className="messenger">
      <div className="chatOnline">
          <div className="chatOnlineWrapper">
          <div className="topbarLeft">
          <Link >
          <img
            src={
              "https://luv.vn/wp-content/uploads/2021/12/hinh-anh-gai-mat-vuong-xinh-dep-42.jpg"
            }
            alt=""
            className="topbarImg"
          />
          </Link>
          <ul class="sub-menu">
           
           <li><a href="#">your profile</a></li>
           <li><a href="#">Setting</a></li>
           <li><a href="#">log out</a>
           </li>
          </ul>
        
          </div>
          <div className="divimg"><img src="https://cdn-icons-png.flaticon.com/512/919/919904.png" alt="" className="iconleftmenu"/></div>
            <div className="divimg"><img src="https://img.icons8.com/ios/452/call-list.png" alt="" className="iconleftmenu"/></div>
            <div className="divimg"><img src="https://img.icons8.com/ios/452/today.png" alt="" className="iconleftmenu"/></div>
            <div className="divimg"><img src="https://img.icons8.com/ios/452/video-call.png" alt="" className="iconleftmenu"/></div>
            <div className="spacemenuleft"></div>
            <div className="divimg"><img src="https://img.icons8.com/ios/452/business.png" alt="" className="iconleftmenu"/></div>
            <div className="divimg2"><img src="https://img.icons8.com/external-yogi-aprelliyanto-basic-outline-yogi-aprelliyanto/452/external-setting-essential-element-yogi-aprelliyanto-basic-outline-yogi-aprelliyanto.png" alt="" className="iconleftmenu"/>
            <ul class="sub-menu">
           
            <li><a href="#">your profile</a></li>
            <li><a href="#">Setting</a></li>
            <li><a href="#">log out</a>
            </li>
            </ul>
            </div>
          </div>
        </div>
        
        <div className="chatMenu">
        <div className="chatMenuWrapper2">
        <div className="searchbar2">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="chatMenuInput"
          />
        </div>
        <div className="topbarIconItem">
            <img src="https://cdn-icons-png.flaticon.com/512/748/748137.png" className="iconuser" />
            
          </div>
          <div className="topbarIconItem">
            <img src="https://cdn-icons-png.flaticon.com/512/1387/1387940.png" className="icongroup" />
            
          </div>
        </div>
        <div className="menuNhom"><p className="nhom">All</p><p className="nhom">Group</p></div>
          <div className="chatMenuWrapper">
         
           
            
          <div className="contacts">
            {contacts.map((contact, index) => {
           
              return (
                <div key={contact._id}
                className={`contact ${
                  index === currentSelected ? "selected" : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}>
                <Conversation contact={contact} ></Conversation>
                </div>
              );
            })}
     
              </div>

          </div>
        </div>
        <div className="chatBox">
          <div className="topbarchat">
              <div className="conversation" >
              {currentChat === undefined ? (
                <h1>Chat</h1>
              ):(<Conversationtb currentChat={currentChat}  />)
              }
              </div>
              <div className="topbarIconItem">
              <img src="https://cdn-icons-png.flaticon.com/512/1387/1387940.png" className="icongroup" />
            
              </div>
              <div className="topbarIconItem">
              <img src="https://img.icons8.com/material-outlined/344/video-call.png" className="iconcall" />
            
              </div>
          </div>
          <div className="chatBoxWrapper">
                
                <div className="chatBoxTop">
                  
                    <div >
                    {messages.map((message) => {
                      // console.log(message);
                      return (
                        <div ref={scrollRef} key={uuidv4()}>
                          <div
                            className={`message ${
                              message.fromSelf ? "sended" : "recieved"
                            }`}
                          >
                            <div className="content ">
                              <p>{message.message}</p>
                            </div>
                          </div>
                        </div>
                      );               
        
                  })}
                    </div>
                 
                </div>
                <form onSubmit={(event) => sendChat(event)}>
                <div className="chatBoxBottom">
                  <div className="inputmess">
                  <div className="topbarIconItem">
                  <img src="https://img.icons8.com/ios/344/smiling.png" className="iconsmile" />
            
                  </div>
                    <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                    
                  ></textarea>
                  </div>
                  
                  <button className="chatSubmitButton" type="submit" >
                    Send
                  </button>
                  
                </div>
                </form>
          </div>
        </div>
        
      </div>
      </Container>
    
    
  );
}

const Container = styled.div`
  // height: 100vh;
  // width: 100vw;
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // gap: 1rem;
  // align-items: center;
  // background-color: blue;
.message {
  // background-color: blue;
  display: flex;
  align-items: center;
  height:30px;
  .content {
    display: flex;
    max-width: 40%;
    min-width: 3%;
    height:100%;
    justify-content: center;
    overflow-wrap: break-word;
    align-items: center;
    font-size: 1.1rem;
    border-radius: 0.5rem;
    color: black;
    
    
  }
}
.sended {
  align-items: flex-end;
  .content {
    background-color: white;
  }
}
.recieved {
  align-items: flex-start;
  .content {
    background-color: #9900ff20;
  }
}

`