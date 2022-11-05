import React, { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import EditorSection from "../../components/editorSection/editorSection";
import NavBar from "../../components/navbar/navbar";
import User from "../../components/user/user";
import { initSocket } from "../../socket";
import { Toaster, toast } from "react-hot-toast";
import "./editor.css";
const Editor = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const params = useParams();
  const codeRef = useRef(null);

  const [connectedUsers, setConnectedUsers] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleError(err));
      socketRef.current.on("connect_failed", (err) => handleError(err));

      //handle errors
      function handleError(e) {
        console.log("socket error", e);
        toast.error("socket connection failed!!,try again...");
        reactNavigator("/");
      }
      //emits the event-> both client or server will listen to
      socketRef.current.emit("join", {
        roomId: params.roomId,
        username: location.state?.username,
      });

      //listning for joined event
      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} has joined the room`);
          console.log(`${username} joined`);
        }
        setConnectedUsers(clients);
        socketRef.current.emit("code-sync", {
          code: codeRef.current,
          socketId,
        });
      });

      //listning for disconnected emmit
      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setConnectedUsers((prev) => {
          return prev.filter((user) => user.socketId !== socketId);
        });
      });
    };
    init();

    //cleanup to avoid memory leakage
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off("joined");
      socketRef.current.off("disconnected");
    };
  }, []);

  //leave room
  const leaveRoom = () => {
    reactNavigator("/");
  };
  const copyId = async () => {
    try {
      //inbuild function
      await navigator.clipboard.writeText(params.roomId);
      toast.success("roomId had been copied");
    } catch (err) {
      toast.error("not able to copy");
      console.log(err);
    }
  };

  //if wrong room url
  if (!location.state) return <Navigate to="/" />;
  return (
    <div className="editor-container">
      <NavBar />
      <div className="editor-section">
        <div className="editor-left">
          <div className="editor-left-btn">
            <button className="copyId " onClick={copyId}>
              Copy RoomId
            </button>
            <button className="leaveRoom " onClick={leaveRoom}>
              Leave Room
            </button>
          </div>
          <div className="editor-left-inner">
            <Toaster position="top-center" reverseOrder={false} />
            <h4>Connected Users</h4>
            <div className="connectedUsers">
              {connectedUsers.map((user) => {
                return <User id={user.id} username={user.username} />;
              })}
            </div>
          </div>
        </div>
        <div className="editor-right">
          <EditorSection
            socketRef={socketRef}
            roomId={params.roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
