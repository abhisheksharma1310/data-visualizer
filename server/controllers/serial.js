import { serialData } from "../utils/uart/serial.js";

export const getSerialData = async (req, res) => {
  const { comport = "COM15", baudrate = 9600, datatype = "json" } = req.query;
  try {
    serialData(comport, baudrate, datatype, res);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
