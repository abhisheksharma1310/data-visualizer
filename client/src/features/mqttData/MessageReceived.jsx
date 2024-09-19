import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReceivedMessage } from "./mqttDataSlice";

const MessageReceived = ({ client, topic }) => {
  const dispatch = useDispatch();
  const { receivedMessage } = useSelector((state) => state.mqttData);
  //sync mqtt function call
  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        console.log("Connected");
      });

      client.on("message", (topic, message) => {
        console.log(topic, message);
        dispatch(setReceivedMessage(message.toString()));
      });

      client.on("error", (error) => {
        console.error("Connection error:", error);
      });
    }

    // return () => {
    //   if (client) {
    //     client.end();
    //     setMqttClient((p) => {
    //       return {
    //         ...p,
    //         client,
    //         isConnected: false,
    //       };
    //     });
    //   }
    // };
  }, [client, dispatch]);

  return (
    <div>
      <h2>
        {receivedMessage ? "Message Received" : "Not Received any message yet"}
      </h2>
      <pre>{receivedMessage}</pre>
    </div>
  );
};

export default MessageReceived;
