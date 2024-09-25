import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setServerAddress,
  setMessage,
  addReceivedMessage,
  setConnectionStatus,
  clearMessages,
} from "./webSocketSlice";
import { Button, Input } from "antd";
import Scrollable from "../../components/Scrollable";
import TextArea from "antd/es/input/TextArea";
import { JsonToTable } from "react-json-to-table";

const WebSocketData = () => {
  const dispatch = useDispatch();
  const { serverAddress, message, receivedMessages, connectionStatus } =
    useSelector((state) => state.webSocket);
  const socketRef = useRef(null);

  const connectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    socketRef.current = new WebSocket(serverAddress);

    socketRef.current.onopen = () => {
      dispatch(setConnectionStatus("Connected"));
    };

    socketRef.current.onmessage = (event) => {
      dispatch(addReceivedMessage(event.data));
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      dispatch(setConnectionStatus("Error"));
    };

    socketRef.current.onclose = () => {
      dispatch(setConnectionStatus("Disconnected"));
    };
  };

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
      dispatch(setMessage(""));
    }
  };

  const closeConnection = () => {
    if (socketRef.current) {
      socketRef.current.close();
      dispatch(setConnectionStatus("Disconnected"));
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        dispatch(setConnectionStatus("Disconnected"));
      }
    };
  }, []);

  return (
    <div>
      <div className="input-div">
        <Input
          addonBefore="WebSocketURL"
          type="text"
          value={serverAddress}
          placeholder="wss://echo.websocket.org"
          onChange={(e) => dispatch(setServerAddress(e.target.value))}
          disabled={connectionStatus === "Connected" ? true : false}
          className="input-item"
        />
        <Button
          type="primary"
          onClick={() => {
            if (connectionStatus === "Connected") {
              closeConnection();
            } else {
              connectWebSocket();
            }
          }}
          danger={connectionStatus === "Connected" ? true : false}
        >
          {connectionStatus === "Connected" ? "Disconnect" : "Connect"}
        </Button>
      </div>
      <div>
        <h3>Connection Status: {connectionStatus}</h3>
      </div>
      {connectionStatus === "Connected" && (
        <Scrollable height="300px">
          <div className="display-flex g-25">
            <div style={{ width: "80%" }}>
              <div className="display-flex">
                <h3>Received Messages:</h3>
                {receivedMessages[0]?.time && (
                  <Button
                    type="primary"
                    danger
                    onClick={() => dispatch(clearMessages())}
                  >
                    Clear Message
                  </Button>
                )}
              </div>
              <div style={{ margin: "20px 0" }}>
                <JsonToTable json={receivedMessages} />
              </div>
            </div>
            <div>
              <h3>Send Message</h3>
              <TextArea
                value={message}
                onChange={(e) => dispatch(setMessage(e.target.value))}
                placeholder="Enter message"
              ></TextArea>
              <Button
                type="primary"
                onClick={sendMessage}
                style={{ margin: "10px 0" }}
              >
                Send
              </Button>
            </div>
          </div>
        </Scrollable>
      )}
    </div>
  );
};

export default WebSocketData;
