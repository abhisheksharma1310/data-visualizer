import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReceivedMessages, setClearMessage } from "./mqttDataSlice";
import { JsonToTable } from "react-json-to-table";
import { Button } from "antd";

const MessageReceived = ({ client, topic }) => {
  const dispatch = useDispatch();
  const { receivedMessages } = useSelector((state) => state.mqttData);

  console.log(receivedMessages);

  const clearMessage = () => {
    dispatch(setClearMessage());
  };

  useEffect(() => {
    if (client) {
      const handleMessage = (topic, message) => {
        console.log(topic, message);
        dispatch(
          setReceivedMessages({
            topic,
            value: message.toString(),
          })
        );
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
          {receivedMessages[0]?.time
            ? "Message Received"
            : "Not Received any message yet"}
        </h2>
        {receivedMessages[0]?.time && (
          <Button type="primary" danger onClick={clearMessage}>
            Clear data
          </Button>
        )}
      </div>
      <JsonToTable json={receivedMessages} />
    </div>
  );
};

export default MessageReceived;
