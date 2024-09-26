import React, { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";
import {
  setMqttDetails,
  setSubscribeToTopic,
  setPublishToTopic,
  setSendMessage,
} from "./mqttDataSlice";
import { useSelector, useDispatch } from "react-redux";
import { Button, Input, Space, Select, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import MessageReceived from "./MessageReceived";
import Scrollable from "../../components/Scrollable";

const pubSubOptions = [
  {
    value: "publish",
    label: "Publish To Topic",
  },
  {
    value: "subscribe",
    label: "Subscribe To Topic",
  },
];

const MqttData = () => {
  const dispatch = useDispatch();
  const {
    host,
    options,
    receivedMessages,
    sendMessage,
    subscribeToTopic,
    publishToTopic,
  } = useSelector((state) => state.mqttData);

  const [inputData, setInputData] = useState({
    host: host,
    receivedMessages: receivedMessages,
    sendMessage: sendMessage,
    subscribeToTopic: subscribeToTopic,
    publishToTopic: publishToTopic,
  });

  const [inputOptions, setInputOptions] = useState({ ...options });

  const [mqttClient, setMqttClient] = useState({
    client: null,
    isConnected: false,
    reconnect: false,
    reconnectCount: 0,
    error: null,
  });

  const [currentPubSubValue, setCurrentPubSubValue] = useState("subscribe");
  const [subscribedToTopic, setSubscribedToTopic] = useState(false);

  const mqttClientRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputData((p) => {
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

  const handlePubSubChange = (event) => {
    setCurrentPubSubValue(event);
  };

  //mqtt functions
  const connectClient = () => {
    dispatch(
      setMqttDetails({
        host: inputData.host,
        options: inputOptions,
      })
    );

    if (mqttClientRef.current) {
      mqttClientRef.current.end();
    }

    mqttClientRef.current = mqtt.connect(inputData.host);
    if (mqttClientRef.current.connected) {
      setMqttClient({
        client: mqttClientRef.current,
        isConnected: true,
        reconnect: false,
        reconnectCount: 0,
        error: null,
      });
    } else {
      setMqttClient({
        client: null,
        isConnected: false,
        reconnect: true,
        reconnectCount: 0,
        error: null,
      });
    }
  };

  const subscribeTopic = () => {
    if (mqttClient.client && inputData.subscribeToTopic) {
      dispatch(setSubscribeToTopic(inputData.subscribeToTopic));
      mqttClient.client.subscribe(inputData.subscribeToTopic);
      setSubscribedToTopic(true);
    }
  };

  const publishMessage = () => {
    if (
      mqttClient.client &&
      inputData.publishToTopic &&
      inputData.sendMessage
    ) {
      dispatch(setSendMessage(inputData.sendMessage));
      dispatch(setPublishToTopic(inputData.publishToTopic));
      mqttClient.client.publish(
        inputData.publishToTopic,
        inputData.sendMessage
      );
    }
  };

  const disconnectClient = () => {
    if (mqttClient.client) {
      mqttClient.client.end();
      setMqttClient({
        client: null,
        isConnected: false,
        reconnect: false,
        error: null,
      });
    }
  };

  useEffect(() => {
    if (mqttClient.reconnect) {
      const setId = setInterval(() => {
        setMqttClient((p) => {
          return {
            ...p,
            reconnectCount: p.reconnectCount + 1,
          };
        });
        if (mqttClientRef.current?.connected) {
          setMqttClient({
            client: mqttClientRef.current,
            isConnected: true,
            reconnect: false,
            reconnectCount: 0,
            error: null,
          });
          clearInterval(setId);
        }
      }, 3000);
    }
  }, [mqttClient.reconnect]);

  return (
    <div>
      {!mqttClient.isConnected && (
        <>
          <div className="input-div">
            <Input
              addonBefore="Host"
              type="text"
              name="host"
              value={inputData.host}
              onChange={handleInputChange}
              title="protocol://mqttHost:port"
              className="input-item"
            />
            <Input
              addonBefore="ClientId"
              type="text"
              name="clientId"
              value={inputOptions.clientId}
              onChange={handleInputOptionsChange}
              className="input-item"
            />
            <Input
              addonBefore="Keepalive"
              addonAfter="seconds"
              type="number"
              name="keepalive"
              value={inputOptions.keepalive}
              onChange={handleInputOptionsChange}
              className="input-item"
            />
            <Input
              addonBefore="ProtocolId"
              type="text"
              name="protocolId"
              value={inputOptions.protocolId}
              onChange={handleInputOptionsChange}
              className="input-item"
            />
          </div>
          <div className="input-div">
            <Input
              addonBefore="ProtocolVersion"
              type="number"
              name="protocolVersion"
              value={inputOptions.protocolVersion}
              onChange={handleInputOptionsChange}
              className="input-item"
            />
            <Input
              addonBefore="Clean"
              type="boolean"
              name="clean"
              value={inputOptions.clean}
              onChange={handleInputOptionsChange}
              className="input-item"
            />
            <Input
              addonBefore="ReconnectPeriod"
              type="number"
              name="reconnectPeriod"
              value={inputOptions.reconnectPeriod}
              onChange={handleInputOptionsChange}
              className="input-item"
            />
            <Input
              addonBefore="ConnectTimeout"
              type="number"
              name="connectTimeout"
              value={inputOptions.connectTimeout}
              onChange={handleInputOptionsChange}
              className="input-item"
            />
          </div>
          <div className="input-div">
            <Input
              addonBefore="User Name"
              type="text"
              name="userName"
              value={inputOptions.userName}
              onChange={handleInputOptionsChange}
              className="input-item max-width-20"
            />
            <Input
              addonBefore="Password"
              type="password"
              name="password"
              value={inputOptions.password}
              onChange={handleInputOptionsChange}
              className="input-item max-width-20"
            />
          </div>
        </>
      )}
      <div className="input-div">
        <Button
          type="primary"
          disabled={mqttClient.isConnected}
          onClick={connectClient}
        >
          {mqttClient.isConnected
            ? "Connected to MQTT server"
            : "Connect to MQTT server"}
        </Button>
        {mqttClient.isConnected && (
          <Button type="primary" danger onClick={disconnectClient}>
            Disconnect from MQTT server
          </Button>
        )}
        {mqttClient.isConnected && (
          <Space.Compact>
            <Select
              defaultValue="subscribe"
              options={pubSubOptions}
              onChange={handlePubSubChange}
            />
            <Input
              value={
                currentPubSubValue === "subscribe"
                  ? inputData.subscribeToTopic
                  : inputData.publishToTopic
              }
              name={
                currentPubSubValue === "subscribe"
                  ? "subscribeToTopic"
                  : "publishToTopic"
              }
              onChange={(event) => {
                handleInputChange(event);
                setSubscribedToTopic(false);
              }}
            />
          </Space.Compact>
        )}
      </div>
      {!mqttClient.isConnected && mqttClient.reconnect && (
        <div>
          <div>
            <p>Connecting... </p>
            <Spin
              spinning={mqttClient.reconnect}
              percent={mqttClient.reconnectCount}
              delay={"500"}
            />
          </div>
          <p>Reconnect count: {mqttClient.reconnectCount}</p>
          {mqttClient.reconnectCount > 5 && (
            <p>
              Please check entered detailed. It look like your mqtt broker are
              not running.
            </p>
          )}
        </div>
      )}
      <div>
        {mqttClient.isConnected && (
          <div className="display-flex g-25">
            <div className="max-width">
              <Button
                type="primary"
                disabled={subscribedToTopic}
                onClick={subscribeTopic}
              >
                {subscribedToTopic
                  ? `Subscribed to topic ${subscribeToTopic}`
                  : `Subscribe to topic ${inputData.subscribeToTopic}`}
              </Button>
              {subscribedToTopic && (
                <MessageReceived
                  client={mqttClient.client}
                  topic={inputData.subscribeToTopic}
                />
              )}
            </div>

            <div className="input-item">
              <h2>Message to publish</h2>
              <TextArea name="sendMessage" onChange={handleInputChange}>
                {inputData.sendMessage}
              </TextArea>
              <Button
                type="primary"
                onClick={publishMessage}
                style={{ margin: "10px 0" }}
              >
                Publish Message
              </Button>
              <h3>Last message published:</h3>
              <Scrollable height="500px">
                <p style={{ whiteSpace: "wrap" }}>{sendMessage}</p>
              </Scrollable>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MqttData;
