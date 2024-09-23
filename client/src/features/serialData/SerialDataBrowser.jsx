import React, { useState, useRef } from "react";
import { Button, Input } from "antd";
import { JsonToTable } from "react-json-to-table";
import Scrollable from "../../components/Scrollable";

const SerialDataBrowser = () => {
  const [baudRate, setBaudRate] = useState(9600);
  const [data, setData] = useState([]);
  const [port, setPort] = useState(null);
  const [buffer, setBuffer] = useState("");
  const readerRef = useRef(null);
  const [isPortConnected, setIsPortConnected] = useState(false);
  const [error, setError] = useState("");

  const selectPort = async () => {
    try {
      const selectedPort = await navigator.serial.requestPort();
      setPort(selectedPort);
      const info = selectedPort.getInfo();
      console.log(
        `Port Name: ${info.usbVendorId}:${info.usbProductId} - ${JSON.stringify(
          info
        )}`
      );
    } catch (error) {
      console.error("Error selecting port:", error);
      setError("Error selecting port:", error);
    }
  };

  const openPort = async () => {
    if (port) {
      try {
        await port.open({ baudRate: parseInt(baudRate, 10) });
        const reader = port.readable.getReader();
        readerRef.current = reader;
        setIsPortConnected(true);
        readData(reader);
      } catch (error) {
        console.error("Error opening port:", error);
        setError("Error opening port:", error);
        setIsPortConnected(false);
      }
    }
  };

  const readData = async (reader) => {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        const text = new TextDecoder().decode(value);
        const time = new Date().toLocaleTimeString();
        setBuffer((prevBuffer) => {
          const newBuffer = prevBuffer + text;
          const messages = newBuffer.split("\n");
          const completeMessages = messages.slice(0, -1);
          const incompleteMessage = messages[messages.length - 1];
          completeMessages.forEach((message) => {
            try {
              const parsedMessage = JSON.parse(message);
              const structuredData = {
                time,
                ...parsedMessage,
              };
              setData((prevData) => [structuredData, ...prevData]);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              setError("Error parsing JSON:", error);
            }
          });
          return incompleteMessage;
        });
      }
    } catch (error) {
      console.error("Error reading data:", error);
      setError("Error reading data:", error);
    }
  };

  const closePort = async () => {
    if (port) {
      try {
        await port.close();
        setPort(null);
        setData([]);
        setBuffer("");
        setIsPortConnected(false);
      } catch (error) {
        console.error("Error closing port:", error);
        setError("Error closing port:", error);
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: "5px" }}>
        <Button type="primary" onClick={selectPort}>
          {!!port?.getInfo()?.usbProductId ? "Port Selected" : "Select Port"}
        </Button>
        <Input
          type="number"
          value={baudRate}
          onChange={(e) => setBaudRate(e.target.value)}
          placeholder="Enter Baud Rate"
          style={{ width: "100px" }}
        />
        <Button onClick={() => (isPortConnected ? closePort() : openPort())}>
          {isPortConnected ? "Close Port" : "Open Port"}
        </Button>
        {data[0] && (
          <Button type="primary" onClick={() => setData([])}>
            Clear Data
          </Button>
        )}
      </div>
      <div>
        <h2>Received Data:</h2>
        <Scrollable height="360px">
          <JsonToTable json={data || error} />
        </Scrollable>
      </div>
    </div>
  );
};

export default SerialDataBrowser;
