import express from "express";
const router = express.Router();

import { getSerialData } from "../controllers/serial.js";

router.get("/data", getSerialData);

export default router;
