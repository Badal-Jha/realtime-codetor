import { io } from "socket.io-client";

export const initSocket = async () => {
  console.log("called");
  const options = {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: "Infinity",
    forceNew: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    autoConnect: true,
    secure: true,
  };
  const socket = io(process.env.REACT_APP_BACKEND_URL, options);
  return socket;
};
