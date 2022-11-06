const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const path = require("path");
//
app.use(express.static("build"));
//serve every time
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
//provide port
const PORT = process.env.PORT || 5000;
const io = new Server(server);
//get connected clients
function getConnectedClients(roomId) {
  //map to array->io.sockets.adapter.rooms.get(roomId) gives map
  const clientList = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMapping[socketId],
      };
    }
  );
  return clientList;
}
//map user with socket id we can suse reddis or a db to store this
const userSocketMapping = {};

//io.on this is first function called when connection is made between client and server
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  //socket.on->this is used both in client side and server side to listen to the event which is emitted by socket.emit and run the code inside it
  socket.on("join", ({ roomId, username }) => {
    userSocketMapping[socket.id] = username;
    socket.join(roomId);
    const clients = getConnectedClients(roomId);
    console.log(clients, roomId);
    clients.forEach((client) => {
      io.to(client.socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });
  //code change
  socket.on("code-change", ({ roomId, code }) => {
    console.log("receiveing on backend", code);

    socket.in(roomId).emit("code-change", { code });
  });
  socket.on("code-sync", ({ socketId, code }) => {
    io.to(socketId).emit("code-change", { code });
  });
  //disconnect
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMapping[socket.id],
      });
    });
    delete userSocketMapping[socket.id];
    //to leave the rpp
    socket.leave();
  });
});
// The server is listening to two events Code Change and Code Sync
// Code Change is emitted when the user changes the code
// Code Sync is called when the user joins the room to sync the previously typed code
server.listen(PORT, () => {
  console.log("server connected");
});
