import React from "react";
import { v4 as uuidV4 } from "uuid";
import "./home.css";
import homeImage from "../../assets/home.png";
import codeSign from "../../assets/codeSign.png";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar/navbar";
const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const createRoom = (e) => {
    e.preventDefault();
    const _id = uuidV4();
    setRoomId(_id);
    toast.success("new room created!");
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (!username || !roomId) {
      toast.error("provide username and id!");
      return;
    }
    console.log("clicked");
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };
  return (
    <div className="home-container">
      <NavBar />
      <div className="home-section">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="home-container-left">
          <img src={homeImage}></img>
        </div>
        <div className="home-container-right">
          <h4 className="join-label">JOIN ROOM</h4>
          <div className="input-group">
            <input
              type="text"
              className="input-box"
              placeholder="room id"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
            />
            <input
              type="text"
              className="input-box"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <button className="btn join-btn" onClick={joinRoom}>
              Join
            </button>
            <span className="create-room">
              create a room &nbsp;
              <a
                href=""
                className="createRoom-btn"
                onClick={(e) => createRoom(e)}
              >
                new room
              </a>
            </span>
          </div>
        </div>
      </div>
      <h4 className="footer">
        &lt;/&gt; &nbsp; By &nbsp;
        <a href="https://github.com/Badal-Jha">Badal Jha</a>
      </h4>
    </div>
  );
};
export default Home;
