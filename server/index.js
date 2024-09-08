import express from "express";
import cors from "cors";

import serialRoutes from "./routes/serial.js";

const app = express();

app.use(cors());

app.use(express.json({ limit: "10kb", extended: true }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));

app.use("/serial", serialRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}`)
);
