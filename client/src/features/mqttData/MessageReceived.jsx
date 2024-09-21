import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReceivedMessage } from "./mqttDataSlice";
import { JsonToTable } from "react-json-to-table";
import { addNewData, clearData } from "./structureDataSlice";
import { Button } from "antd";

const MessageReceived = ({ client, topic }) => {
  const dispatch = useDispatch();
  const { receivedMessage } = useSelector((state) => state.mqttData);
  const { dataLog } = useSelector((state) => state.structureData);

  const handleAddData = (data) => {
    dispatch(addNewData(data));
  };

  const handleClearData = () => {
    dispatch(clearData());
  };

  useEffect(() => {
    if (client) {
      const handleMessage = (topic, message) => {
        console.log(topic, message);
        dispatch(setReceivedMessage(message.toString()));
        handleAddData({ [topic]: message.toString() });
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
          {receivedMessage
            ? "Message Received"
            : "Not Received any message yet"}
        </h2>
        {dataLog[0]?.time && (
          <Button type="primary" onClick={handleClearData}>
            Clear data
          </Button>
        )}
      </div>
      <JsonToTable json={dataLog} />
    </div>
  );
};

export default MessageReceived;
