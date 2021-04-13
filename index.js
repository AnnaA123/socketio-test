"use strict";

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);
  console.log("a user connected", socket.id);

  socket.on("send username", (username) => {
    socket.username = username;
    users.find((user) => user.userID === socket.id).username = username;
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
  });

  socket.on("chat message", (msg) => {
    console.log("message: ", msg);
    const currentUser = users.find((user) => user.userID === socket.id)
      .username;
    io.emit("chat message", msg, currentUser);
  });
});

http.listen(3000, () => {
  console.log("listening on port 3000");
});
