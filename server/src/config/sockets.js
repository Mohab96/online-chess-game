const io = require("../config/server");

io.on("connection", (socket) => {
  console.log("New client connected");

  // Listen for a 'message' event from the client
  socket.on("message", (data) => {
    console.log("Message received: ", data);

    // Send a response back to the client
    socket.emit("message", `Server received: ${data}`);
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (error) => {
    console.error("Error: ", error);
  });
});
