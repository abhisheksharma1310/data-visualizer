// socket.js
import { Server } from "socket.io";

let io;

export const init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
};
