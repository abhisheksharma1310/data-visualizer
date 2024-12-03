import React, { useState, useRef, useEffect } from "react";
import { Button, Input } from "antd";
import DataViewer from "../../components/DataViewer/DataViewer";

const SerialData = () => {
  const [baudRate, setBaudRate] = useState(9600);
  const [data, setData] = useState([]);
  const [port, setPort] = useState(null);
  const [buffer, setBuffer] = useState("");
  const readerRef = useRef(null);
  const [isPortConnected, setIsPortConnected] = useState(false);
  const [error, setError] = useState("");
  const [writeValue, setWriteValue] = useState("");

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
        const time = new Date();
        setBuffer((prevBuffer) => {
          const newBuffer = prevBuffer + text.toString();
          const messages = newBuffer.split("\n");
          const completeMessages = messages.slice(0, -1);
          const incompleteMessage = messages[messages.length - 1];

          completeMessages.forEach((message) => {
            try {
              //const data = JSON.parse(message);
              const structuredData = {
                timestamp: time,
                data: message,
              };
              setData((prevData) => [structuredData, ...prevData]);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              setError("Error parsing JSON:" + error);
            }
          });
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

  useEffect(() => {
    return () => {
      closePort();
    };
  }, []);

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
        {!!port?.getInfo()?.usbProductId && (
          <Button
            onClick={() => (isPortConnected ? closePort() : openPort())}
            danger={isPortConnected}
          >
            {isPortConnected ? "Close Port" : "Open Port"}
          </Button>
        )}
        {data.length > 0 && (
          <Button type="primary" onClick={() => setData([])} danger>
            Clear Data
          </Button>
        )}
        {isPortConnected && (
          <>
            <Input
              addonBefore="Write Data"
              placeholder="Enter Data to Send"
              value={writeValue}
              onChange={(e) => setWriteValue(e.target.value)}
              style={{ width: "400px" }}
            />
            <Button type="primary" onClick={writeData}>
              Send Data
            </Button>
          </>
        )}
      </div>
      <div>{error && <p>{error.toString()}</p>}</div>
      {data.length > 0 && (
        <div>
          <h2>Received Data: </h2>
          <DataViewer jsonData={data} />
        </div>
      )}
    </div>
  );
};

export default SerialData;
