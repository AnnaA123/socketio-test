"use strict";

const socket = io();

// add nickname
document.getElementById("nickname").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("name");
  socket.emit("send username", username.value);
});

//send message
document.getElementById("send").addEventListener("submit", (event) => {
  event.preventDefault();
  const inp = document.getElementById("m");
  socket.emit("chat message", inp.value);
  inp.value = "";
});
//list messages
socket.on("chat message", (msg, user) => {
  const item = document.createElement("li");
  item.innerHTML = user + " said: " + msg;
  document.getElementById("messages").appendChild(item);
});
