import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  addMessage,
  clearMessages,
  setConnectionStatus,
  setConnectionDetails,
} from "./socketSlice";
import { Button, Input } from "antd";
import Scrollable from "../../components/Scrollable";
import TextArea from "antd/es/input/TextArea";
import { JsonToTable } from "react-json-to-table";

const SocketIoData = () => {
  const [input, setInput] = useState("");
  const [serverURL, setServerURL] = useState("http://localhost:5000");
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { messages, isConnected, connectionDetails } = useSelector(
    (state) => state.socketIo
  );

  const handleConnect = () => {
    if (!serverURL) return;
    if (socketRef.current) socketRef.current.disconnect();

    socketRef.current = io(serverURL);
    socketRef.current.on("connect", () => {
      dispatch(setConnectionStatus(true));
      dispatch(
        setConnectionDetails({
          id: socketRef.current.id,
          transport: socketRef.current.io.engine.transport.name,
        })
      );
    });
    socketRef.current.on("message", (data) => {
      const new_data = {
        time: new Date().toLocaleTimeString(),
        data: data,
      };
      dispatch(addMessage(new_data));
    });
    socketRef.current.on("disconnect", () => {
      dispatch(setConnectionStatus(false));
      dispatch(setConnectionDetails({}));
    });
  };

  const handleDisconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      dispatch(setConnectionStatus(false));
      dispatch(setConnectionDetails({}));
    }
  };

  const sendMessage = () => {
    if (socketRef.current) {
      socketRef.current.emit("message", input);
      setInput("");
    }
  };

  useEffect(() => {
    return () => {
      handleDisconnect();
    };
  }, []);

  return (
    <div>
      <div className="input-div">
        <Input
          type="text"
          placeholder="Server URL"
          value={serverURL}
          onChange={(e) => setServerURL(e.target.value)}
          className="input-item"
        />
        <Button
          type="primary"
          onClick={isConnected ? handleDisconnect : handleConnect}
          danger={isConnected}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </Button>
      </div>
      <div>
        <h3>
          Connection Status: {isConnected ? "Connected" : "Disconnected"}
          {isConnected && <>, Client Id: {connectionDetails?.id}</>}
        </h3>
      </div>
      {isConnected && (
        <div className="display-flex g-25">
          <div className="max-width">
            <div className="display-flex">
              <h3>Received Messages:</h3>
              {messages[0] && (
                <Button
                  type="primary"
                  danger
                  onClick={() => dispatch(clearMessages())}
                >
                  Clear Message
                </Button>
              )}
            </div>
            <Scrollable height="360px">
              <JsonToTable json={messages} />
            </Scrollable>
          </div>
          <div className="input-item">
            <h3>Send Message</h3>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter message"
              required
            ></TextArea>
            <Button
              type="primary"
              onClick={sendMessage}
              disabled={!isConnected}
              style={{ margin: "10px 0" }}
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocketIoData;
