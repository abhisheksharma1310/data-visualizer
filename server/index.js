import express from "express";
import cors from "cors";
import http from "http";
import { init as initSocket } from "./socket.js";

import serialRoutes from "./routes/serial.js";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: "10kb", extended: true }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));

const io = initSocket(server);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use("/serial", serialRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}`)
);
