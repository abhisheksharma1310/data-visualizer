const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // Add this line

const app = express();
app.use(cors()); // Add this line

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust this if you need stricter origin controls
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (msg) => {
    console.log("message: " + msg);
    io.emit("message", msg); // Broadcast message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
