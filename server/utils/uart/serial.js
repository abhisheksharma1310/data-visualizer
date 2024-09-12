import { SerialPort } from "serialport";
import { ReadlineParser } from "serialport";

export const serialData = (
  comPort,
  baudRate = 115200,
  dataType = "json",
  res
) => {
  const port = new SerialPort(
    {
      path: comPort,
      baudRate: Number(baudRate),
    },
    (error) => {
      if (error) {
        const msg = { error: error?.message };
        console.log(msg);
        res.status(404).json(msg);
      }
    }
  );

  const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  parser.on("data", (data) => {
    const dataObject = dataType == "raw" ? data : convertToJson(data);
    res.status(200).json(dataObject);
    console.log("S: ", dataObject);
    port.close();
  });
};

const convertToJson = (data) => {
  try {
    const jsonData = JSON.parse(data);
    //console.log("json: ", jsonData);
    return jsonData;
  } catch (error) {
    const msg = { error: error?.message };
    console.log(msg);
    res.status(404).json(msg);
  }
};
