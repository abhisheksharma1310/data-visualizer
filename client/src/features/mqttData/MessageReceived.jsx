import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReceivedMessages, setClearMessage } from "./mqttDataSlice";
import { Button } from "antd";
import Scrollable from "../../components/Scrollable";
import DataViewer from "../../components/DataViewer/DataViewer";
import isValidJson from "../../utils/isValidJson";

const MessageReceived = ({ client, topic }) => {
  const dispatch = useDispatch();
  const { receivedMessages } = useSelector((state) => state.mqttData);

  const clearMessage = () => {
    dispatch(setClearMessage());
  };

  useEffect(() => {
    if (client) {
      const handleMessage = (topic, message) => {
        if (isValidJson(message)) {
          const json = JSON.parse(message);
          dispatch(
            setReceivedMessages({
              topic,
              ...json,
            })
          );
        } else {
          dispatch(
            setReceivedMessages({
              topic,
              value: message.toString(),
            })
          );
        }
      };

      client.on("connect", () => {
        console.log("Connected");
      });

      client.on("message", handleMessage);

      client.on("error", (error) => {
        console.error("Connection error:", error);
      });

      return () => {
        client.off("message", handleMessage);
      };
    }
  }, [client, dispatch]);

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>
          {receivedMessages[0]?.timestamp
            ? "Message Received"
            : "Not Received any message yet"}
        </h2>
        {receivedMessages[0]?.timestamp && (
          <Button type="primary" danger onClick={clearMessage}>
            Clear data
          </Button>
        )}
      </div>
      <Scrollable height="360px">
        <DataViewer jsonData={receivedMessages} />
      </Scrollable>
    </div>
  );
};

export default MessageReceived;
