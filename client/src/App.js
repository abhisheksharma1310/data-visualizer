import * as React from "react";
import { ConfigProvider, theme } from "antd";
import MainLayout from "./components/layout/main-layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SerialDataWraper from "./features/serialData/SerialDataWraper";
import HttpData from "./features/httpData/HttpData";
import MqttData from "./features/mqttData/mqttData";
import WebSocketData from "./features/webSocket/WebSocketData";

import "./App.css";
import Home from "./components/Home";

export default function App() {
  return (
    <div className="App">
      <Router>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#00b96b",
              // colorBgContainer: "#001529",
              colorPrimaryText: "#ffffff",
              // 1. Use dark algorithm
              algorithm: theme.darkAlgorithm,
            },
          }}
        >
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/serial-data" element={<SerialDataWraper />} />
              <Route path="/http-data" element={<HttpData />} />
              <Route path="/mqtt-data" element={<MqttData />} />
              <Route path="/webSocket-data" element={<WebSocketData />} />
            </Routes>
          </MainLayout>
        </ConfigProvider>
      </Router>
    </div>
  );
}
