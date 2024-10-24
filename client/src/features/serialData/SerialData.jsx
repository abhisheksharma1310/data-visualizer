import React, { useState, useRef } from "react";
import { Button, Input, Switch } from "antd";
import Scrollable from "../../components/Scrollable";
import JsonTable from "../../components/JsonTable/JsonTable";

const SerialData = () => {
  const [baudRate, setBaudRate] = useState(9600);
  const [data, setData] = useState([]);
  const [port, setPort] = useState(null);
  const [buffer, setBuffer] = useState("");
  const readerRef = useRef(null);
  const [isPortConnected, setIsPortConnected] = useState(false);
  const [error, setError] = useState("");
  const [writeValue, setWriteValue] = useState("");
  const [dataType, setDataType] = useState("JSON");

  const selectPort = async () => {
    try {
      const selectedPort = await navigator.serial.requestPort();
      setPort(selectedPort);
    } catch (error) {
      console.error("Error selecting port:", error);
      setError("Error selecting port:" + error);
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
        setError("Error opening port:" + error);
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
          const newBuffer = prevBuffer + text.toString();
          const messages = newBuffer.split("\n");
          const completeMessages = messages.slice(0, -1);
          const incompleteMessage = messages[messages.length - 1];
          if (dataType === "JSON") {
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
                setError("Error parsing JSON:" + error);
              }
            });
          } else if (completeMessages.length > 0) {
            const structuredData = {
              time,
              data: completeMessages,
            };
            setData((prevData) => [structuredData, ...prevData]);
          }
          return incompleteMessage;
        });
      }
    } catch (error) {
      console.error("Error reading data:", error);
      setError("Error reading data:" + error);
    }
  };

  const closePort = async () => {
    if (port) {
      try {
        if (readerRef.current) {
          await readerRef.current.cancel();
          readerRef.current.releaseLock();
        }
        await port.close();
        setPort(null);
        setData([]);
        setBuffer("");
        setIsPortConnected(false);
      } catch (error) {
        console.error("Error closing port:", error);
        setError("Error closing port:" + error);
      }
    }
  };

  const writeData = async () => {
    if (port) {
      try {
        const writer = port.writable.getWriter();
        await writer.write(new TextEncoder().encode(writeValue));
        writer.releaseLock();
        setWriteValue("");
      } catch (error) {
        console.error("Error writing data:", error);
        setError("Error writing data:" + error);
      }
    }
  };

  return (
    <div>
      <div className="input-div">
        <Button type="primary" onClick={selectPort}>
          {!!port?.getInfo()?.usbProductId ? "Port Selected" : "Select Port"}
        </Button>
        <Input
          addonBefore="Baudrate"
          type="number"
          value={baudRate}
          onChange={(e) => setBaudRate(e.target.value)}
          placeholder="Enter Baud Rate"
          required
          style={{ width: "200px" }}
        />
        <Switch
          title="Data Type"
          checkedChildren="JSON"
          unCheckedChildren="RAW"
          defaultChecked
          onChange={(checked) =>
            checked ? setDataType("JSON") : setDataType("RAW")
          }
        />
        <Button onClick={() => (isPortConnected ? closePort() : openPort())}>
          {isPortConnected ? "Close Port" : "Open Port"}
        </Button>
        {data.length > 0 && (
          <Button type="primary" onClick={() => setData([])}>
            Clear Data
          </Button>
        )}
      </div>
      <div>{error && <p>{error.toString()}</p>}</div>
      {isPortConnected && (
        <div className="input-div">
          <Input
            addonBefore="Write Data"
            placeholder="Enter Data to Send"
            value={writeValue}
            onChange={(e) => setWriteValue(e.target.value)}
            style={{ width: "200px" }}
          />
          <Button type="primary" onClick={writeData}>
            Send Data
          </Button>
        </div>
      )}
      <div>
        <h2>Received Data: </h2>
        <Scrollable height="360px">
          <JsonTable jsonData={data} />
        </Scrollable>
      </div>
    </div>
  );
};

export default SerialData;
