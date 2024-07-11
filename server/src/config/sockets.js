const io = require("../config/server");

io.on("connect", (socket) => {
  console.log("New client connected");

  socket.on("message", (data) => {
    console.log("Message received: ", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (error) => {
    console.error("Error: ", error);
  });
});

/* 

Example for client side:
const socket = require("socket.io-client")("ws://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to the server");
  socket.emit("message", "Hello from client");
});

*/
