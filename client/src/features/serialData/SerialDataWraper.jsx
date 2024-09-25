import { Select, Space } from "antd";
import React, { useState } from "react";
import SerialDataBrowser from "./SerialDataBrowser";
import SerialDataNode from "./SerialDataNode";

const options = [
  {
    value: "browser",
    label: "Browser",
  },
  {
    value: "nodejs",
    label: "Node Js",
  },
];

const SerialDataWraper = () => {
  const [serialOption, setSerialOption] = useState("browser");

  const handleChange = (value) => {
    setSerialOption(value);
  };

  return (
    <div>
      <Space wrap>
        <Select
          defaultValue="Browser"
          style={{
            width: 120,
          }}
          onChange={handleChange}
          options={options}
        />
      </Space>
      <div style={{ margin: "10px 0" }}>
        {serialOption === "browser" ? (
          <SerialDataBrowser />
        ) : (
          <SerialDataNode />
        )}
      </div>
    </div>
  );
};

export default SerialDataWraper;
