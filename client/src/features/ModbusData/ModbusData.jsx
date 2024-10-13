import React, { useEffect, useState } from "react";
import WebSocket from "ws";
import Modbus from "modbus-serial";

const ModbusData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://your-server-url");

    ws.onopen = () => {
      const client = new Modbus.client.TCP("192.168.1.1", 502);
      client.on("data", (msg) => {
        setData(msg);
      });

      // Example Modbus read request
      client.readHoldingRegisters(0, 2).then((result) => {
        ws.send(result);
      });
    };

    ws.onmessage = (event) => {
      console.log("Received:", event.data);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>{data ? <div>Data: {data}</div> : <div>Waiting for data...</div>}</div>
  );
};

export default ModbusData;
