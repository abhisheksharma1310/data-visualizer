import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import {
  setMqttDetails,
  setReceivedMessage,
  setSendMessage,
  setSubscribeToTopic,
  setPublishToTopic,
} from "./mqttDataSlice";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "antd";

const MqttData = () => {
  const dispatch = useDispatch();
  const {
    host,
    options,
    receivedMessage,
    sendMessage,
    subscribeToTopic,
    publishToTopic,
  } = useSelector((state) => state.mqttData);

  const {
    keepalive,
    clientId,
    protocolId,
    protocolVersion,
    clean,
    reconnectPeriod,
    connectTimeout,
  } = options;

  const [inputData, setInput] = useState({
    host: host,
    receivedMessage: receivedMessage,
    sendMessage: sendMessage,
    subscribeToTopic: subscribeToTopic,
    publishToTopic: publishToTopic,
  });

  const [inputOptions, setInputOptions] = useState({ ...options });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInput((p) => {
      return {
        ...p,
        [name]: value,
      };
    });
  };

  const handleInputOptionsChange = (event) => {
    const { name, value } = event.target;
    setInputOptions((p) => {
      return {
        ...p,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    const client = mqtt.connect(host, options);

    client.on("connect", () => {
      console.log("Connected");
      client.subscribe("temp");
    });

    client.on("message", (topic, message) => {
      dispatch(setReceivedMessage(message.toString()));
    });

    client.on("error", (error) => {
      console.error("Connection error:", error);
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
        <Input
          addonBefore="Host"
          type="text"
          name="host"
          value={inputData.host}
          onChange={handleInputChange}
          title="protocol://mqttHost:port"
          style={{ width: "400px" }}
        />
        <Input
          addonBefore="ClientId"
          type="text"
          name="clientId"
          value={inputOptions.clientId}
          onChange={handleInputOptionsChange}
          style={{ width: "400px" }}
        />
        <Input
          addonBefore="Keepalive"
          addonAfter="seconds"
          type="number"
          name="keepalive"
          value={inputOptions.keepalive}
          onChange={handleInputOptionsChange}
          style={{ width: "300px" }}
        />
        <Input
          addonBefore="ProtocolId"
          type="text"
          name="protocolId"
          value={inputOptions.protocolId}
          onChange={handleInputOptionsChange}
          style={{ width: "300px" }}
        />
      </div>
      <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
        <Input
          addonBefore="ProtocolVersion"
          type="number"
          name="protocolVersion"
          value={inputOptions.protocolVersion}
          onChange={handleInputOptionsChange}
          style={{ width: "250px" }}
        />
        <Input
          addonBefore="Clean"
          type="boolean"
          name="clean"
          value={inputOptions.clean}
          onChange={handleInputOptionsChange}
          style={{ width: "250px" }}
        />
        <Input
          addonBefore="ReconnectPeriod"
          type="number"
          name="reconnectPeriod"
          value={inputOptions.reconnectPeriod}
          onChange={handleInputOptionsChange}
          style={{ width: "250px" }}
        />
        <Input
          addonBefore="ConnectTimeout"
          type="number"
          name="connectTimeout"
          value={inputOptions.connectTimeout}
          onChange={handleInputOptionsChange}
          style={{ width: "250px" }}
        />
      </div>
      <h1>MQTT Client ID: {clientId}</h1>
      <h2>MQTT Message</h2>
      <p>{receivedMessage}</p>
    </div>
  );
};

export default MqttData;
